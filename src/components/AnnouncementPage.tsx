import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, Bird, Mic2, Music, RefreshCcw, Menu, ChevronLeft, Bell, Calendar, AlertCircle
} from 'lucide-react';
import { NavBtn } from './Shared';
import { MenuOverlay } from './MenuOverlay';

type Announcement = {
  id: number;
  title: string;
  date: string;
  content: string;
  type: 'event' | 'update' | 'maintenance';
};

const ANNOUNCEMENTS: Announcement[] = [
  { 
    id: 1, 
    title: "Starlight Festival is Live!", 
    date: "2026-03-06", 
    content: "The new Starlight Festival gacha is now available. Get double the chance to pull SSR idols! Don't miss out on the limited time idols.",
    type: 'event'
  },
  { 
    id: 2, 
    title: "Version 2.5 Update", 
    date: "2026-03-04", 
    content: "We have updated the game to version 2.5. This update includes new formation features, UI improvements, and bug fixes.",
    type: 'update'
  },
  { 
    id: 3, 
    title: "Scheduled Maintenance", 
    date: "2026-03-01", 
    content: "There will be a scheduled maintenance on March 10th from 02:00 to 06:00 (JST). The game will be unavailable during this time.",
    type: 'maintenance'
  },
];

export function AnnouncementPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-slate-800 flex justify-center font-sans">
      <div className="w-full max-w-md bg-white relative overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center bg-gradient-to-b from-blue-800 to-blue-950 p-1 border-b-2 border-blue-400 shadow-md z-20">
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
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center py-2 font-bold text-sm shadow-inner relative border-b-2 border-orange-700">
          <Bell size={16} className="absolute left-4 top-2 opacity-80" />
          Announcements
          <Bell size={16} className="absolute right-4 top-2 opacity-80" />
        </div>

        {/* Announcements List */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-3 space-y-3">
          {ANNOUNCEMENTS.map(announcement => (
            <div key={announcement.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div 
                className="p-3 flex items-start gap-3 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setSelectedAnnouncement(selectedAnnouncement === announcement.id ? null : announcement.id)}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  announcement.type === 'event' ? 'bg-pink-100 text-pink-500' : 
                  announcement.type === 'update' ? 'bg-blue-100 text-blue-500' : 
                  'bg-yellow-100 text-yellow-600'
                }`}>
                  {announcement.type === 'event' ? <Calendar size={20} /> : 
                   announcement.type === 'update' ? <RefreshCcw size={20} /> : 
                   <AlertCircle size={20} />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm text-gray-800 leading-tight">{announcement.title}</h4>
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">{announcement.date}</span>
                </div>
              </div>
              
              <AnimatePresence>
                {selectedAnnouncement === announcement.id && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 pt-0 border-t border-gray-100 text-xs text-gray-600 leading-relaxed bg-gray-50">
                      {announcement.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="flex bg-gray-800 text-white border-t border-gray-600">
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
