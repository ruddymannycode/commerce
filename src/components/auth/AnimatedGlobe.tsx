"use client";

import React from "react";

/**
 * AnimatedGlobe Component
 * Optimized for maximum SVG clarity and professional staggered animations.
 */
const AnimatedGlobe = () => {
  // Data for the chips matching the Figma screenshot exactly
  // Using the actual filenames found in public/assets
  const chips = [
    { id: "cad", src: "/assets/cad.svg", pos: "top-[4%] left-[10%]", floatDelay: "0s", phaseDelay: "2s" },
    { id: "eur", src: "/assets/eur.svg", pos: "top-[10%] right-[12%]", floatDelay: "1.5s", phaseDelay: "5s" },
    { id: "usd", src: "/assets/usd.svg", pos: "top-[36%] left-[-10%]", floatDelay: "3s", phaseDelay: "8s" },
    { id: "gpb", src: "/assets/gpb.svg", pos: "top-[34%] right-[-14%]", floatDelay: "4.5s", phaseDelay: "11s" },
    { id: "ngn", src: "/assets/ngn.svg", pos: "bottom-[16%] right-[12%]", floatDelay: "6s", phaseDelay: "14s" },
  ];

  return (
    <div className="relative w-full max-w-[460px] aspect-square flex items-center justify-center select-none">
      
      {/* 
        --- THE GLOBE CORE --- 
        Forced hardware acceleration and crisp rendering.
      */}
      <div className="relative w-full h-full animate-[spin_100s_linear_infinite] transform-gpu backface-hidden">
        
        {/* Layer 1: The Map */}
        <div className="absolute inset-x-[12%] inset-y-[12%] z-10 flex items-center justify-center p-2">
          <img 
            src="/assets/globe-map.svg" 
            alt="Globe Map" 
            className="w-full h-full object-contain [shape-rendering:geometricPrecision] [image-rendering:crisp-edges]"
          />
        </div>

        {/* Layer 2: The Wireframe */}
        <div className="absolute inset-0 z-20 flex items-center justify-center mix-blend-plus-lighter">
          <img 
            src="/assets/globe-wireframe.svg" 
            alt="Globe Wireframe" 
            className="w-full h-full object-contain opacity-60 [shape-rendering:geometricPrecision] filter brightness-110"
          />
        </div>
      </div>

      {/* 
        --- FLOATING CURRENCY CHIPS --- 
        Advanced animation logic:
        1. float-vibration: Subtle movement.
        2. phase-out: Staggered appearance/disappearance.
      */}
      {chips.map((chip, index) => (
        <div
          key={chip.id}
          className="absolute z-30 group"
          style={{ 
            ...parsePos(chip.pos),
            animation: `float-vibrate 8s ease-in-out infinite, phase-cycle 15s ease-in-out infinite`,
            animationDelay: `${chip.floatDelay}, ${chip.phaseDelay}`,
            willChange: "transform, opacity"
          }}
        >
          <div className="w-[110px] xl:w-[130px] transition-transform duration-500 group-hover:scale-110">
            <img 
              src={chip.src} 
              alt={chip.id} 
              className="w-full h-auto block [image-rendering:crisp-edges] drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)]"
            />
          </div>
        </div>
      ))}

      {/* Atmospheric Glow */}
      <div className="absolute inset-0 bg-[#5E2B96]/5 blur-[120px] rounded-full animate-pulse pointer-events-none" />
      
      <style jsx global>{`
        @keyframes float-vibrate {
          0%, 100% { transform: translate3d(0, 0, 0); }
          33% { transform: translate3d(5px, -10px, 0); }
          66% { transform: translate3d(-5px, 5px, 0); }
        }

        @keyframes phase-cycle {
          0%, 55%, 100% { opacity: 1; transform: scale(1) translateZ(0); filter: blur(0); }
          70%, 85% { opacity: 0; transform: scale(0.8) translateZ(0); filter: blur(8px); }
          95% { opacity: 1; transform: scale(1.1) translateZ(0); filter: blur(0); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

/**
 * Helper to parse Tailwind-style positioning strings into CSS objects
 */
function parsePos(posStr: string) {
  const parts = posStr.split(' ');
  const style: any = {};
  parts.forEach(p => {
    if (p.startsWith('top-')) style.top = p.replace('top-[', '').replace(']', '');
    if (p.startsWith('bottom-')) style.bottom = p.replace('bottom-[', '').replace(']', '');
    if (p.startsWith('left-')) style.left = p.replace('left-[', '').replace(']', '');
    if (p.startsWith('right-')) style.right = p.replace('right-[', '').replace(']', '');
  });
  return style;
}

export default AnimatedGlobe;
