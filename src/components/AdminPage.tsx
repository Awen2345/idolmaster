import React, { useState, useEffect } from 'react';
import { ArrowLeft, Shield, Ban, CheckCircle, RefreshCw } from 'lucide-react';

interface User {
  id: number;
  username: string;
  banned_until: string | null;
  ban_reason: string | null;
}

export function AdminPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [targetUserId, setTargetUserId] = useState('');
  const [duration, setDuration] = useState('60'); // Minutes
  const [reason, setReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUserId || !duration) return;

    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/ban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: parseInt(targetUserId), 
          durationMinutes: parseInt(duration), 
          reason 
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`User ${targetUserId} banned until ${new Date(data.bannedUntil).toLocaleString()}`);
        fetchUsers();
        setTargetUserId('');
        setReason('');
      } else {
        alert("Failed to ban: " + data.error);
      }
    } catch (err) {
      console.error("Ban error", err);
      alert("Network error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnban = async (userId: number) => {
    if (!confirm(`Unban user ${userId}?`)) return;
    
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/unban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (data.success) {
        alert(`User ${userId} unbanned`);
        fetchUsers();
      } else {
        alert("Failed to unban: " + data.error);
      }
    } catch (err) {
      console.error("Unban error", err);
      alert("Network error");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-slate-700 pb-4">
          <button 
            onClick={() => onNavigate('main')}
            className="flex items-center text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Studio
          </button>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-red-500">
            <Shield className="w-8 h-8" />
            Admin Panel
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Ban Form */}
          <div className="md:col-span-1 bg-slate-800 p-6 rounded-xl border border-slate-700 h-fit">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-400">
              <Ban className="w-5 h-5" />
              Ban User
            </h2>
            <form onSubmit={handleBan} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">User ID</label>
                <input 
                  type="number" 
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:border-red-500 outline-none"
                  placeholder="e.g. 1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Duration (Minutes)</label>
                <input 
                  type="number" 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:border-red-500 outline-none"
                  placeholder="60"
                  required
                />
                <div className="flex gap-2 mt-1 text-xs">
                  <button type="button" onClick={() => setDuration('60')} className="text-blue-400 hover:underline">1h</button>
                  <button type="button" onClick={() => setDuration('1440')} className="text-blue-400 hover:underline">24h</button>
                  <button type="button" onClick={() => setDuration('10080')} className="text-blue-400 hover:underline">7d</button>
                  <button type="button" onClick={() => setDuration('525600')} className="text-blue-400 hover:underline">1y</button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Reason</label>
                <textarea 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white focus:border-red-500 outline-none h-24 resize-none"
                  placeholder="Violation of TOS..."
                />
              </div>
              <button 
                type="submit" 
                disabled={actionLoading || !targetUserId}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition-colors"
              >
                {actionLoading ? 'Processing...' : 'Ban User'}
              </button>
            </form>
          </div>

          {/* User List */}
          <div className="md:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                User List
                <span className="text-sm font-normal text-slate-400">({users.length})</span>
              </h2>
              <button onClick={fetchUsers} className="text-slate-400 hover:text-white">
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 text-sm">
                    <th className="p-2">ID</th>
                    <th className="p-2">Username</th>
                    <th className="p-2">Status</th>
                    <th className="p-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {users.map(user => {
                    const isBanned = user.banned_until && new Date(user.banned_until) > new Date();
                    return (
                      <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                        <td className="p-2 font-mono text-slate-400">{user.id}</td>
                        <td className="p-2 font-bold">{user.username}</td>
                        <td className="p-2">
                          {isBanned ? (
                            <div className="text-red-400 text-xs">
                              <div className="font-bold flex items-center gap-1">
                                <Ban className="w-3 h-3" /> BANNED
                              </div>
                              <div>Until: {new Date(user.banned_until!).toLocaleDateString()}</div>
                              <div className="italic opacity-75">{user.ban_reason}</div>
                            </div>
                          ) : (
                            <div className="text-green-400 text-xs flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Active
                            </div>
                          )}
                        </td>
                        <td className="p-2 text-right">
                          {isBanned ? (
                            <button 
                              onClick={() => handleUnban(user.id)}
                              className="text-green-400 hover:text-green-300 hover:underline text-xs"
                            >
                              Unban
                            </button>
                          ) : (
                            <button 
                              onClick={() => setTargetUserId(user.id.toString())}
                              className="text-red-400 hover:text-red-300 hover:underline text-xs"
                            >
                              Select
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {users.length === 0 && !loading && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-slate-500">No users found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
