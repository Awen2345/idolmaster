import React from 'react';
import { Trash2, Play, Music } from 'lucide-react';

// PLAYLIST PLAYER
export interface PlaylistItem {
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

interface PlaylistPanelProps {
  playlist: PlaylistItem[];
  currentVideoId: string | null;
  onPlay: (video: PlaylistItem) => void;
  onRemove: (videoId: string) => void;
}

export function PlaylistPanel({ playlist, currentVideoId, onPlay, onRemove }: PlaylistPanelProps) {
  if (playlist.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
        <Music size={48} className="mx-auto text-gray-300 mb-2" />
        <p className="text-gray-500 font-bold">No songs in playlist</p>
        <p className="text-xs text-gray-400">Search and add songs to start listening</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
      {playlist.map((item) => (
        <div 
          key={item.videoId} 
          className={`flex items-center gap-2 p-2 rounded-lg border shadow-sm transition-all ${
            currentVideoId === item.videoId 
              ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-200' 
              : 'bg-white border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div 
            className="relative w-16 h-12 shrink-0 cursor-pointer group rounded overflow-hidden"
            onClick={() => onPlay(item)}
          >
            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Play size={20} className="text-white fill-current" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onPlay(item)}>
            <h4 className={`text-xs font-bold truncate ${currentVideoId === item.videoId ? 'text-blue-600' : 'text-gray-800'}`}>
              {item.title}
            </h4>
            <p className="text-[10px] text-gray-500 truncate">{item.channelTitle}</p>
          </div>
          
          <button 
            onClick={(e) => { e.stopPropagation(); onRemove(item.videoId); }}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
