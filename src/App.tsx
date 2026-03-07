import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { MainPage } from './components/MainPage';
import { PetitPage } from './components/PetitPage';
import { FormationPage } from './components/FormationPage';
import { GachaPage } from './components/GachaPage';
import { InboxPage } from './components/InboxPage';
import { AnnouncementPage } from './components/AnnouncementPage';
import { CardListPage } from './components/CardListPage';
import { AdminPage } from './components/AdminPage';
import { Card, UserState } from './types';
import { ALL_CARDS } from './constants';

const CLIENT_VERSION = "1.0.0";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<'main' | 'petit' | 'formation' | 'gacha' | 'inbox' | 'announcement' | 'cardList' | 'admin'>('main');
  
  const [config, setConfig] = useState<any>(null);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);

  const [userState, setUserState] = useState<UserState | null>(null);
  const [formation, setFormation] = useState<(Card | null)[]>([null, null, null, null, null]);

  useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        if (data.version !== CLIENT_VERSION) {
          setShowUpdatePopup(true);
        }
      })
      .catch(err => console.error("Failed to fetch config", err));
  }, []);

  const fetchUserData = async (id: number) => {
    try {
      const res = await fetch(`/api/user/${id}`);
      const data = await res.json();
      setUserState({
        starJewels: data.starJewels,
        coins: data.coins,
        stamina: data.stamina,
        maxStamina: data.maxStamina,
        staminaDrinks: data.staminaDrinks,
        inventory: data.inventory
      });
      setFormation(data.formation);
    } catch (err) {
      console.error("Failed to fetch user data", err);
    }
  };

  const handleLogin = async (id: number) => {
    setUserId(id);
    await fetchUserData(id);
    setIsLoggedIn(true);
  };

  if (!config) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;

  if (config.eos) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white p-4 text-center">
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 max-w-md">
          <h1 className="text-2xl font-bold text-red-500 mb-4">End of Service</h1>
          <p>{config.eosMessage}</p>
        </div>
      </div>
    );
  }

  if (config.maintenance) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white p-4 text-center">
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 max-w-md">
          <h1 className="text-2xl font-bold text-yellow-500 mb-4">Maintenance</h1>
          <p>{config.maintenanceMessage}</p>
        </div>
      </div>
    );
  }

  if (showUpdatePopup) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white p-4 text-center">
        <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 max-w-md">
          <h1 className="text-2xl font-bold text-blue-500 mb-4">Update Required</h1>
          <p className="mb-6">A new version of the app is available. Please update to continue playing.</p>
          <button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
            Reload App
          </button>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !userState) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (currentPage === 'petit') {
    return <PetitPage onNavigate={setCurrentPage} />;
  }

  if (currentPage === 'gacha') {
    return <GachaPage onNavigate={setCurrentPage} userState={userState} setUserState={setUserState} userId={userId!} />;
  }

  if (currentPage === 'inbox') {
    return <InboxPage onNavigate={setCurrentPage} userId={userId!} />;
  }

  if (currentPage === 'announcement') {
    return <AnnouncementPage onNavigate={setCurrentPage} />;
  }

  if (currentPage === 'cardList') {
    return <CardListPage onNavigate={setCurrentPage} />;
  }

  if (currentPage === 'admin') {
    return <AdminPage onNavigate={setCurrentPage} />;
  }

  if (currentPage === 'formation') {
    return (
      <FormationPage 
        onNavigate={setCurrentPage} 
        initialFormation={formation} 
        onSave={async (newFormation) => {
          setFormation(newFormation);
          setCurrentPage('main');
          // Save to backend
          await fetch(`/api/formation/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ formation: newFormation.map(c => c ? c.id : null) })
          });
        }} 
        inventory={userState.inventory}
      />
    );
  }

  return <MainPage onNavigate={setCurrentPage} formation={formation} userState={userState} userId={userId} />;
}
