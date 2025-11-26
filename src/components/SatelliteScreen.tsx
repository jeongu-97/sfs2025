import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Satellite, Radio, Target, Globe } from 'lucide-react';
import { Participant } from '../App';

interface SatelliteScreenProps {
  participants: Participant[];
  onDrawComplete: (winner: string) => void;
}

interface ParticipantLocation {
  participant: Participant;
  x: number;
  y: number;
  lat: number;
  lng: number;
}

export function SatelliteScreen({ participants, onDrawComplete }: SatelliteScreenProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [lockedTarget, setLockedTarget] = useState<ParticipantLocation | null>(null);
  const [participantLocations, setParticipantLocations] = useState<ParticipantLocation[]>([]);
  const [scanAngle, setScanAngle] = useState(0);
  const [satelliteAngle, setSatelliteAngle] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    // Generate random locations for participants on the map
    const locations = participants.map((participant) => {
      const lat = (Math.random() - 0.5) * 140; // -70 to 70
      const lng = (Math.random() - 0.5) * 280; // -140 to 140
      return {
        participant,
        x: (lng + 140) / 280 * 100, // Convert to percentage
        y: (lat + 70) / 140 * 100,
        lat,
        lng,
      };
    });
    setParticipantLocations(locations);
  }, [participants]);

  useEffect(() => {
    // Satellite orbital animation
    const interval = setInterval(() => {
      setSatelliteAngle((prev) => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Radar scan animation
    if (isScanning) {
      const interval = setInterval(() => {
        setScanAngle((prev) => (prev + 2) % 360);
      }, 30);
      return () => clearInterval(interval);
    }
  }, [isScanning]);

  const startTracking = () => {
    if (participantLocations.length === 0 || isScanning) return;
    
    setIsScanning(true);
    setLockedTarget(null);
    setZoomLevel(1);

    // Scanning phase - highlight random targets
    let scanCount = 0;
    const scanInterval = setInterval(() => {
      const randomLocation = participantLocations[Math.floor(Math.random() * participantLocations.length)];
      setLockedTarget(randomLocation);
      scanCount++;

      if (scanCount > 20) {
        clearInterval(scanInterval);
      }
    }, 200);

    // Lock onto final target after scanning
    setTimeout(() => {
      clearInterval(scanInterval);
      const winner = participantLocations[Math.floor(Math.random() * participantLocations.length)];
      setLockedTarget(winner);
      
      // Zoom in on target
      setTimeout(() => {
        setZoomLevel(2);
      }, 500);

      // Complete after lock animation
      setTimeout(() => {
        setIsScanning(false);
        onDrawComplete(winner.participant.name);
      }, 3000);
    }, 5000);
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
          <Satellite className="w-5 h-5 text-cyan-400" />
          <h2 className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-mono">
            ORBITAL TRACKING SYSTEM
          </h2>
          <motion.div
            animate={{ rotate: satelliteAngle }}
            transition={{ duration: 0.05, ease: 'linear' }}
          >
            <Radio className="w-5 h-5 text-cyan-400" />
          </motion.div>
        </div>
        <p className="text-cyan-300/60 font-mono">SATELLITE LOCK-ON PROTOCOL</p>
      </motion.div>

      {/* Status bar */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'SATELLITES', value: '3', status: 'ACTIVE' },
          { label: 'TARGETS', value: participantLocations.length.toString(), status: 'DETECTED' },
          { label: 'SIGNAL', value: '98%', status: 'STRONG' },
          { label: 'STATUS', value: isScanning ? 'SCANNING' : 'READY', status: isScanning ? 'ACTIVE' : 'STANDBY' },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-900/80 backdrop-blur-xl rounded-lg border border-cyan-500/30 p-3"
          >
            <p className="text-cyan-400/60 font-mono mb-1">{item.label}</p>
            <p className="text-cyan-400 font-mono text-xl">{item.value}</p>
            <div className="flex items-center gap-2 mt-1">
              <motion.div
                animate={isScanning && item.status === 'ACTIVE' ? { opacity: [0.5, 1, 0.5] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
                className={`w-2 h-2 rounded-full ${
                  item.status === 'ACTIVE' ? 'bg-green-400' : 'bg-cyan-400'
                }`}
              />
              <span className="text-cyan-400/60 font-mono text-xs">{item.status}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main tracking display */}
      <div className="relative aspect-[16/10] bg-slate-950/90 backdrop-blur-xl rounded-2xl border-2 border-cyan-500/50 overflow-hidden mb-6 shadow-[0_0_50px_rgba(6,182,212,0.3)]">
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-400" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Earth/Map background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: zoomLevel }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative w-full h-full"
          >
            {/* Continents silhouette */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 to-cyan-950/40 rounded-full blur-sm" />
            
            {/* Latitude/Longitude lines */}
            <svg className="absolute inset-0 w-full h-full opacity-30">
              {/* Latitude lines */}
              {[...Array(7)].map((_, i) => (
                <line
                  key={`lat-${i}`}
                  x1="0"
                  y1={`${(i + 1) * 12.5}%`}
                  x2="100%"
                  y2={`${(i + 1) * 12.5}%`}
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-cyan-400/50"
                />
              ))}
              {/* Longitude lines */}
              {[...Array(9)].map((_, i) => (
                <line
                  key={`lng-${i}`}
                  x1={`${(i + 1) * 10}%`}
                  y1="0"
                  x2={`${(i + 1) * 10}%`}
                  y2="100%"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-cyan-400/50"
                />
              ))}
            </svg>

            {/* Radar scan effect */}
            {isScanning && (
              <motion.div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '2px',
                  height: '50%',
                  background: 'linear-gradient(to bottom, rgba(6,182,212,0.8), transparent)',
                  transformOrigin: 'top center',
                  transform: `rotate(${scanAngle}deg)`,
                }}
              />
            )}

            {/* Radar rings */}
            {isScanning && (
              <>
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0.8 }}
                    animate={{ scale: 4, opacity: 0 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.75,
                      ease: 'linear',
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-cyan-400 rounded-full"
                  />
                ))}
              </>
            )}

            {/* Participant markers */}
            {participantLocations.map((location, index) => {
              const isTargeted = lockedTarget?.participant.id === location.participant.id;
              
              return (
                <motion.div
                  key={location.participant.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: isTargeted ? (isScanning ? [1, 1.5, 1] : 1.5) : 1,
                    opacity: 1,
                  }}
                  transition={{ 
                    delay: index * 0.05,
                    scale: { duration: 0.5, repeat: isTargeted && isScanning ? Infinity : 0 },
                  }}
                  className="absolute"
                  style={{
                    left: `${location.x}%`,
                    top: `${location.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {/* Target reticle */}
                  {isTargeted && (
                    <motion.div
                      initial={{ scale: 2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute inset-0"
                    >
                      <div className="relative w-16 h-16 -translate-x-1/2 -translate-y-1/2">
                        {/* Corner brackets */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-400" />
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-400" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-400" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-400" />
                        
                        {/* Center crosshair */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                          <div className="w-8 h-px bg-red-400" />
                          <div className="w-px h-8 bg-red-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                        
                        {/* Rotating ring */}
                        {!isScanning && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-0 border-2 border-red-400/50 rounded-full"
                            style={{ borderTopColor: 'transparent' }}
                          />
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Marker dot */}
                  <motion.div
                    animate={isTargeted ? {
                      boxShadow: [
                        '0 0 10px rgba(239,68,68,0.5)',
                        '0 0 25px rgba(239,68,68,0.8)',
                        '0 0 10px rgba(239,68,68,0.5)',
                      ],
                    } : {
                      boxShadow: '0 0 8px rgba(6,182,212,0.6)',
                    }}
                    transition={{ duration: 0.5, repeat: isTargeted ? Infinity : 0 }}
                    className={`w-3 h-3 rounded-full ${
                      isTargeted ? 'bg-red-400' : 'bg-cyan-400'
                    }`}
                  />

                  {/* Pulsing ring */}
                  <motion.div
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`absolute inset-0 rounded-full border-2 ${
                      isTargeted ? 'border-red-400' : 'border-cyan-400'
                    }`}
                  />

                  {/* Name label on zoom */}
                  {isTargeted && !isScanning && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap"
                    >
                      <div className="px-3 py-1 bg-slate-900/90 backdrop-blur-xl rounded border border-red-400/50">
                        <p className="text-red-400 font-mono">{location.participant.name}</p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Satellite orbital paths */}
        {[0, 120, 240].map((offset, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              animate={{ rotate: satelliteAngle + offset }}
              transition={{ duration: 0.05, ease: 'linear' }}
              className="relative w-full h-full"
            >
              <div
                className="absolute w-3 h-3 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.8)]"
                style={{
                  top: '10%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <Satellite className="w-3 h-3 text-yellow-400" />
              </div>
            </motion.div>
          </motion.div>
        ))}

        {/* Corner UI elements */}
        <div className="absolute top-4 left-4 space-y-2">
          <div className="px-3 py-1 bg-slate-900/80 backdrop-blur-xl rounded border border-cyan-500/30">
            <p className="text-cyan-400 font-mono text-sm">LAT: {lockedTarget?.lat.toFixed(2) || '0.00'}°</p>
          </div>
          <div className="px-3 py-1 bg-slate-900/80 backdrop-blur-xl rounded border border-cyan-500/30">
            <p className="text-cyan-400 font-mono text-sm">LNG: {lockedTarget?.lng.toFixed(2) || '0.00'}°</p>
          </div>
        </div>

        <div className="absolute top-4 right-4">
          <div className="px-3 py-1 bg-slate-900/80 backdrop-blur-xl rounded border border-cyan-500/30">
            <p className="text-cyan-400 font-mono text-sm">ZOOM: {zoomLevel.toFixed(1)}x</p>
          </div>
        </div>

        {/* Target info panel */}
        <AnimatePresence>
          {lockedTarget && !isScanning && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 w-96"
            >
              <div className="bg-slate-900/90 backdrop-blur-xl rounded-lg border-2 border-red-400/50 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="w-6 h-6 text-red-400" />
                  <p className="text-red-400 font-mono">TARGET LOCKED</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-cyan-400/60 font-mono">ID:</span>
                    <span className="text-cyan-400 font-mono">{lockedTarget.participant.id.padStart(6, '0')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cyan-400/60 font-mono">NAME:</span>
                    <span className="text-red-400 font-mono text-xl">{lockedTarget.participant.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cyan-400/60 font-mono">STATUS:</span>
                    <span className="text-green-400 font-mono">CONFIRMED</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scanning overlay */}
        {isScanning && (
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Control button */}
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startTracking}
          disabled={isScanning || participantLocations.length === 0}
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
            <Globe className="w-5 h-5" />
            {isScanning ? 'TRACKING IN PROGRESS...' : 'INITIATE SATELLITE SCAN'}
          </span>
        </motion.button>
      </div>
    </div>
  );
}
