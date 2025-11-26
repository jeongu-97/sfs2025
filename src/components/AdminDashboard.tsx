import { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Plus, Trash2, Play } from 'lucide-react';
import { Participant, ScreenType } from '../App';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface AdminDashboardProps {
  participants: Participant[];
  onAddParticipant: (name: string) => void;
  onRemoveParticipant: (id: string) => void;
  onScreenChange: (screen: ScreenType) => void;
}

export function AdminDashboard({
  participants,
  onAddParticipant,
  onRemoveParticipant,
  onScreenChange,
}: AdminDashboardProps) {
  const [newName, setNewName] = useState('');

  const handleAdd = () => {
    if (newName.trim()) {
      onAddParticipant(newName.trim());
      setNewName('');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-8">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-mono mb-2">
          ADMIN CONTROL PANEL
        </h1>
        <p className="text-cyan-300/60 font-mono">Event Management Dashboard</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Participants panel */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-cyan-400" />
              <h2 className="text-2xl text-cyan-400 font-mono">Participants</h2>
              <span className="ml-auto text-cyan-300/60 font-mono">
                Total: {participants.length}
              </span>
            </div>

            {/* Add participant */}
            <div className="flex gap-3 mb-6">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="Enter participant name..."
                className="flex-1 bg-slate-800/50 border-cyan-500/30 text-cyan-100 font-mono placeholder:text-cyan-300/30"
              />
              <Button
                onClick={handleAdd}
                className="bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            {/* Participants list */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {participants.length === 0 ? (
                <p className="text-center text-cyan-300/40 font-mono py-8">
                  No participants yet
                </p>
              ) : (
                participants.map((participant, index) => (
                  <motion.div
                    key={participant.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 transition-colors group"
                  >
                    <span className="text-cyan-400/60 font-mono w-8">
                      #{index + 1}
                    </span>
                    <span className="flex-1 text-cyan-100 font-mono">
                      {participant.name}
                    </span>
                    <button
                      onClick={() => onRemoveParticipant(participant.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/20 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Control panel */}
        <div className="space-y-6">
          {/* Stats panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6"
          >
            <h3 className="text-xl text-cyan-400 font-mono mb-4">Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-cyan-300/60 font-mono">Participants</span>
                <span className="text-2xl text-cyan-400 font-mono">
                  {participants.length}
                </span>
              </div>
              <div className="h-px bg-cyan-500/20" />
              <div className="flex justify-between items-center">
                <span className="text-cyan-300/60 font-mono">Status</span>
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-green-400 font-mono"
                >
                  ● READY
                </motion.span>
              </div>
            </div>
          </motion.div>

          {/* Draw mode selection */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6"
          >
            <h3 className="text-xl text-cyan-400 font-mono mb-4">Draw Mode</h3>
            <div className="space-y-3">
              <Button
                onClick={() => onScreenChange('slot')}
                className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 justify-start"
              >
                <Play className="w-4 h-4 mr-2" />
                Slot Machine
              </Button>
              <Button
                onClick={() => onScreenChange('lever')}
                className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 justify-start"
              >
                <Play className="w-4 h-4 mr-2" />
                Lever Draw
              </Button>
              <Button
                onClick={() => onScreenChange('roulette')}
                className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 justify-start"
              >
                <Play className="w-4 h-4 mr-2" />
                Roulette Wheel
              </Button>
              <Button
                onClick={() => onScreenChange('database')}
                className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 justify-start"
              >
                <Play className="w-4 h-4 mr-2" />
                Citizen Database
              </Button>
              <Button
                onClick={() => onScreenChange('hacker')}
                className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 justify-start"
              >
                <Play className="w-4 h-4 mr-2" />
                Hacker Terminal
              </Button>
              <Button
                onClick={() => onScreenChange('satellite')}
                className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 justify-start"
              >
                <Play className="w-4 h-4 mr-2" />
                Satellite Tracking
              </Button>
              <Button
                onClick={() => onScreenChange('dna')}
                className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 justify-start"
              >
                <Play className="w-4 h-4 mr-2" />
                DNA Sequence
              </Button>
              <Button
                onClick={() => onScreenChange('facescan')}
                className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 justify-start"
              >
                <Play className="w-4 h-4 mr-2" />
                AI Face Scan
              </Button>
              <Button
                onClick={() => onScreenChange('drone')}
                className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 justify-start"
              >
                <Play className="w-4 h-4 mr-2" />
                Smart City Drone
              </Button>
              <div className="h-px bg-cyan-500/20 my-2" />
              <Button
                onClick={() => onScreenChange('waiting')}
                className="w-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 justify-start"
              >
                <Play className="w-4 h-4 mr-2" />
                Waiting Screen
              </Button>
            </div>
          </motion.div>

          {/* Data visualization */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6"
          >
            <h3 className="text-xl text-cyan-400 font-mono mb-4">System</h3>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <motion.div
                    animate={{
                      scaleX: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="h-1 bg-cyan-400/50 rounded-full"
                    style={{ width: '100%' }}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}