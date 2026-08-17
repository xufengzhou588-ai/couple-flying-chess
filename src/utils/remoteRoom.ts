import { createClient, type RealtimeChannel } from '@supabase/supabase-js';

import { GameState } from '../types';
import { supabasePublicConfig } from '../config/backend';

export type RemoteRoomStatus = 'ready' | 'missing-config';
export type RemoteSyncStatus = 'idle' | 'missing-config' | 'connecting' | 'connected' | 'error';
export type RemoteRoomRole = 'host' | 'guest';

export interface RemoteParticipant {
  clientId: string;
  role: RemoteRoomRole;
  joinedAt: number;
  lastSeenAt: number;
}

export interface RemotePresenceSnapshot {
  participants: RemoteParticipant[];
  onlineCount: number;
  hasPartner: boolean;
  hasHost: boolean;
  hasGuest: boolean;
}

export interface RemoteRoomConfig {
  status: RemoteRoomStatus;
  supabaseUrl: string;
  hasAnonKey: boolean;
}

interface RemoteStatePayload {
  senderId: string;
  senderRole: RemoteRoomRole;
  sentAt: number;
  state: GameState;
}

interface RemoteStateRequestPayload {
  senderId: string;
  senderRole: RemoteRoomRole;
  sentAt: number;
}

interface RemoteRoomConnection {
  sendState: (state: GameState) => void;
  requestState: () => void;
  disconnect: () => void;
}

let remoteClient: ReturnType<typeof createClient> | null = null;

function createEmptyPresenceSnapshot(): RemotePresenceSnapshot {
  return {
    participants: [],
    onlineCount: 0,
    hasPartner: false,
    hasHost: false,
    hasGuest: false
  };
}

export function getRemoteRoomConfig(): RemoteRoomConfig {
  const { url: supabaseUrl, publishableKey: supabaseAnonKey } = supabasePublicConfig;

  return {
    status: supabaseUrl && supabaseAnonKey ? 'ready' : 'missing-config',
    supabaseUrl,
    hasAnonKey: !!supabaseAnonKey
  };
}

export function createRemoteChannelName(roomCode: string) {
  return `couple-flight-room:${normalizeRoomCode(roomCode)}`;
}

export function normalizeRoomCode(roomCode: string | null | undefined) {
  return (roomCode || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12);
}

export function createRoomCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
}

function normalizePresence(
  channel: RealtimeChannel,
  clientId: string
): RemotePresenceSnapshot {
  const state = channel.presenceState<{
    clientId?: string;
    role?: RemoteRoomRole;
    joinedAt?: number;
    lastSeenAt?: number;
  }>();
  const participants = Object.values(state)
    .flat()
    .map(item => ({
      clientId: typeof item.clientId === 'string' ? item.clientId : '',
      role: item.role === 'host' || item.role === 'guest' ? item.role : 'guest',
      joinedAt: typeof item.joinedAt === 'number' ? item.joinedAt : Date.now(),
      lastSeenAt: typeof item.lastSeenAt === 'number' ? item.lastSeenAt : Date.now()
    }))
    .filter(item => item.clientId.length > 0)
    .reduce<RemoteParticipant[]>((acc, item) => {
      const existingIndex = acc.findIndex(peer => peer.clientId === item.clientId);
      if (existingIndex === -1) {
        acc.push(item);
        return acc;
      }

      if (item.lastSeenAt > acc[existingIndex].lastSeenAt) {
        acc[existingIndex] = item;
      }
      return acc;
    }, [])
    .sort((a, b) => a.joinedAt - b.joinedAt);

  return {
    participants,
    onlineCount: participants.length,
    hasPartner: participants.some(peer => peer.clientId !== clientId),
    hasHost: participants.some(peer => peer.role === 'host'),
    hasGuest: participants.some(peer => peer.role === 'guest')
  };
}

function getRemoteClient() {
  if (remoteClient) return remoteClient;

  const { url: supabaseUrl, publishableKey: supabaseAnonKey } = supabasePublicConfig;
  if (!supabaseUrl || !supabaseAnonKey) return null;

  remoteClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    },
    realtime: {
      params: {
        eventsPerSecond: 8
      }
    }
  });

  return remoteClient;
}

export function connectRemoteRoom(
  roomCode: string,
  clientId: string,
  role: RemoteRoomRole,
  handlers: {
    onState: (state: GameState, payload: RemoteStatePayload) => void;
    onStatus: (status: RemoteSyncStatus) => void;
    onPresence?: (snapshot: RemotePresenceSnapshot) => void;
    onStateRequest?: (payload: RemoteStateRequestPayload) => void;
  }
): RemoteRoomConnection | null {
  const normalizedRoomCode = normalizeRoomCode(roomCode);
  const client = getRemoteClient();

  if (!client || !normalizedRoomCode) {
    handlers.onStatus('missing-config');
    handlers.onPresence?.(createEmptyPresenceSnapshot());
    return null;
  }

  handlers.onStatus('connecting');

  const joinedAt = Date.now();
  let presenceHeartbeat: ReturnType<typeof setInterval> | null = null;
  const trackPresence = () => {
    void channel.track({
      clientId,
      role,
      joinedAt,
      lastSeenAt: Date.now()
    });
  };
  const updatePresence = () => {
    handlers.onPresence?.(normalizePresence(channel, clientId));
  };

  const channel: RealtimeChannel = client
    .channel(createRemoteChannelName(normalizedRoomCode), {
      config: {
        broadcast: {
          self: false
        },
        presence: {
          key: clientId
        }
      }
    })
    .on('presence', { event: 'sync' }, updatePresence)
    .on('presence', { event: 'join' }, updatePresence)
    .on('presence', { event: 'leave' }, updatePresence)
    .on('broadcast', { event: 'game-state' }, message => {
      const payload = message.payload as RemoteStatePayload | null;
      if (!payload || payload.senderId === clientId || !payload.state) return;
      handlers.onState(payload.state, payload);
    })
    .on('broadcast', { event: 'state-request' }, message => {
      const payload = message.payload as RemoteStateRequestPayload | null;
      if (!payload || payload.senderId === clientId) return;
      handlers.onStateRequest?.(payload);
    })
    .subscribe(status => {
      if (status === 'SUBSCRIBED') {
        trackPresence();
        if (!presenceHeartbeat) {
          presenceHeartbeat = setInterval(trackPresence, 25000);
        }
        handlers.onStatus('connected');
        return;
      }

      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
        if (presenceHeartbeat) {
          clearInterval(presenceHeartbeat);
          presenceHeartbeat = null;
        }
        handlers.onStatus('error');
        handlers.onPresence?.(createEmptyPresenceSnapshot());
      }
    });

  return {
    sendState: state => {
      void channel.send({
        type: 'broadcast',
        event: 'game-state',
        payload: {
          senderId: clientId,
          senderRole: role,
          sentAt: Date.now(),
          state
        } satisfies RemoteStatePayload
      });
    },
    requestState: () => {
      void channel.send({
        type: 'broadcast',
        event: 'state-request',
        payload: {
          senderId: clientId,
          senderRole: role,
          sentAt: Date.now()
        } satisfies RemoteStateRequestPayload
      });
    },
    disconnect: () => {
      if (presenceHeartbeat) {
        clearInterval(presenceHeartbeat);
        presenceHeartbeat = null;
      }
      void channel.untrack();
      handlers.onPresence?.(createEmptyPresenceSnapshot());
      client.removeChannel(channel);
    }
  };
}
