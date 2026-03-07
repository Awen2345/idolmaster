import React from 'react';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';

// MUSIC PLAYER
interface MusicPlayerProps {
  videoId: string | null;
  title: string | null;
  onNext: () => void;
  onPrev: () => void;
  onEnded: () => void;
}

export function MusicPlayer({ videoId, title, onNext, onPrev, onEnded }: MusicPlayerProps) {
  if (!videoId) {
    return (
      <div className="w-full aspect-video bg-gray-900 flex items-center justify-center text-gray-500 rounded-lg overflow-hidden shadow-inner border border-gray-700">
        <div className="text-center">
          <p className="text-sm font-bold">No song playing</p>
          <p className="text-xs">Select a song from the playlist</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg border border-gray-700 relative">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={(e) => {
             // Note: We can't easily detect 'onEnded' with just an iframe without the YT Player API script.
             // For a simple implementation, we rely on user clicking next, or we could use 'react-youtube' library if allowed.
             // The user said "Only add new components or minimal integration", so I'll stick to iframe.
          }}
        ></iframe>
      </div>
      
      <div className="bg-gray-800 p-3 rounded-lg border border-gray-600 flex items-center justify-between shadow-md">
        <div className="overflow-hidden">
          <p className="text-white font-bold text-sm truncate">{title || 'Unknown Title'}</p>
          <p className="text-xs text-green-400 font-mono">Now Playing</p>
        </div>
        <div className="flex gap-4">
          <button onClick={onPrev} className="text-gray-300 hover:text-white transition-colors">
            <SkipBack size={24} />
          </button>
          <button onClick={onNext} className="text-gray-300 hover:text-white transition-colors">
            <SkipForward size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
