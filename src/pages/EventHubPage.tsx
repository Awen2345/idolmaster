import React, { useState, useEffect } from 'react';
import { ChevronLeft, Calendar, Star, PlayCircle, Gift } from 'lucide-react';
import { motion } from 'motion/react';

export function EventHubPage({ onNavigate, userId }: { onNavigate: (page: string, params?: any) => void, userId: number }) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load events", err);
        setLoading(false);
      });
  }, []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'tour': return <Star className="text-yellow-400" size={24} />;
      case 'groove': return <PlayCircle className="text-pink-400" size={24} />;
      case 'pvp': return <Star className="text-red-400" size={24} />;
      default: return <Calendar className="text-blue-400" size={24} />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'tour': return 'from-yellow-600 to-orange-800 border-yellow-500';
      case 'groove': return 'from-pink-600 to-purple-800 border-pink-500';
      case 'pvp': return 'from-red-600 to-rose-900 border-red-500';
      default: return 'from-blue-600 to-indigo-800 border-blue-500';
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto h-screen bg-slate-900 overflow-hidden flex flex-col font-sans text-slate-100">
      {/* Header */}
      <header className="flex items-center justify-between bg-gradient-to-b from-indigo-600 to-purple-800 p-3 border-b-2 border-indigo-400 shadow-md z-10">
        <button onClick={() => onNavigate('main')} className="p-1 bg-black/20 rounded-full hover:bg-black/40 transition-colors">
          <ChevronLeft size={24} className="text-white" />
        </button>
        <h1 className="text-lg font-black text-white drop-shadow-md italic tracking-wider flex items-center gap-2">
          <Calendar size={20} />
          EVENT HUB
        </h1>
        <div className="w-8"></div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <Calendar size={48} className="mb-4 opacity-50" />
            <p>No active events at the moment.</p>
          </div>
        ) : (
          events.map(event => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-gradient-to-br ${getEventColor(event.type)} rounded-xl border-2 shadow-lg overflow-hidden cursor-pointer hover:brightness-110 transition-all`}
              onClick={() => onNavigate(`event_${event.type}`, { eventId: event.id })}
            >
              <div className="relative h-32 bg-black/30 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/event/400/200')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                <div className="relative z-10 text-center p-4">
                  <div className="flex justify-center mb-2">{getEventIcon(event.type)}</div>
                  <h2 className="text-xl font-black text-white drop-shadow-md italic tracking-wide">{event.name}</h2>
                  <div className="text-xs font-bold text-white/80 bg-black/50 px-2 py-1 rounded-full inline-block mt-2">
                    {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="p-3 bg-black/40 backdrop-blur-sm flex justify-between items-center">
                <div className="text-xs text-slate-200">{event.description}</div>
                <button className="bg-white text-black text-xs font-bold px-4 py-1.5 rounded-full shadow hover:bg-slate-200">
                  ENTER
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
