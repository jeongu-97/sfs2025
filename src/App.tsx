import { useState } from 'react';
import { WaitingScreen } from './components/WaitingScreen';
import { SlotMachineScreen } from './components/SlotMachineScreen';
import { LeverScreen } from './components/LeverScreen';
import { RouletteScreen } from './components/RouletteScreen';
import { DatabaseScreen } from './components/DatabaseScreen';
import { HackerScreen } from './components/HackerScreen';
import { SatelliteScreen } from './components/SatelliteScreen';
import { DNAScreen } from './components/DNAScreen';
import { FaceScanScreen } from './components/FaceScanScreen';
import { DroneScreen } from './components/DroneScreen';
import { WinnerScreen } from './components/WinnerScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';

export type ScreenType = 'waiting' | 'slot' | 'lever' | 'roulette' | 'database' | 'hacker' | 'satellite' | 'dna' | 'facescan' | 'drone' | 'winner' | 'admin';

export interface Participant {
  id: string;
  name: string;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('waiting');
  const [winner, setWinner] = useState<string>('');
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: 'Alice Chen' },
    { id: '2', name: 'Bob Martinez' },
    { id: '3', name: 'Carol Johnson' },
    { id: '4', name: 'David Kim' },
    { id: '5', name: 'Eva Rodriguez' },
    { id: '6', name: 'Frank Anderson' },
    { id: '7', name: 'Grace Liu' },
    { id: '8', name: 'Henry Wilson' },
    { id: '9', name: 'Iris Patel' },
    { id: '10', name: 'Jack Thompson' },
  ]);

  const handleDrawComplete = (winnerName: string) => {
    setWinner(winnerName);
    setTimeout(() => {
      setCurrentScreen('winner');
    }, 500);
  };

  const handleAddParticipant = (name: string) => {
    const newParticipant: Participant = {
      id: Date.now().toString(),
      name,
    };
    setParticipants([...participants, newParticipant]);
  };

  const handleRemoveParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'waiting':
        return <WaitingScreen />;
      case 'slot':
        return <SlotMachineScreen participants={participants} onDrawComplete={handleDrawComplete} />;
      case 'lever':
        return <LeverScreen participants={participants} onDrawComplete={handleDrawComplete} />;
      case 'roulette':
        return <RouletteScreen participants={participants} onDrawComplete={handleDrawComplete} />;
      case 'database':
        return <DatabaseScreen participants={participants} onDrawComplete={handleDrawComplete} />;
      case 'hacker':
        return <HackerScreen participants={participants} onDrawComplete={handleDrawComplete} />;
      case 'satellite':
        return <SatelliteScreen participants={participants} onDrawComplete={handleDrawComplete} />;
      case 'dna':
        return <DNAScreen participants={participants} onDrawComplete={handleDrawComplete} />;
      case 'facescan':
        return <FaceScanScreen participants={participants} onDrawComplete={handleDrawComplete} />;
      case 'drone':
        return <DroneScreen participants={participants} onDrawComplete={handleDrawComplete} />;
      case 'winner':
        return <WinnerScreen winnerName={winner} onReset={() => setCurrentScreen('waiting')} />;
      case 'admin':
        return (
          <AdminDashboard
            participants={participants}
            onAddParticipant={handleAddParticipant}
            onRemoveParticipant={handleRemoveParticipant}
            onScreenChange={setCurrentScreen}
          />
        );
      default:
        return <WaitingScreen />;
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center p-8">
          {renderScreen()}
        </div>
        <Footer />
      </div>

      {/* Admin toggle button */}
      <button
        onClick={() => setCurrentScreen(currentScreen === 'admin' ? 'waiting' : 'admin')}
        className="fixed bottom-24 right-8 z-50 px-4 py-2 bg-cyan-500/10 backdrop-blur-xl border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-cyan-500/20 transition-all duration-300"
      >
        {currentScreen === 'admin' ? 'Exit Admin' : 'Admin Panel'}
      </button>
    </div>
  );
}

export default App;