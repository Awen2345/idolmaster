import React, { useState, useEffect } from 'react';
import { Home, Bird, Mic2, Music, RefreshCcw, Menu, Headphones, ChevronLeft } from 'lucide-react';
import { NavBtn } from './Shared';
import { MenuOverlay } from './MenuOverlay';
import { MusicPlayer } from './MusicPlayer';
import { PlaylistPanel, PlaylistItem } from './PlaylistPanel';
import { YouTubeSearch } from './YouTubeSearch';
import { motion, AnimatePresence } from 'motion/react';

// SOUND BOOTH PAGE
export function SoundBoothPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
  const [currentVideo, setCurrentVideo] = useState<PlaylistItem | null>(null);
  const [activeTab, setActiveTab] = useState<'search' | 'playlist'>('playlist');

  // Load playlist from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('soundbooth_playlist');
      if (saved) {
        setPlaylist(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load playlist", e);
    }
  }, []);

  // Save playlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('soundbooth_playlist', JSON.stringify(playlist));
    } catch (e) {
      console.error("Failed to save playlist", e);
    }
  }, [playlist]);

  const addToPlaylist = (video: PlaylistItem) => {
    if (!playlist.some(item => item.videoId === video.videoId)) {
      setPlaylist([...playlist, video]);
      // Switch to playlist tab to show it was added
      setActiveTab('playlist');
    }
  };

  const removeFromPlaylist = (videoId: string) => {
    setPlaylist(playlist.filter(item => item.videoId !== videoId));
    if (currentVideo?.videoId === videoId) {
      setCurrentVideo(null);
    }
  };

  const playNext = () => {
    if (!currentVideo || playlist.length === 0) return;
    const currentIndex = playlist.findIndex(p => p.videoId === currentVideo.videoId);
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentVideo(playlist[nextIndex]);
  };

  const playPrev = () => {
    if (!currentVideo || playlist.length === 0) return;
    const currentIndex = playlist.findIndex(p => p.videoId === currentVideo.videoId);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentVideo(playlist[prevIndex]);
  };

  return (
    <div className="min-h-screen bg-slate-800 flex justify-center font-sans">
      <div className="w-full max-w-md bg-white relative overflow-hidden shadow-2xl flex flex-col h-screen">
        {/* Header */}
        <header className="flex justify-between items-center bg-gradient-to-b from-blue-800 to-blue-950 p-1 border-b-2 border-blue-400 shadow-md z-20 shrink-0">
          <div onClick={() => onNavigate('main')}>
            <NavBtn icon={<Home size={20} />} label="My Studio" color="from-blue-400 to-blue-600" />
          </div>
          <div onClick={() => onNavigate('petit')}>
            <NavBtn icon={<Bird size={20} />} label="Petit CG" color="from-orange-300 to-orange-500" />
          </div>
          <div onClick={() => onNavigate('gacha')}>
            <NavBtn icon={<Mic2 size={20} />} label="Gacha" color="from-green-400 to-green-600" />
          </div>
          <NavBtn icon={<Music size={20} />} label="Lesson" color="from-purple-400 to-purple-600" />
          <NavBtn icon={<RefreshCcw size={20} />} label="Free Trade" color="from-orange-400 to-red-500" />
          <div onClick={() => setIsMenuOpen(true)}>
            <NavBtn icon={<Menu size={20} />} label="Menu" color="from-pink-500 to-rose-600" rounded />
          </div>
        </header>

        {/* Sub Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center py-2 font-bold text-sm shadow-inner relative border-b-2 border-orange-700 shrink-0">
          <Headphones size={16} className="absolute left-4 top-2 opacity-80" />
          Sound Booth
          <Headphones size={16} className="absolute right-4 top-2 opacity-80" />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">
          {/* Player Section */}
          <div className="p-3 bg-gray-900 border-b border-gray-700 shrink-0">
            <MusicPlayer 
              videoId={currentVideo?.videoId || null} 
              title={currentVideo?.title || null}
              onNext={playNext}
              onPrev={playPrev}
              onEnded={playNext}
            />
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-300 bg-white shrink-0">
            <button 
              onClick={() => setActiveTab('playlist')}
              className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 ${activeTab === 'playlist' ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50' : 'text-gray-500'}`}
            >
              <Music size={16} />
              Playlist ({playlist.length})
            </button>
            <button 
              onClick={() => setActiveTab('search')}
              className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 ${activeTab === 'search' ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50' : 'text-gray-500'}`}
            >
              <Mic2 size={16} />
              Search Songs
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-3">
            {activeTab === 'playlist' ? (
              <PlaylistPanel 
                playlist={playlist} 
                currentVideoId={currentVideo?.videoId || null}
                onPlay={setCurrentVideo}
                onRemove={removeFromPlaylist}
              />
            ) : (
              <YouTubeSearch onAdd={addToPlaylist} />
            )}
          </div>
        </div>

        {/* Footer Back Button */}
        <div className="flex bg-gray-800 text-white border-t border-gray-600 shrink-0">
          <div 
            onClick={() => onNavigate('main')}
            className="flex-1 p-3 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-700"
          >
            <ChevronLeft size={20} className="text-yellow-500" />
            <span className="font-bold text-sm">To My Studio</span>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && <MenuOverlay onClose={() => setIsMenuOpen(false)} onNavigate={onNavigate} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
