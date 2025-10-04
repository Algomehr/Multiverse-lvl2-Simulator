import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StellarEvolutionData3D, StellarStage3D } from '../types';
import { useI18n } from '../i18n';

// Robust color parsing utility
const parseColor = (colorStr: string | undefined): { r: number; g: number; b: number } => {
  const fallback = { r: 255, g: 255, b: 255 }; // Default to white
  if (typeof colorStr !== 'string' || !colorStr.startsWith('#')) {
    return fallback;
  }

  let hex = colorStr.slice(1);

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  if (hex.length !== 6) {
    return fallback;
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return fallback;
  }

  return { r, g, b };
};


// Utility for linear interpolation
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Utility to interpolate between two hex colors using the robust parser
const lerpColor = (color1: string, color2: string, t: number) => {
    const from = parseColor(color1);
    const to = parseColor(color2);
    const r = Math.round(lerp(from.r, to.r, t));
    const g = Math.round(lerp(from.g, to.g, t));
    const b = Math.round(lerp(from.b, to.b, t));
    return `rgb(${r},${g},${b})`;
};

// FIX: Added interface definition for component props.
interface StellarEvolutionVisualizer3DProps {
  data: StellarEvolutionData3D;
}

export const StellarEvolutionVisualizer3D: React.FC<StellarEvolutionVisualizer3DProps> = ({ data }) => {
  const { t } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stageIndex, setStageIndex] = useState(0);
  const animationFrameId = useRef<number>();
  const lastStageIndex = useRef(0);
  const transitionProgress = useRef(1); // Start at 1 (no transition)

  const currentStage = data.stages[stageIndex];

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const { width, height } = rect;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Handle transitions
    if (transitionProgress.current < 1) {
      transitionProgress.current += 0.02; // Transition speed
    }
    transitionProgress.current = Math.min(transitionProgress.current, 1);

    const fromStage = data.stages[lastStageIndex.current];
    const toStage = data.stages[stageIndex];
    
    // Interpolate properties with fallbacks for safety
    const t = transitionProgress.current;
    const currentSize = lerp(fromStage?.relativeSize ?? 1, toStage?.relativeSize ?? 1, t);
    const currentCoronaSize = lerp(fromStage?.coronaSize ?? 0, toStage?.coronaSize ?? 0, t);
    const currentEmissivity = lerp(fromStage?.emissivity ?? 0, toStage?.emissivity ?? 0, t);
    const currentColor = lerpColor(fromStage?.color ?? '#FFFFFF', toStage?.color ?? '#FFFFFF', t);
    const currentCoronaColor = lerpColor(fromStage?.coronaColor ?? '#FFFFFF', toStage?.coronaColor ?? '#FFFFFF', t);
    const currentTexture = t < 0.5 ? (fromStage?.surfaceTexture ?? 'smooth') : (toStage?.surfaceTexture ?? 'smooth');


    // --- Drawing ---
    const baseRadius = Math.max(width, height) * 0.1;
    const starRadius = baseRadius * (Math.log1p(currentSize) / Math.log1p(100) + 0.1);

    if (currentTexture !== 'blackhole') {
      // 1. Corona
      if (currentCoronaSize > 0) {
        const coronaRadius = starRadius + baseRadius * currentCoronaSize * 0.5;
        const coronaGrad = ctx.createRadialGradient(centerX, centerY, starRadius, centerX, centerY, coronaRadius);
        coronaGrad.addColorStop(0, `${currentCoronaColor}80`);
        coronaGrad.addColorStop(1, `${currentCoronaColor}00`);
        ctx.fillStyle = coronaGrad;
        ctx.fillRect(0, 0, width, height);
      }
      
      // 2. Main Glow (Emissivity)
      const glowRadius = starRadius * (1 + currentEmissivity * 2);
      const glowGrad = ctx.createRadialGradient(centerX, centerY, starRadius * 0.5, centerX, centerY, glowRadius);
      glowGrad.addColorStop(0, `rgba(255, 255, 255, ${currentEmissivity * 0.8})`);
      glowGrad.addColorStop(0.7, `${currentColor}80`);
      glowGrad.addColorStop(1, `${currentColor}00`);
      ctx.fillStyle = glowGrad;
      ctx.fillRect(centerX - glowRadius, centerY - glowRadius, glowRadius * 2, glowRadius * 2);

      // 3. Star Body
      ctx.beginPath();
      ctx.arc(centerX, centerY, starRadius, 0, Math.PI * 2);
      ctx.fillStyle = currentColor;
      ctx.fill();

      // 4. Surface Texture
      if (currentTexture === 'turbulent') {
          ctx.globalCompositeOperation = 'lighter';
          const turbulenceCount = 5;
          for (let i = 0; i < turbulenceCount; i++) {
              ctx.beginPath();
              const angle = (Date.now() / (2000 + i*300)) + i * Math.PI / 2;
              const arcRadius = starRadius * (0.8 + Math.random() * 0.2);
              ctx.arc(centerX, centerY, arcRadius, angle, angle + Math.PI * 0.5);
              ctx.lineWidth = starRadius * 0.1 * (Math.random() * 0.5 + 0.5);
              ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + currentEmissivity * 0.1})`;
              ctx.stroke();
          }
          ctx.globalCompositeOperation = 'source-over';
      }
    } else { // Blackhole visualization
        const accretionDiskOuterRadius = baseRadius * 2;
        const accretionDiskInnerRadius = baseRadius * 0.8;

        const diskGrad = ctx.createRadialGradient(centerX, centerY, accretionDiskInnerRadius, centerX, centerY, accretionDiskOuterRadius);
        diskGrad.addColorStop(0, `${currentCoronaColor}00`);
        diskGrad.addColorStop(0.2, `${currentCoronaColor}ff`);
        diskGrad.addColorStop(0.8, `${lerpColor(currentCoronaColor, '#FFD700', 0.5)}80`);
        diskGrad.addColorStop(1, `${lerpColor(currentCoronaColor, '#FFD700', 0.5)}00`);

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(Date.now() / 5000);
        ctx.translate(-centerX, -centerY);
        ctx.fillStyle = diskGrad;
        ctx.fillRect(centerX-accretionDiskOuterRadius, centerY-accretionDiskOuterRadius, accretionDiskOuterRadius*2, accretionDiskOuterRadius*2);
        ctx.restore();

        // Event horizon
        ctx.beginPath();
        ctx.arc(centerX, centerY, accretionDiskInnerRadius * 0.9, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();
    }


    animationFrameId.current = requestAnimationFrame(draw);
  }, [stageIndex, data]);

  useEffect(() => {
    transitionProgress.current = 0; // Start transition
    // lastStageIndex does not trigger re-render, perfect for tracking previous state
    const timeoutId = setTimeout(() => {
        lastStageIndex.current = stageIndex;
    }, 50); // Delay update to allow transition to start with old value

    return () => clearTimeout(timeoutId);
  }, [stageIndex]);

  useEffect(() => {
    draw();
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [draw]);

  return (
    <div className="space-y-4">
      <canvas ref={canvasRef} className="w-full h-80 rounded-lg bg-black" />
      <div className="bg-slate-800/50 p-4 rounded-lg space-y-4">
         <div>
            <label htmlFor="stage-slider" className="text-lg font-semibold text-indigo-300 mb-2 block">{t('stellarEvolution3D.stageControls')}: <span className="text-white font-bold">{currentStage?.name ?? 'Loading...'}</span></label>
            <input
                id="stage-slider"
                type="range"
                min="0"
                max={data.stages.length - 1}
                value={stageIndex}
                onChange={(e) => setStageIndex(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1 px-1">
                <span>{data.stages[0]?.name ?? ''}</span>
                <span>{data.stages[data.stages.length - 1]?.name ?? ''}</span>
            </div>
        </div>

        {currentStage && <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm bg-slate-900/50 p-3 rounded-lg">
           <div>
             <p className="font-semibold text-indigo-300">{t('stellarEvolution3D.duration')}</p>
             <p className="text-slate-200">{currentStage.duration}</p>
           </div>
           <div>
             <p className="font-semibold text-indigo-300">{t('stellarEvolution3D.temperature')}</p>
             <p className="text-slate-200">{currentStage.temperature}</p>
           </div>
           <div className="md:col-span-3">
             <p className="font-semibold text-indigo-300">Description</p>
             <p className="text-slate-300">{currentStage.description}</p>
           </div>
        </div>}
      </div>
    </div>
  );
};