import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Power, Globe, Activity, Settings, Shield, Wifi, Crosshair, Minus, Maximize2, GripHorizontal, Zap } from 'lucide-react';

const SERVERS = [
  { id: 'sg', name: 'Singapore VIP', ping: 12, flag: '🇸🇬', ip: '192.168.1.104' },
  { id: 'hk', name: 'Hong Kong PRO', ping: 24, flag: '🇭🇰', ip: '10.0.45.21' },
  { id: 'jp', name: 'Tokyo Elite', ping: 45, flag: '🇯🇵', ip: '172.16.8.99' },
  { id: 'us', name: 'Los Angeles Ultra', ping: 120, flag: '🇺🇸', ip: '104.28.12.5' },
  { id: 'vn', name: 'Vietnam Local', ping: 5, flag: '🇻🇳', ip: '113.190.24.1' },
];

const TRANSLATIONS = {
  en: {
    title: "AuraVPN",
    subtitle: "Premium Network Manipulation",
    connect: "Connect",
    servers: "Servers",
    injector: "Injector",
    settings: "Settings",
    secured: "Secured",
    exposed: "Exposed",
    connecting: "Connecting...",
    connected: "Connected",
    disconnected: "Disconnected",
    unprotected: "Unprotected",
    currentNode: "Current Node",
    telemetry: "Live Ping",
    lagInjector: "Lag Injector",
    tactical: "Tactical network manipulation",
    startInjection: "Execute Teleport",
    targetPing: "Target Ping",
    jitter: "Jitter",
    packetLoss: "Packet Loss",
    duration: "Lag Duration",
    nodes: "Nodes",
    premium: "Premium",
    config: "Config",
    killSwitch: "Kill Switch",
    killSwitchDesc: "Block internet if VPN drops",
    autoConnect: "Auto Connect",
    autoConnectDesc: "Connect on launch",
    obfuscation: "Obfuscation",
    obfuscationDesc: "Bypass deep inspection",
    dnsLeak: "DNS Leak",
    dnsLeakDesc: "Force DNS through tunnel",
    language: "Language",
    languageDesc: "English / Tiếng Việt",
    overlay: "AuraVPN Overlay",
    requireVpn: "Please connect VPN first!",
    teleporting: "Teleporting...",
    ready: "Ready",
    buttonSettings: "Quick Button Settings",
    customDuration: "Custom Duration",
    buttonSize: "Button Size",
    lockPosition: "Lock Position",
    changeServer: "Change Server",
    close: "Close"
  },
  vn: {
    title: "AuraVPN",
    subtitle: "Thao Tác Mạng Cao Cấp",
    connect: "Kết Nối",
    servers: "Máy Chủ",
    injector: "Fake Lag",
    settings: "Cài Đặt",
    secured: "Bảo Mật",
    exposed: "Nguy Hiểm",
    connecting: "Đang kết nối...",
    connected: "Đã kết nối",
    disconnected: "Chưa kết nối",
    unprotected: "Không được bảo vệ",
    currentNode: "Máy Chủ Hiện Tại",
    telemetry: "Ping Trực Tiếp",
    lagInjector: "Fake Lag Teleport",
    tactical: "Thao tác mạng chiến thuật",
    startInjection: "Kích Hoạt Teleport",
    targetPing: "Ping Mục Tiêu",
    jitter: "Độ Nhiễu (Jitter)",
    packetLoss: "Mất Gói Tin",
    duration: "Thời Gian Lag",
    nodes: "Máy Chủ",
    premium: "Cao Cấp",
    config: "Cấu Hình",
    killSwitch: "Ngắt Kết Nối",
    killSwitchDesc: "Chặn mạng khi rớt VPN",
    autoConnect: "Tự Động Kết Nối",
    autoConnectDesc: "Kết nối khi mở app",
    obfuscation: "Ngụy Trang",
    obfuscationDesc: "Vượt qua kiểm tra gói tin",
    dnsLeak: "Chống Lộ DNS",
    dnsLeakDesc: "Ép DNS qua đường hầm",
    language: "Ngôn Ngữ",
    languageDesc: "English / Tiếng Việt",
    overlay: "Menu AuraVPN",
    requireVpn: "Vui lòng kết nối VPN trước!",
    teleporting: "Đang Teleport...",
    ready: "Sẵn Sàng",
    buttonSettings: "Cài Đặt Nút Nổi",
    customDuration: "Thời Gian Tùy Chỉnh",
    buttonSize: "Kích Thước Nút",
    lockPosition: "Khóa Vị Trí",
    changeServer: "Đổi Máy Chủ",
    close: "Đóng"
  }
};

