import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Wrench,
  Gauge,
  Cog,
  Car,
  Settings,
  Play,
  Pause,
  Truck,
  Shield,
  CircleDot,
  ShoppingCart,
  Battery,
  Filter
} from "lucide-react";

const AutoNexusLanding = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Updated car parts database with real automotive products
  const carParts = [
    {
      id: 1,
      name: "Premium Brake System Kit",
      icon: Gauge,
      description:
        "Complete braking solution featuring ceramic brake pads, ventilated rotors, and high-performance brake fluid for superior stopping power",
      specs: "Ceramic Pads • Ventilated Rotors • DOT 4 Fluid • Hardware Kit",
      price: "18,500 LKR",
      category: "BRAKING SYSTEM",
      efficiency: "99%",
      brands: "Brembo • EBC • Akebono • Wagner"
    },
    {
      id: 2,
      name: "Engine Performance Package",
      icon: Settings,
      description:
        "Comprehensive engine upgrade including air filter, spark plugs, oil filter, and performance additives for enhanced power and efficiency",
      specs:
        "K&N Air Filter • NGK Spark Plugs • Mann Oil Filter • Fuel Additive",
      price: "12,800 LKR",
      category: "ENGINE COMPONENTS",
      efficiency: "96%",
      brands: "K&N • NGK • Mann-Filter • Liqui Moly"
    },
    {
      id: 3,
      name: "LED Headlight Conversion Kit",
      icon: Zap,
      description:
        "Advanced LED headlight system with adaptive lighting, DRL integration, and weather-resistant housing for enhanced visibility",
      specs: "6000K LED • Adaptive Beam • Daytime Running • IP67 Rating",
      price: "24,900 LKR",
      category: "LIGHTING SYSTEMS",
      efficiency: "95%",
      brands: "Philips • Osram • Hella • Morimoto"
    },
    {
      id: 4,
      name: "Suspension Upgrade Kit",
      icon: Wrench,
      description:
        "Complete suspension overhaul with adjustable coilovers, performance shocks, and stabilizer bars for improved handling",
      specs: "Adjustable Coilovers • Gas Shocks • Anti-Roll Bars • Bushings",
      price: "38,700 LKR",
      category: "SUSPENSION",
      efficiency: "97%",
      brands: "KYB • Bilstein • Monroe • Eibach"
    },
    {
      id: 5,
      name: "Tire & Wheel Package",
      icon: CircleDot,
      description:
        "High-performance tire set with lightweight alloy wheels, TPMS sensors, and professional balancing service included",
      specs: "245/45R18 Tires • Alloy Wheels • TPMS • Balance & Alignment",
      price: "89,900 LKR",
      category: "TIRES & WHEELS",
      efficiency: "94%",
      brands: "Michelin • Continental • BBS • Enkei"
    },
    {
      id: 6,
      name: "Battery & Electrical Kit",
      icon: Battery,
      description:
        "Complete electrical system upgrade with high-capacity battery, alternator, and wiring harness for reliable power delivery",
      specs:
        "75Ah AGM Battery • Heavy Duty Alternator • Wiring Kit • Terminals",
      price: "32,400 LKR",
      category: "ELECTRICAL",
      efficiency: "98%",
      brands: "Varta • Bosch • Denso • Optima"
    }
  ];

  const handleCircleClick = (index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(index);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const nextItem = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % carParts.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const prevItem = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev - 1 + carParts.length) % carParts.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  // Auto-rotate system
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      if (!isAnimating) {
        nextItem();
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isAnimating, isAutoPlaying]);

  const currentPart = carParts[activeIndex];
  const IconComponent = currentPart.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 overflow-hidden relative p-12">
      {/* Background Car Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('./src/assets/mechanic-garage.jpg')`,
          filter: "brightness(1) saturate(0.9) contrast(1.2)"
        }}
      ></div>

      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/8 via-slate-900/10 to-slate-800/1"></div>

      {/* Neural Network Enhancement */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-red-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-32 w-96 h-96 bg-slate-700/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-red-600/12 rounded-full blur-2xl animate-pulse"></div>
      </div>

      {/* Futuristic Grid Overlay */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(193,0,7,0.3) 1px, transparent 0)`,
            backgroundSize: "50px 50px"
          }}
        ></div>
      </div>

      {/* Header */}
      <div className="relative flex justify-between items-start p-6">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <h1
              className="text-[200px] text-white tracking-tight"
              style={{ fontFamily: "Magenta, Arial Black, sans-serif" }}
            >
              Auto<span className="text-red-600">nexus</span>
            </h1>
            <h3 className="text-[15px] text-white mt-[12px]">
              AutoNexus is Sri Lanka's premier automotive parts marketplace,
              specializing in genuine OEM and
            </h3>
            <h3 className="text-[15px] text-white mt-[8px]">
              high-performance aftermarket components from trusted global brands
              like Bosch, Brembo, and KYB.
            </h3>
            <h3 className="text-[15px] text-white mt-[8px]">
              From brake systems to engine components, we deliver quality parts
              with warranty coverage nationwide.
            </h3>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative h-screen flex items-center justify-center -mt-114">
        {/* Revolutionary Circular Interface */}
        <div className="absolute -right-38 top-1/2 transform -translate-y-1/2 z-30">
          <div className="relative w-[600px] h-[600px]">
            {/* Quantum Field Background */}
            <div className="absolute inset-0">
              <div className="absolute inset-8 rounded-full border border-red-600/20 animate-pulse bg-gradient-to-br from-slate-800/10 to-transparent backdrop-blur-3xl"></div>
              <div className="absolute inset-16 rounded-full border border-slate-700/30"></div>
              <div
                className="absolute inset-24 rounded-full border border-red-600/10 animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>

            {/* Central Core - Now with part image */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gradient-to-br from-slate-800 via-slate-900 to-black shadow-2xl border border-red-600/40 flex items-center justify-center backdrop-blur-xl overflow-hidden">
              {/* Quantum Rings */}
              <div
                className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-red-600/30 via-transparent to-red-600/30 animate-spin"
                style={{ animationDuration: "15s" }}
              ></div>
              <div
                className="absolute inset-4 rounded-full border border-slate-700/50 animate-spin"
                style={{
                  animationDuration: "25s",
                  animationDirection: "reverse"
                }}
              ></div>

              {/* Core Display with Part Image */}
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-slate-900 to-black flex items-center justify-center border border-red-600/50 shadow-inner overflow-hidden">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-600/20 to-transparent animate-pulse"></div>

                {/* Icon Overlay */}
                <div className="relative z-10">
                  <IconComponent className="w-20 h-20 text-red-500 drop-shadow-xl" />
                </div>

                {/* Neural Patterns */}
                <div className="absolute inset-2 rounded-full border border-red-600/20"></div>
                <div className="absolute top-1/2 left-4 right-4 h-px bg-gradient-to-r from-transparent via-red-600/30 to-transparent"></div>
                <div className="absolute top-4 bottom-4 left-1/2 w-px bg-gradient-to-b from-transparent via-red-600/30 to-transparent"></div>
              </div>

              {/* Quantum Particles */}
              <div className="absolute top-4 right-8 w-1 h-1 rounded-full bg-red-800 animate-ping"></div>
              <div
                className="absolute bottom-8 left-4 w-1 h-1 rounded-full bg-red-800 animate-ping"
                style={{ animationDelay: "0.5s" }}
              ></div>
            </div>

            {/* Orbital Navigation Nodes */}
            {carParts.map((part, index) => {
              const rotationOffset = activeIndex * -60; // Changed from -72 to -60 for 6 items
              const adjustedAngle =
                (index * 60 + rotationOffset - 90) * (Math.PI / 180); // Changed from 72 to 60 degrees
              const radius = 220;
              const x = Math.cos(adjustedAngle) * radius;
              const y = Math.sin(adjustedAngle) * radius;
              const PartIcon = part.icon;
              const isActive = index === activeIndex;

              return (
                <button
                  key={part.id}
                  onClick={() => handleCircleClick(index)}
                  className={`absolute rounded-full transition-all duration-800 ease-out transform -translate-x-1/2 -translate-y-1/2 group ${
                    isActive
                      ? "w-32 h-32 bg-gradient-to-br from-red-600 via-red-500 to-red-800 shadow-2xl shadow-red-600/60 z-40 scale-110"
                      : "w-24 h-24 bg-gradient-to-br from-slate-800/90 via-slate-700/80 to-slate-900/90 hover:from-slate-700/90 hover:to-slate-800/90 backdrop-blur-xl border border-slate-600/30 hover:border-red-600/40 hover:scale-105 shadow-xl scale-75"
                  }`}
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: `translate(${x - (isActive ? 64 : 48)}px, ${
                      y - (isActive ? 64 : 48)
                    }px)`,
                    zIndex: isActive ? 40 : 20
                  }}
                >
                  {/* Neural Border */}
                  <div
                    className={`absolute inset-0 rounded-full transition-all duration-500 ${
                      isActive
                        ? "border-2 border-white/60"
                        : "border border-red-600/20 group-hover:border-red-600/50"
                    }`}
                  ></div>

                  {/* Node Content */}
                  <div className="relative w-full h-full rounded-full flex items-center justify-center">
                    {/* Neural Grid */}
                    <div className="absolute inset-2 rounded-full opacity-20">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-transparent to-white/20"></div>
                      <div className="absolute top-1/2 left-2 right-2 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                      <div className="absolute top-2 bottom-2 left-1/2 w-px bg-gradient-to-b from-transparent via-white/40 to-transparent"></div>
                    </div>

                    {/* Icon */}
                    <PartIcon
                      className={`transition-all duration-500 z-10 ${
                        isActive
                          ? "w-16 h-16 text-white drop-shadow-2xl"
                          : "w-8 h-8 text-red-400 group-hover:text-red-300"
                      }`}
                    />

                    {/* Status Indicators */}
                    {isActive && (
                      <>
                        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                        <div
                          className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-red-400 animate-pulse"
                          style={{ animationDelay: "0.7s" }}
                        ></div>
                      </>
                    )}
                  </div>
                </button>
              );
            })}

            {/* Connection System */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient
                  id="quantumActive"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#C10007" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#DC2626" stopOpacity="1" />
                  <stop offset="100%" stopColor="#C10007" stopOpacity="0.8" />
                </linearGradient>

                <linearGradient
                  id="quantumInactive"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#475569" stopOpacity="0" />
                  <stop offset="50%" stopColor="#64748B" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#475569" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Field Lines */}
              <circle
                cx="300"
                cy="300"
                r="220"
                fill="none"
                stroke="url(#quantumInactive)"
                strokeWidth="1"
                strokeDasharray="8,12"
                className="opacity-40"
              />

              {/* Neural Connections */}
              {carParts.map((_, index) => {
                const rotationOffset = activeIndex * -60; // Changed from -72 to -60
                const adjustedAngle =
                  (index * 60 + rotationOffset - 90) * (Math.PI / 180); // Changed from 72 to 60
                const radius = 220;
                const x1 = 300;
                const y1 = 300;
                const x2 = x1 + Math.cos(adjustedAngle) * radius;
                const y2 = y1 + Math.sin(adjustedAngle) * radius;

                return (
                  <g key={index}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={
                        index === activeIndex
                          ? "url(#quantumActive)"
                          : "url(#quantumInactive)"
                      }
                      strokeWidth={index === activeIndex ? "3" : "1"}
                      className="transition-all duration-800 ease-out"
                    />

                    {/* Data Flow */}
                    {index === activeIndex && (
                      <circle r="4" fill="#C10007" className="opacity-90">
                        <animateMotion
                          dur="1.5s"
                          repeatCount="indefinite"
                          path={`M ${x1} ${y1} L ${x2} ${y2}`}
                        />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Information Panel */}
        <div className="absolute bottom-8 left-8 right-8 z-25">
          <div className="grid grid-cols-5 gap-6 h-40">
            {/* Main Product Display */}
            <div
              className={`col-span-2 bg-gradient-to-br from-slate-800/40 to-slate-900/40 rounded-3xl p-8 border border-red-600/50 transition-all duration-800 ${
                isAnimating
                  ? "scale-105 shadow-2xl shadow-red-300/40"
                  : "shadow-2xl shadow-black/50"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-4 h-4 rounded-full bg-red-600 animate-pulse"></div>
                    <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                      {currentPart.name}
                    </h3>
                  </div>
                  <p className="text-slate-200 text-sm leading-relaxed mb-3">
                    {currentPart.description}
                  </p>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <p className="text-slate-300 text-xs font-mono tracking-wide">
                      {currentPart.specs}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <p className="text-green-300 text-xs font-mono tracking-wide">
                      {currentPart.brands}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-lg">
              <div className="text-center">
                <div className="text-slate-400 text-sm font-mono mb-2">
                  RELIABILITY
                </div>
                <div className="text-4xl font-black text-white mb-2">
                  {currentPart.efficiency}
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-red-600 to-red-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: currentPart.efficiency }}
                  ></div>
                </div>
                <div className="text-slate-400 text-xs font-mono mt-2">
                  TESTED QUALITY
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 rounded-3xl p-6 flex flex-col justify-center items-center shadow-xl shadow-red-600/30">
              <div className="text-center">
                <div className="flex items-center gap-2 justify-center mb-1">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  <span className="text-red-100 text-sm font-mono">
                    STARTING FROM
                  </span>
                </div>
                <span className="text-3xl font-black text-white drop-shadow-2xl block">
                  {currentPart.price}
                </span>
                <div className="mt-3 px-4 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                  <span className="text-xs text-white font-bold tracking-wider flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    WARRANTY INCLUDED
                  </span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 border border-slate-700/50">
              <div className="flex flex-col justify-between h-full">
                <div className="flex justify-between items-center">
                  <button
                    onClick={prevItem}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600/30 to-red-700/30 hover:from-red-600/50 hover:to-red-700/50 transition-all duration-300 flex items-center justify-center border border-red-600/40 hover:border-red-500/60 hover:scale-110 backdrop-blur-sm"
                    disabled={isAnimating}
                  >
                    <ChevronLeft className="w-6 h-6 text-red-400" />
                  </button>

                  <div className="text-center">
                    <span className="text-red-400 font-black text-xl">
                      {activeIndex + 1} / {carParts.length}
                    </span>
                  </div>

                  <button
                    onClick={nextItem}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600/30 to-red-700/30 hover:from-red-600/50 hover:to-red-700/50 transition-all duration-300 flex items-center justify-center border border-red-600/40 hover:border-red-500/60 hover:scale-110 backdrop-blur-sm"
                    disabled={isAnimating}
                  >
                    <ChevronRight className="w-6 h-6 text-red-400" />
                  </button>
                </div>

                {/* Progress Indicators */}
                <div className="flex gap-2 justify-center mt-4">
                  {carParts.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1 rounded-full transition-all duration-500 ${
                        idx === activeIndex
                          ? "w-8 bg-gradient-to-r from-red-600 to-red-500"
                          : "w-3 bg-slate-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Hub */}
        <div className="absolute bottom-8 right-8 flex flex-col gap-4">
          <button className="px-10 py-4 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white font-bold rounded-full hover:from-red-700 hover:via-red-800 hover:to-red-900 transition-all duration-300 shadow-2xl shadow-red-600/40 hover:shadow-red-600/60 border border-red-500/50 backdrop-blur-sm transform hover:scale-105">
            <span className="flex items-center gap-3">
              <ShoppingCart className="w-5 h-5" />
              BROWSE CATALOG
              <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
            </span>
          </button>
          <button className="px-10 py-4 bg-slate-800/80 backdrop-blur-2xl text-slate-200 font-semibold rounded-full border border-slate-600/50 hover:bg-slate-700/90 hover:border-red-600/50 transition-all duration-300 hover:scale-105 flex items-center gap-3">
            <Truck className="w-5 h-5" />
            ISLAND-WIDE DELIVERY
          </button>
        </div>
      </div>
    </div>
  );
};

export default AutoNexusLanding;
