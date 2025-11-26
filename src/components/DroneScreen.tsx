import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plane, Building2, Radio, Wifi, MapPin } from 'lucide-react';
import { Participant } from '../App';

interface DroneScreenProps {
  participants: Participant[];
  onDrawComplete: (winner: string) => void;
}

interface BuildingData {
  id: number;
  x: number;
  height: number;
  width: number;
  participant?: Participant;
}

export function DroneScreen({ participants, onDrawComplete }: DroneScreenProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [dronePosition, setDronePosition] = useState({ x: 10, y: 30 });
  const [targetBuilding, setTargetBuilding] = useState<number | null>(null);
  const [buildings, setBuildings] = useState<BuildingData[]>([]);
  const [winner, setWinner] = useState<Participant | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [droneAngle, setDroneAngle] = useState(0);

  useEffect(() => {
    // Generate city buildings with participants
    const cityBuildings: BuildingData[] = participants.map((participant, index) => ({
      id: index,
      x: (index / participants.length) * 90 + 5,
      height: Math.random() * 40 + 30,
      width: 8,
      participant,
    }));
    setBuildings(cityBuildings);
  }, [participants]);

  useEffect(() => {
    if (isScanning && !winner) {
      // Drone patrol animation
      const droneInterval = setInterval(() => {
        setDroneAngle((prev) => (prev + 5) % 360);
      }, 50);

      // Progress tracking
      const progressInterval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) return 100;
          return prev + 0.7;
        });
      }, 50);

      return () => {
        clearInterval(droneInterval);
        clearInterval(progressInterval);
      };
    }
  }, [isScanning, winner]);

  const startDroneScan = () => {
    if (buildings.length === 0 || isScanning) return;
    
    setIsScanning(true);
    setScanProgress(0);
    setTargetBuilding(null);
    setWinner(null);

    // Drone scanning flight path
    let scanCount = 0;
    const flightPath = setInterval(() => {
      const randomBuilding = Math.floor(Math.random() * buildings.length);
      const building = buildings[randomBuilding];
      
      setDronePosition({
        x: building.x + building.width / 2,
        y: 100 - building.height - 10,
      });
      setTargetBuilding(randomBuilding);
      scanCount++;

      if (scanCount > 20) {
        clearInterval(flightPath);
      }
    }, 300);

    // Final target lock
    setTimeout(() => {
      clearInterval(flightPath);
      const winnerIndex = Math.floor(Math.random() * buildings.length);
      const winningBuilding = buildings[winnerIndex];
      
      setDronePosition({
        x: winningBuilding.x + winningBuilding.width / 2,
        y: 100 - winningBuilding.height - 10,
      });
      setTargetBuilding(winnerIndex);
      
      setTimeout(() => {
        setWinner(winningBuilding.participant!);
        
        setTimeout(() => {
          setIsScanning(false);
          onDrawComplete(winningBuilding.participant!.name);
        }, 2500);
      }, 1000);
    }, 7000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-900/80 backdrop-blur-xl rounded-full border border-cyan-500/50 mb-3">
          <Plane className="w-5 h-5 text-cyan-400" />
          <h2 className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-mono">
            SMART CITY SURVEILLANCE
          </h2>
          <motion.div
            animate={isScanning ? { rotate: 360 } : {}}
            transition={{ duration: 2, repeat: isScanning ? Infinity : 0, ease: 'linear' }}
          >
            <Radio className="w-5 h-5 text-cyan-400" />
          </motion.div>
        </div>
        <p className="text-cyan-300/60 font-mono">AERIAL DRONE SCANNING PROTOCOL</p>
      </motion.div>

      {/* City stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'BUILDINGS', value: buildings.length.toString(), icon: <Building2 className="w-4 h-4" /> },
          { label: 'DRONES', value: '1', icon: <Plane className="w-4 h-4" /> },
          { label: 'NETWORK', value: isScanning ? 'SCANNING' : 'ONLINE', icon: <Wifi className="w-4 h-4" /> },
          { label: 'STATUS', value: winner ? 'TARGET FOUND' : isScanning ? 'ACTIVE' : 'STANDBY', icon: <MapPin className="w-4 h-4" /> },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-900/80 backdrop-blur-xl rounded-lg border border-cyan-500/30 p-3"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="text-cyan-400">{item.icon}</div>
              <p className="text-cyan-400/60 font-mono text-sm">{item.label}</p>
            </div>
            <p className="text-cyan-400 font-mono text-lg">{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* City skyline view */}
      <div className="relative aspect-[16/9] bg-gradient-to-b from-slate-950 via-blue-950/50 to-cyan-950/30 backdrop-blur-xl rounded-2xl border-2 border-cyan-500/50 overflow-hidden mb-6 shadow-[0_0_50px_rgba(6,182,212,0.3)]">
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full">
            <defs>
              <pattern id="city-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#city-grid)" />
          </svg>
        </div>

        {/* Horizon line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

        {/* City buildings */}
        <div className="absolute bottom-0 left-0 right-0 h-full">
          {buildings.map((building, index) => {
            const isTarget = targetBuilding === index;
            const isWinner = winner?.id === building.participant?.id;

            return (
              <motion.div
                key={building.id}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="absolute bottom-0"
                style={{
                  left: `${building.x}%`,
                  width: `${building.width}%`,
                  height: `${building.height}%`,
                  transformOrigin: 'bottom',
                }}
              >
                {/* Building structure */}
                <div
                  className={`relative h-full bg-gradient-to-t transition-all duration-500 ${
                    isWinner
                      ? 'from-green-900/60 to-green-700/40 border-2 border-green-400'
                      : isTarget
                      ? 'from-cyan-900/60 to-cyan-700/40 border-2 border-cyan-400'
                      : 'from-slate-900/60 to-slate-700/40 border border-cyan-500/20'
                  } backdrop-blur-sm`}
                >
                  {/* Windows */}
                  <div className="absolute inset-2 grid grid-cols-2 gap-1">
                    {[...Array(Math.floor(building.height / 10))].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={isTarget || isWinner ? {
                          opacity: [0.3, 1, 0.3],
                        } : {}}
                        transition={{
                          duration: 1,
                          repeat: (isTarget || isWinner) ? Infinity : 0,
                          delay: i * 0.1,
                        }}
                        className={`w-full h-1 ${
                          isWinner ? 'bg-green-400' : isTarget ? 'bg-cyan-400' : 'bg-cyan-400/30'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Holographic name display */}
                  <AnimatePresence>
                    {building.participant && (isTarget || isWinner) && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap"
                      >
                        <div
                          className={`px-3 py-1 rounded border backdrop-blur-xl ${
                            isWinner
                              ? 'bg-green-500/30 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.6)]'
                              : 'bg-cyan-500/30 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)]'
                          }`}
                        >
                          <p
                            className={`font-mono ${
                              isWinner ? 'text-green-300' : 'text-cyan-300'
                            }`}
                          >
                            {building.participant.name}
                          </p>
                        </div>
                        
                        {/* Hologram projection lines */}
                        <svg className="absolute top-full left-1/2 -translate-x-1/2 w-1 opacity-50" height="60">
                          <line x1="1" y1="0" x2="1" y2="60" stroke={isWinner ? '#4ade80' : '#22d3ee'} strokeWidth="1" strokeDasharray="2,2" />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Scanning beam */}
                  {isTarget && isScanning && !winner && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.8, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-t from-cyan-400/40 to-transparent"
                    />
                  )}

                  {/* Winner glow */}
                  {isWinner && (
                    <motion.div
                      animate={{
                        boxShadow: [
                          '0 0 20px rgba(34,197,94,0.5)',
                          '0 0 40px rgba(34,197,94,0.8)',
                          '0 0 20px rgba(34,197,94,0.5)',
                        ],
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute inset-0"
                    />
                  )}
                </div>

                {/* Building antenna */}
                <motion.div
                  animate={isTarget || isWinner ? { opacity: [0.5, 1, 0.5] } : {}}
                  transition={{ duration: 0.5, repeat: (isTarget || isWinner) ? Infinity : 0 }}
                  className={`absolute -top-4 left-1/2 -translate-x-1/2 w-px h-4 ${
                    isWinner ? 'bg-green-400' : 'bg-cyan-400'
                  }`}
                >
                  <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${
                    isWinner ? 'bg-green-400' : 'bg-cyan-400'
                  }`} />
                </motion.div>

                {/* Signal waves */}
                {(isTarget || isWinner) && (
                  <>
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 0.8 }}
                        animate={{ scale: 3, opacity: 0 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.6,
                        }}
                        className={`absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-4 border-2 rounded-full ${
                          isWinner ? 'border-green-400' : 'border-cyan-400'
                        }`}
                      />
                    ))}
                  </>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Surveillance drone */}
        <motion.div
          animate={{
            left: `${dronePosition.x}%`,
            top: `${dronePosition.y}%`,
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
        >
          {/* Drone body */}
          <div className="relative">
            <motion.div
              animate={{ rotate: droneAngle }}
              className="relative w-16 h-16"
            >
              {/* Propellers */}
              {[0, 90, 180, 270].map((angle, i) => (
                <motion.div
                  key={i}
                  className="absolute w-6 h-6"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-20px)`,
                  }}
                >
                  <motion.div
                    animate={{ rotate: isScanning ? 360 : 0 }}
                    transition={{ duration: 0.1, repeat: isScanning ? Infinity : 0, ease: 'linear' }}
                    className="w-full h-full border-2 border-cyan-400 rounded-full opacity-60"
                  />
                </motion.div>
              ))}
              
              {/* Center body */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-slate-800 border-2 border-cyan-400 rounded-lg flex items-center justify-center">
                <Plane className="w-4 h-4 text-cyan-400" />
              </div>
            </motion.div>

            {/* Scanning beam */}
            {isScanning && (
              <motion.div
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute top-full left-1/2 -translate-x-1/2 w-20 h-96"
                style={{
                  background: 'linear-gradient(to bottom, rgba(6,182,212,0.4), rgba(6,182,212,0.1), transparent)',
                  clipPath: 'polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)',
                }}
              />
            )}

            {/* Drone lights */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-red-400 rounded-full blur-sm"
            />
          </div>
        </motion.div>

        {/* Network connections */}
        {isScanning && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {buildings.slice(0, 5).map((building, i) => (
              <motion.line
                key={i}
                x1={`${dronePosition.x}%`}
                y1={`${dronePosition.y}%`}
                x2={`${building.x + building.width / 2}%`}
                y2={`${100 - building.height}%`}
                stroke="currentColor"
                strokeWidth="1"
                className="text-cyan-400/30"
                strokeDasharray="4,4"
                animate={{ strokeDashoffset: [0, 8] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            ))}
          </svg>
        )}

        {/* Corner UI elements */}
        <div className="absolute top-4 left-4 space-y-2">
          <div className="px-3 py-1 bg-slate-900/80 backdrop-blur-xl rounded border border-cyan-500/30">
            <p className="text-cyan-400 font-mono text-sm">DRONE: X:{dronePosition.x.toFixed(1)} Y:{dronePosition.y.toFixed(1)}</p>
          </div>
          <div className="px-3 py-1 bg-slate-900/80 backdrop-blur-xl rounded border border-cyan-500/30">
            <p className="text-cyan-400 font-mono text-sm">ALT: {(100 - dronePosition.y).toFixed(0)}M</p>
          </div>
        </div>

        <div className="absolute top-4 right-4">
          <motion.div
            animate={isScanning ? { opacity: [0.5, 1, 0.5] } : {}}
            transition={{ duration: 1, repeat: isScanning ? Infinity : 0 }}
            className="px-3 py-1 bg-slate-900/80 backdrop-blur-xl rounded border border-red-500/50"
          >
            <p className="text-red-400 font-mono text-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full" />
              {isScanning ? 'SCANNING' : 'STANDBY'}
            </p>
          </motion.div>
        </div>

        {/* Winner announcement overlay */}
        <AnimatePresence>
          {winner && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center"
            >
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.6 }}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-green-500/20 backdrop-blur-xl rounded-full border-2 border-green-400"
                >
                  <MapPin className="w-8 h-8 text-green-400" />
                  <p className="text-2xl text-green-400 font-mono">TARGET LOCATED</p>
                </motion.div>

                <motion.p
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-mono"
                >
                  {winner.name}
                </motion.p>

                <div className="space-y-2">
                  <p className="text-cyan-400/60 font-mono">BUILDING ID: #{winner.id}</p>
                  <p className="text-green-400 font-mono">SURVEILLANCE: CONFIRMED</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scan progress */}
      {isScanning && !winner && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-lg border border-cyan-500/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-cyan-400 font-mono">DRONE SCANNING PROGRESS</span>
              <span className="text-cyan-400 font-mono">{Math.floor(scanProgress)}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${scanProgress}%` }}
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 relative"
              >
                <motion.div
                  animate={{ x: [-20, 100] }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Control button */}
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startDroneScan}
          disabled={isScanning || buildings.length === 0}
          className="relative px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-mono text-white disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
        >
          {isScanning && (
            <motion.div
              animate={{ x: [-200, 200] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <Plane className="w-5 h-5" />
            {isScanning ? 'DRONE SCANNING...' : 'DEPLOY SURVEILLANCE DRONE'}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
