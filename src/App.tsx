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
import { ErrorBoundary } from './components/ErrorBoundary'; // NEW

import { SoundBoothPage } from './components/SoundBoothPage'; // NEW
import { WorkPage } from './pages/WorkPage'; // NEW
import { LiveBattlePage } from './pages/LiveBattlePage'; // NEW
import { EventHubPage } from './pages/EventHubPage'; // NEW
import { TourEventPage } from './pages/TourEventPage'; // NEW

const CLIENT_VERSION = "1.0.0";

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<'main' | 'petit' | 'formation' | 'gacha' | 'inbox' | 'announcement' | 'cardList' | 'admin' | 'soundbooth' | 'work' | 'live' | 'events' | 'event_tour'>('main');
  const [currentEventId, setCurrentEventId] = useState<string | null>(null);
  
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
      if (!res.ok) throw new Error("Failed to fetch user data");
      const data = await res.json();
      setUserState({
        starJewels: data.starJewels ?? 0,
        coins: data.coins ?? 0,
        stamina: data.stamina ?? 0,
        maxStamina: data.maxStamina ?? 0,
        staminaDrinks: data.staminaDrinks ?? 0,
        inventory: data.inventory ?? []
      });
      setFormation(data.formation || [null, null, null, null, null]);
    } catch (err) {
      console.error("Failed to fetch user data", err);
      alert("Failed to load user data. Please try again.");
    }
  };

  const handleLogin = async (id: number) => {
    setUserId(id);
    await fetchUserData(id);
    setIsLoggedIn(true);
  };

  const handleNavigate = (page: string, params?: any) => {
    if (page.startsWith('event_')) {
      setCurrentEventId(params?.eventId || null);
    }
    setCurrentPage(page as any);
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

  // SAFE RENDER: Wrap pages in ErrorBoundary to isolate crashes
  const renderPage = () => {
    try {
      switch (currentPage) {
        case 'petit':
          return <PetitPage onNavigate={handleNavigate} />;
        case 'gacha':
          return <GachaPage onNavigate={handleNavigate} userState={userState} setUserState={setUserState} userId={userId!} />;
        case 'inbox':
          return <InboxPage onNavigate={handleNavigate} userId={userId!} />;
        case 'announcement':
          return <AnnouncementPage onNavigate={handleNavigate} />;
        case 'cardList':
          return <CardListPage onNavigate={handleNavigate} />;
        case 'admin':
          return <AdminPage onNavigate={handleNavigate} />;
        case 'soundbooth':
          return <SoundBoothPage onNavigate={handleNavigate} />;
        case 'work':
          return <WorkPage onNavigate={handleNavigate} formation={formation} userId={userId!} />;
        case 'live':
          return <LiveBattlePage onNavigate={handleNavigate} formation={formation} userId={userId!} />;
        case 'events':
          return <EventHubPage onNavigate={handleNavigate} userId={userId!} />;
        case 'event_tour':
          return <TourEventPage onNavigate={handleNavigate} formation={formation} userId={userId!} eventId={currentEventId!} />;
        case 'formation':
          return (
            <FormationPage 
              onNavigate={handleNavigate} 
              initialFormation={formation} 
              onSave={async (newFormation) => {
                try {
                  setFormation(newFormation);
                  handleNavigate('main');
                  // Save to backend
                  await fetch(`/api/formation/${userId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ formation: newFormation.map(c => c ? c.id : null) })
                  });
                } catch (e) {
                  console.error("Failed to save formation", e);
                  alert("Failed to save formation");
                }
              }} 
              inventory={userState.inventory}
            />
          );
        case 'main':
        default:
          return (
            <MainPage 
              onNavigate={handleNavigate} 
              formation={formation} 
              userState={userState} 
              userId={userId!} 
              onRefresh={() => userId && fetchUserData(userId)}
            />
          );
      }
    } catch (error) {
      console.error("Page render error:", error);
      return <div className="text-white text-center p-10">Failed to load page. <button onClick={() => handleNavigate('main')} className="underline">Return to Home</button></div>;
    }
  };

  return (
    <ErrorBoundary>
      {renderPage()}
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