export default function App() {
  const [lang, setLang] = useState<'en' | 'vn'>('vn');
  const t = TRANSLATIONS[lang];

  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedServer, setSelectedServer] = useState(SERVERS[0]);
  
  const [fakePing, setFakePing] = useState(400);
  const [jitter, setJitter] = useState(50);
  const [packetLoss, setPacketLoss] = useState(80);
  const [teleportDuration, setTeleportDuration] = useState(2000);
  
  const [isInjecting, setIsInjecting] = useState(false);
  const [isTeleporting, setIsTeleporting] = useState(false);
  const [teleportProgress, setTeleportProgress] = useState(0);

  const [isButtonSettingsOpen, setIsButtonSettingsOpen] = useState(false);
  const [buttonSize, setButtonSize] = useState(64);
  const [isButtonLocked, setIsButtonLocked] = useState(false);
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPressTriggered = useRef(false);

  // Fake chart data
  const [chartData, setChartData] = useState<number[]>(Array(15).fill(0));
  const constraintsRef = useRef(null);

  useEffect(() => {
    if (!isConnected && !isInjecting) {
      setChartData(Array(15).fill(0));
      return;
    }

    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev.slice(1)];
        let nextValue = 0;
        
        if (isInjecting) {
          nextValue = fakePing + (Math.random() * jitter * 2 - jitter);
          if (Math.random() * 100 < packetLoss) {
            nextValue = 0;
          }
        } else if (isConnected) {
          nextValue = selectedServer.ping + (Math.random() * 5);
        }
        
        newData.push(Math.max(0, nextValue));
        return newData;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isConnected, isInjecting, fakePing, jitter, packetLoss, selectedServer]);

  const handleConnect = () => {
    if (isConnected) {
      setIsConnected(false);
      setIsInjecting(false);
      setIsTeleporting(false);
    } else {
      setIsConnecting(true);
      setTimeout(() => {
        setIsConnecting(false);
        setIsConnected(true);
      }, 2000);
    }
  };

  const executeTeleport = () => {
    if (!isConnected) {
      alert(t.requireVpn);
      return;
    }
    if (isTeleporting) return;
    
    setIsTeleporting(true);
    setIsInjecting(true);
    setTeleportProgress(100);
    
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / teleportDuration) * 100);
      setTeleportProgress(remaining);
      
      if (elapsed >= teleportDuration) {
        clearInterval(interval);
        setIsTeleporting(false);
        setIsInjecting(false);
        setTeleportProgress(0);
      }
    }, 50);
  };

  const handleButtonPointerDown = () => {
    isLongPressTriggered.current = false;
    pressTimer.current = setTimeout(() => {
      isLongPressTriggered.current = true;
      setIsButtonSettingsOpen(true);
    }, 3000);
  };

  const handleButtonPointerUp = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handleButtonClick = () => {
    if (!isLongPressTriggered.current) {
      executeTeleport();
    }
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center overflow-hidden bg-cover bg-center"
      style={{ 
        backgroundImage: 'url(https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop)',
      }}
      ref={constraintsRef}
    >
      {/* Fake Game Overlay Darkener */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

      {/* Standalone Quick Teleport Button (Crosshair) */}
      <AnimatePresence>
        {(isConnected || isMinimized) && (
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0, rotate: 90 }}
            drag={!isButtonLocked}
            dragConstraints={constraintsRef}
            dragMomentum={false}
            onDragStart={handleButtonPointerUp}
            className={`absolute z-50 ${!isButtonLocked ? 'cursor-grab active:cursor-grabbing' : ''}`}
            style={{ top: '40%', right: '15%' }}
          >
            <button 
              onPointerDown={handleButtonPointerDown}
              onPointerUp={handleButtonPointerUp}
              onPointerLeave={handleButtonPointerUp}
              onClick={handleButtonClick}
              disabled={isTeleporting}
              style={{ width: buttonSize, height: buttonSize }}
              className={`relative rounded-full flex items-center justify-center glass-panel backdrop-blur-md border-2 transition-all overflow-hidden ${
                isTeleporting 
                  ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.6)] text-red-500' 
                  : isConnected
                    ? 'border-gold shadow-[0_0_20px_rgba(212,175,55,0.4)] text-gold hover:scale-105 hover:bg-gold/10'
                    : 'border-white/20 text-white/50 hover:scale-105 hover:bg-white/10'
              }`}
              title={isConnected ? t.startInjection : t.title}
            >
              <Crosshair size={buttonSize * 0.4} className={isTeleporting ? 'animate-pulse' : ''} />
              {isTeleporting && (
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-red-500/30 transition-all duration-75"
                  style={{ height: `${teleportProgress}%` }}
                />
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Overlay App (Android Ratio) */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            drag
            dragConstraints={constraintsRef}
            dragHandle=".drag-handle"
            dragMomentum={false}
            className="relative z-40 flex items-start gap-4"
          >
            {/* Detached Menu (Menu Nút Bấm Rời) */}
            <div className="flex flex-col gap-4 mt-16">
              <MenuButton icon={<Power size={20} />} label={t.connect} active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
              <MenuButton icon={<Globe size={20} />} label={t.servers} active={activeTab === 'servers'} onClick={() => setActiveTab('servers')} />
              <MenuButton icon={<Crosshair size={20} />} label={t.injector} active={activeTab === 'lag'} onClick={() => setActiveTab('lag')} />
              <MenuButton icon={<Settings size={20} />} label={t.settings} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
            </div>

            {/* Android Phone Ratio Frame */}
            <div className="w-[360px] h-[780px] glass-panel rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl border border-white/10 bg-black/40">
              
              {/* Draggable Header */}
              <div className="drag-handle h-12 bg-white/5 border-b border-white/10 flex items-center justify-between px-5 cursor-grab active:cursor-grabbing">
                <div className="flex items-center gap-2 text-white/50">
                  <GripHorizontal size={16} />
                  <span className="text-[10px] font-mono uppercase tracking-widest">{t.overlay}</span>
                </div>
                <button 
                  onClick={() => setIsMinimized(true)}
                  className="text-white/50 hover:text-white transition-colors p-1"
                >
                  <Minus size={18} />
                </button>
              </div>

              {/* App Content */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-6 relative">
                <header className="mb-8 flex justify-between items-center">
                  <div>
                    <h1 className="text-xl font-light tracking-widest uppercase text-white flex items-center gap-2">
                      <Shield className="text-gold" size={24} />
                      Aura<span className="font-bold text-gold">VPN</span>
                    </h1>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-gold shadow-gold' : 'bg-white/20'}`}></div>
                </header>

                <AnimatePresence mode="wait">
                  {activeTab === 'home' && (
                    <motion.div
                      key="home"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col gap-6"
                    >
                      {/* Connection Card */}
                      <div className="glass-panel rounded-[2rem] p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-[320px]">
                        {isConnecting && (
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-t-2 border-gold rounded-full opacity-20"
                            style={{ background: 'conic-gradient(from 0deg, transparent 0%, rgba(212, 175, 55, 0.15) 100%)' }}
                          />
                        )}

                        <div className="relative z-10 flex flex-col items-center">
                          <button 
                            onClick={handleConnect}
                            disabled={isConnecting}
                            className={`relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-700 ${
                              isConnected 
                                ? 'bg-gold/10 border-2 border-gold shadow-gold' 
                                : isConnecting
                                  ? 'bg-white/5 border-2 border-gold/50'
                                  : 'bg-white/5 border border-white/10 hover:border-gold/50 hover:bg-white/10'
                            }`}
                          >
                            <Power size={56} className={`transition-colors duration-700 ${isConnected ? 'text-gold' : 'text-white/40'}`} />
                            
                            {isConnected && (
                              <>
                                <motion.div 
                                  initial={{ scale: 1, opacity: 0.5 }}
                                  animate={{ scale: 1.5, opacity: 0 }}
                                  transition={{ duration: 2.5, repeat: Infinity }}
                                  className="absolute inset-0 rounded-full border border-gold"
                                />
                                <motion.div 
                                  initial={{ scale: 1, opacity: 0.5 }}
                                  animate={{ scale: 1.8, opacity: 0 }}
                                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
                                  className="absolute inset-0 rounded-full border border-gold"
                                />
                              </>
                            )}
                          </button>

                          <div className="mt-8 text-center">
                            <h2 className="text-lg font-light tracking-[0.15em] uppercase">
                              {isConnecting ? t.connecting : isConnected ? t.connected : t.disconnected}
                            </h2>
                            <p className="text-white/40 mt-2 font-mono text-[10px] tracking-wide">
                              {isConnected ? selectedServer.name : t.unprotected}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Current Node */}
                      <div className="glass-panel rounded-[1.5rem] p-5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-3xl drop-shadow-lg">{selectedServer.flag}</span>
                          <div>
                            <div className="text-sm font-medium tracking-wide">{selectedServer.name}</div>
                            <div className="text-gold font-mono text-[10px] mt-1 tracking-wider">{selectedServer.ip}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-white/40 uppercase tracking-widest mb-1">Ping</div>
                          <div className="font-mono text-sm text-gold">{selectedServer.ping}ms</div>
                        </div>
                      </div>

                      {/* Telemetry */}
                      <div className="glass-panel rounded-[1.5rem] p-5 flex flex-col h-32">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-[10px] uppercase tracking-[0.2em] text-white/50 flex items-center gap-2">
                            <Activity size={12} /> {t.telemetry}
                          </h3>
                          <div className="text-gold font-mono text-lg">
                            {isConnected || isInjecting ? Math.floor(chartData[chartData.length - 1]) : 0} <span className="text-[10px] text-white/40">ms</span>
                          </div>
                        </div>
                        
                        <div className="flex-1 flex items-end gap-1">
                          {chartData.map((val, i) => (
                            <div 
                              key={i} 
                              className="flex-1 bg-gold/20 rounded-t-sm chart-bar relative overflow-hidden"
                              style={{ height: `${Math.min(100, (val / 500) * 100)}%` }}
                            >
                              <div className="absolute bottom-0 left-0 right-0 bg-gold" style={{ height: '2px' }}></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'lag' && (
                    <motion.div
                      key="lag"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col gap-6"
                    >
                      <div className="text-center mb-4">
                        <h2 className="text-xl font-light tracking-[0.15em] uppercase flex items-center justify-center gap-3">
                          <Crosshair className="text-gold" size={24} /> {t.lagInjector}
                        </h2>
                        <p className="text-white/40 mt-2 text-xs tracking-wide">{t.tactical}</p>
                      </div>
                      
                      <button 
                        onClick={executeTeleport}
                        disabled={isTeleporting}
                        className={`w-full py-4 rounded-full uppercase tracking-[0.2em] text-[10px] font-bold transition-all duration-300 relative overflow-hidden ${
                          isTeleporting 
                            ? 'bg-red-500/10 text-red-500 border border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
                            : 'bg-gold/10 text-gold border border-gold/50 hover:bg-gold/20 hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                        }`}
                      >
                        <span className="relative z-10">{isTeleporting ? t.teleporting : t.startInjection}</span>
                        {isTeleporting && (
                          <div 
                            className="absolute top-0 bottom-0 left-0 bg-red-500/20 transition-all duration-75"
                            style={{ width: `${teleportProgress}%` }}
                          />
                        )}
                      </button>

                      <div className="glass-panel rounded-[1.5rem] p-6 space-y-8 mt-2">
                        {/* Duration Slider */}
                        <div>
                          <div className="flex justify-between mb-4">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-white/60">{t.duration}</label>
                            <span className="font-mono text-gold text-sm">{teleportDuration} ms</span>
                          </div>
                          <input 
                            type="range" min="500" max="5000" step="100"
                            value={teleportDuration} 
                            onChange={(e) => setTeleportDuration(Number(e.target.value))}
                            disabled={isTeleporting}
                          />
                        </div>

                        {/* Ping Slider */}
                        <div>
                          <div className="flex justify-between mb-4">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-white/60">{t.targetPing}</label>
                            <span className="font-mono text-gold text-sm">{fakePing} ms</span>
                          </div>
                          <input 
                            type="range" min="0" max="999" 
                            value={fakePing} 
                            onChange={(e) => setFakePing(Number(e.target.value))}
                            disabled={isTeleporting}
                          />
                        </div>

                        {/* Jitter Slider */}
                        <div>
                          <div className="flex justify-between mb-4">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-white/60">{t.jitter}</label>
                            <span className="font-mono text-gold text-sm">{jitter} ms</span>
                          </div>
                          <input 
                            type="range" min="0" max="200" 
                            value={jitter} 
                            onChange={(e) => setJitter(Number(e.target.value))}
                            disabled={isTeleporting}
                          />
                        </div>

                        {/* Packet Loss Slider */}
                        <div>
                          <div className="flex justify-between mb-4">
                            <label className="text-[10px] uppercase tracking-[0.2em] text-white/60">{t.packetLoss}</label>
                            <span className="font-mono text-gold text-sm">{packetLoss} %</span>
                          </div>
                          <input 
                            type="range" min="0" max="100" 
                            value={packetLoss} 
                            onChange={(e) => setPacketLoss(Number(e.target.value))}
                            disabled={isTeleporting}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'servers' && (
                    <motion.div
                      key="servers"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col gap-4"
                    >
                      <h2 className="text-lg font-light tracking-[0.15em] uppercase mb-2 flex items-center gap-3">
                        <Globe className="text-gold" size={20} /> {t.nodes}
                      </h2>
                      
                      <div className="flex flex-col gap-3">
                        {SERVERS.map(server => (
                          <button
                            key={server.id}
                            onClick={() => setSelectedServer(server)}
                            className={`flex items-center justify-between p-4 rounded-[1.2rem] border transition-all duration-300 ${
                              selectedServer.id === server.id
                                ? 'bg-gold/10 border-gold shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                                : 'bg-white/5 border-white/10 hover:border-gold/30 hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <span className="text-2xl drop-shadow-md">{server.flag}</span>
                              <div className="text-left">
                                <div className="font-medium text-sm tracking-wide">{server.name}</div>
                                <div className="text-[9px] text-white/40 uppercase tracking-[0.2em] mt-1">{t.premium}</div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <Wifi size={14} className={server.ping < 50 ? 'text-[#00ffaa]' : server.ping < 100 ? 'text-gold' : 'text-red-400'} />
                              <span className="font-mono text-[10px] text-white/60">{server.ping}ms</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'settings' && (
                    <motion.div
                      key="settings"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col gap-4"
                    >
                      <h2 className="text-lg font-light tracking-[0.15em] uppercase mb-2 flex items-center gap-3">
                        <Settings className="text-gold" size={20} /> {t.config}
                      </h2>
                      
                      <div className="flex flex-col gap-3">
                        {/* Language Toggle */}
                        <div className="flex items-center justify-between p-4 rounded-[1.2rem] bg-white/5 border border-white/10">
                          <div>
                            <div className="font-medium text-sm tracking-wide">{t.language}</div>
                            <div className="text-[10px] text-white/40 mt-1 tracking-wide">{t.languageDesc}</div>
                          </div>
                          <button 
                            onClick={() => setLang(lang === 'en' ? 'vn' : 'en')}
                            className="bg-white/10 hover:bg-white/20 text-gold px-3 py-1.5 rounded-lg text-xs font-bold tracking-widest transition-colors"
                          >
                            {lang === 'en' ? 'EN' : 'VN'}
                          </button>
                        </div>

                        {[
                          { title: t.killSwitch, desc: t.killSwitchDesc, active: true },
                          { title: t.autoConnect, desc: t.autoConnectDesc, active: false },
                          { title: t.obfuscation, desc: t.obfuscationDesc, active: true },
                          { title: t.dnsLeak, desc: t.dnsLeakDesc, active: true },
                        ].map((setting, i) => (
                          <div key={i} className="flex items-center justify-between p-4 rounded-[1.2rem] bg-white/5 border border-white/10">
                            <div>
                              <div className="font-medium text-sm tracking-wide">{setting.title}</div>
                              <div className="text-[10px] text-white/40 mt-1 tracking-wide">{setting.desc}</div>
                            </div>
                            <div className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${setting.active ? 'bg-gold' : 'bg-white/20'}`}>
                              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${setting.active ? 'translate-x-5' : 'translate-x-0'}`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuButton({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <div className="group relative flex items-center">
      <button 
        onClick={onClick}
        className={`w-12 h-12 rounded-full flex items-center justify-center glass-button ${active ? 'active' : ''}`}
      >
        {icon}
      </button>
      
      {/* Tooltip */}
      <div className="absolute left-full ml-4 px-3 py-2 rounded-lg glass-panel opacity-0 -translate-x-2 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap z-50">
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/90">{label}</span>
      </div>
    </div>
  );
}
