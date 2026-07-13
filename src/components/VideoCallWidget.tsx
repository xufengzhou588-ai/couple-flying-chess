import { useEffect, useRef, useState } from 'react';
import { Minimize2, UserRound, Video, VideoOff } from 'lucide-react';
import { Translation } from '../i18n';

interface VideoCallWidgetProps {
  copy: Translation;
}

export function VideoCallWidget({ copy }: VideoCallWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
  }, [stream, isOpen]);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [stream]);

  const startCamera = async () => {
    setError('');
    try {
      const nextStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 320 },
          height: { ideal: 420 }
        },
        audio: true
      });
      stream?.getTracks().forEach(track => track.stop());
      setStream(nextStream);
    } catch {
      setError(copy.video.denied);
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach(track => track.stop());
    setStream(null);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        className="fixed right-4 top-[calc(env(safe-area-inset-top)+88px)] z-[80] flex h-11 w-11 items-center justify-center rounded-2xl border border-white/14 bg-[#171018]/86 text-white shadow-2xl backdrop-blur-xl transition active:scale-95"
        onClick={() => setIsOpen(true)}
        aria-label={copy.video.open}
      >
        <Video size={19} />
      </button>
    );
  }

  return (
    <div className="fixed right-3 top-[calc(env(safe-area-inset-top)+86px)] z-[80] w-[136px] overflow-hidden rounded-[24px] border border-white/14 bg-[#120d16]/92 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-2.5 py-2">
        <div className="min-w-0 truncate text-[10px] font-black text-white">{copy.video.title}</div>
        <button
          type="button"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white/72 active:scale-95"
          onClick={() => setIsOpen(false)}
          aria-label={copy.video.open}
        >
          <Minimize2 size={14} />
        </button>
      </div>

      <div className="relative m-2 aspect-[9/13] overflow-hidden rounded-[19px] border border-white/10 bg-black/36">
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/[0.045] text-center">
          <UserRound size={26} className="text-rose-100/72" />
          <div className="mt-2 px-3 text-[10px] font-bold leading-tight text-white/56">
            {copy.video.waiting}
          </div>
        </div>
        <div className="absolute left-2 top-2 rounded-full bg-black/34 px-2 py-0.5 text-[9px] font-bold text-white/68">
          {copy.video.partner}
        </div>

        <div className="absolute bottom-2 right-2 h-[58px] w-[44px] overflow-hidden rounded-2xl border border-white/22 bg-black/52 shadow-xl">
          {stream ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="h-full w-full scale-x-[-1] object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-white/52">
              <UserRound size={16} />
            </div>
          )}
          <div className="absolute bottom-0.5 left-0.5 rounded-full bg-black/42 px-1 py-0.5 text-[8px] font-bold text-white/78">
            {copy.video.local}
          </div>
        </div>
      </div>

      {error && <div className="px-3 pb-2 text-[10px] leading-relaxed text-rose-200">{error}</div>}

      <div className="px-2 pb-2">
        <button
          type="button"
          className="flex h-8 w-full items-center justify-center gap-1 rounded-2xl bg-white text-[10px] font-black text-[#16090f] active:scale-[0.98]"
          onClick={stream ? stopCamera : startCamera}
        >
          {stream ? <VideoOff size={14} /> : <Video size={14} />}
          {stream ? copy.video.stop : copy.video.start}
        </button>
        <p className="mt-1.5 text-center text-[8px] leading-relaxed text-white/42">{copy.video.hint}</p>
      </div>
    </div>
  );
}
