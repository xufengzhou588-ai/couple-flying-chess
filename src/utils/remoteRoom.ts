export type RemoteRoomStatus = 'ready' | 'missing-config';

export interface RemoteRoomConfig {
  status: RemoteRoomStatus;
  supabaseUrl: string;
  hasAnonKey: boolean;
}

export function getRemoteRoomConfig(): RemoteRoomConfig {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  return {
    status: supabaseUrl && supabaseAnonKey ? 'ready' : 'missing-config',
    supabaseUrl,
    hasAnonKey: !!supabaseAnonKey
  };
}

export function createRemoteChannelName(roomCode: string) {
  return `couple-flight-room:${roomCode.toUpperCase()}`;
}
