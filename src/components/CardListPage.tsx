import React, { useState, useEffect } from 'react';
import { Card } from '../types';
import { motion } from 'motion/react';
import { ArrowLeft, Download, Filter } from 'lucide-react';

interface CardListPageProps {
  onNavigate: (page: any) => void;
}

export function CardListPage({ onNavigate }: CardListPageProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [groupBy, setGroupBy] = useState<'rarity' | 'attribute'>('rarity');

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cards');
      const data = await res.json();
      setCards(data);
    } catch (err) {
      console.error("Failed to fetch cards", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!confirm("This will fetch 200 cards from Starlight Kirara. It may take a few seconds. Continue?")) return;
    
    setImporting(true);
    try {
      const res = await fetch('/api/admin/fetch-cards', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchCards();
      } else {
        alert("Import failed: " + data.error);
      }
    } catch (err) {
      console.error("Import error", err);
      alert("Import failed");
    } finally {
      setImporting(false);
    }
  };

  const groupedCards = cards.reduce((acc, card) => {
    const key = groupBy === 'rarity' ? card.rarity : (card.attribute || 'Unknown');
    if (!acc[key]) acc[key] = [];
    acc[key].push(card);
    return acc;
  }, {} as Record<string, Card[]>);

  // Sort keys
  const sortedKeys = Object.keys(groupedCards).sort((a, b) => {
    if (groupBy === 'rarity') {
      const order = ['SSR', 'SR', 'R', 'N'];
      return order.indexOf(a) - order.indexOf(b);
    }
    return a.localeCompare(b);
  });

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => onNavigate('main')}
            className="flex items-center text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
          <h1 className="text-2xl font-bold">Card Album</h1>
          <div className="flex gap-2">
            <button 
              onClick={() => setGroupBy(g => g === 'rarity' ? 'attribute' : 'rarity')}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors"
            >
              <Filter className="w-4 h-4" />
              Group by {groupBy === 'rarity' ? 'Attribute' : 'Rarity'}
            </button>
            <button 
              onClick={handleImport}
              disabled={importing}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              {importing ? 'Importing...' : 'Import Cards'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading cards...</div>
        ) : (
          <div className="space-y-8">
            {sortedKeys.map(group => (
              <div key={group}>
                <h2 className="text-xl font-bold mb-4 border-b border-slate-700 pb-2 flex items-center gap-2">
                  {group}
                  <span className="text-sm font-normal text-slate-400">({groupedCards[group].length})</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {groupedCards[group].map(card => (
                    <motion.div 
                      key={card.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-indigo-500 transition-colors group"
                    >
                      <div className="relative bg-slate-900">
                        <img 
                          src={card.img} 
                          alt={card.name}
                          className="w-full h-auto object-cover"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                        <div className="absolute top-1 right-1 bg-black/60 px-1.5 py-0.5 rounded text-xs font-bold">
                          {card.rarity}
                        </div>
                        {card.attribute && (
                          <div className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-xs font-bold ${
                            card.attribute === 'Cute' ? 'bg-pink-500/80' :
                            card.attribute === 'Cool' ? 'bg-blue-500/80' :
                            card.attribute === 'Passion' ? 'bg-orange-500/80' : 'bg-gray-500/80'
                          }`}>
                            {card.attribute}
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <div className="font-bold text-sm truncate" title={card.name}>{card.name}</div>
                        <div className="flex justify-between text-xs text-slate-400 mt-1">
                          <span>ATK {card.atk}</span>
                          <span>DEF {card.def}</span>
                        </div>
                        {card.passiveSkill && (
                          <div className="mt-2 text-[10px] bg-indigo-900/50 text-indigo-300 p-1 rounded border border-indigo-700/50 line-clamp-2" title={card.passiveSkill.description}>
                            <span className="font-bold">{
                              card.passiveSkill.type === 'exp_boost' ? 'EXP Boost' :
                              card.passiveSkill.type === 'money_boost' ? 'Money Boost' :
                              card.passiveSkill.type === 'fan_boost' ? 'Fan Boost' :
                              card.passiveSkill.type === 'stamina_reduction' ? 'Stamina Red.' : 'Skill'
                            }:</span> {card.passiveSkill.value}%
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
