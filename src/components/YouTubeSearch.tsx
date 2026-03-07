import React, { useState } from 'react';
import { Search, Plus, Loader2, AlertCircle } from 'lucide-react';
import { PlaylistItem } from './PlaylistPanel';

// YOUTUBE SEARCH
interface YouTubeSearchProps {
  onAdd: (video: PlaylistItem) => void;
}

export function YouTubeSearch({ onAdd }: YouTubeSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PlaylistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Check for API key
      const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
      
      let data;
      
      if (!apiKey) {
        // Mock data fallback if no API key
        console.warn("No YouTube API Key found. Using mock data.");
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        data = {
          items: [
            {
              id: { videoId: 'dQw4w9WgXcQ' },
              snippet: {
                title: 'Rick Astley - Never Gonna Give You Up',
                channelTitle: 'Rick Astley',
                thumbnails: { default: { url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg' } }
              }
            },
            {
              id: { videoId: 'y6120QOlsfU' },
              snippet: {
                title: 'Darude - Sandstorm',
                channelTitle: 'Darude',
                thumbnails: { default: { url: 'https://i.ytimg.com/vi/y6120QOlsfU/default.jpg' } }
              }
            },
             {
              id: { videoId: 'L_jWHffIx5E' },
              snippet: {
                title: 'Smash Mouth - All Star',
                channelTitle: 'SmashMouthVEVO',
                thumbnails: { default: { url: 'https://i.ytimg.com/vi/L_jWHffIx5E/default.jpg' } }
              }
            }
          ]
        };
      } else {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=5&key=${apiKey}`
        );
        
        if (!response.ok) {
           // Fallback to mock if quota exceeded or error
           throw new Error('YouTube API request failed');
        }
        
        data = await response.json();
      }

      const formattedResults = data.items.map((item: any) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.default.url,
        channelTitle: item.snippet.channelTitle
      }));

      setResults(formattedResults);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to load YouTube results. Please try again.");
      // Fallback mock data on error for demo purposes
       setResults([
            {
              videoId: 'dQw4w9WgXcQ',
              title: 'Rick Astley - Never Gonna Give You Up (Demo Result)',
              thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg',
              channelTitle: 'Rick Astley'
            }
       ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search YouTube..."
          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 text-red-600 p-2 rounded text-xs flex items-center gap-2">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      <div className="space-y-2">
        {results.map((video) => (
          <div key={video.videoId} className="flex items-center gap-2 bg-white p-2 rounded border border-gray-200 shadow-sm">
            <img src={video.thumbnail} alt={video.title} className="w-12 h-9 object-cover rounded" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate" title={video.title}>{video.title}</p>
              <p className="text-[10px] text-gray-500 truncate">{video.channelTitle}</p>
            </div>
            <button 
              onClick={() => onAdd(video)}
              className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
              title="Add to Playlist"
            >
              <Plus size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
