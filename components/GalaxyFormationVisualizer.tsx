import React, { useRef, useEffect } from 'react';
import { GalaxyVisualizationParameters, GalaxyFormationData } from '../types';

interface GalaxyVisualizerProps {
  params: GalaxyVisualizationParameters;
  galaxyType: GalaxyFormationData['galaxyType'];
}

interface Particle {
  distance: number;
  angle: number;
  speed: number;
  size: number;
  color: string;
  type: 'star' | 'dust';
}

// Helper to parse a hex color string into an {r, g, b} object
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 255, g: 255, b: 255 }; // Default to white if parse fails
};

// Helper to linearly interpolate between two numbers
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const GalaxyFormationVisualizer: React.FC<GalaxyVisualizerProps> = ({ params, galaxyType }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let particles: Particle[] = [];
    const coreColorRGB = hexToRgb(params.coreColor);
    const armColorRGB = hexToRgb(params.armColor);

    const setup = () => {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        
        particles = [];
        const maxDist = Math.min(rect.width, rect.height) / 2.2;
        const clumpCenters = [{x: 0, y: 0}];
        if (galaxyType === 'Irregular') {
            const numClumps = 3 + Math.floor(Math.random() * 3);
            for (let i = 0; i < numClumps; i++) {
                clumpCenters.push({
                    x: (Math.random() - 0.5) * maxDist,
                    y: (Math.random() - 0.5) * maxDist,
                });
            }
        }

        for (let i = 0; i < params.particleCount; i++) {
            let distance: number;
            let angle = Math.random() * Math.PI * 2;
            const clump = clumpCenters[Math.floor(Math.random() * clumpCenters.length)];
            const isDust = galaxyType === 'Spiral' && Math.random() < 0.1;

            switch (galaxyType) {
                case 'Elliptical':
                    distance = Math.pow(Math.random(), 2) * maxDist;
                    break;
                case 'Irregular':
                    distance = Math.pow(Math.random(), 1.5) * maxDist * 0.5;
                    break;
                case 'Spiral':
                default:
                    const isCore = Math.random() < params.coreSize;
                    distance = isCore 
                        ? Math.pow(Math.random(), 2) * maxDist * params.coreSize 
                        : (params.coreSize + Math.pow(Math.random(), 0.5) * (1 - params.coreSize)) * maxDist;
                    break;
            }

            const t = distance / maxDist; // Normalized distance
            const r = Math.round(lerp(coreColorRGB.r, armColorRGB.r, t));
            const g = Math.round(lerp(coreColorRGB.g, armColorRGB.g, t));
            const b = Math.round(lerp(coreColorRGB.b, armColorRGB.b, t));
            
            const dispersion = params.colorDispersion * (Math.random() - 0.5) * 50;
            const finalR = Math.min(255, Math.max(0, r + dispersion));
            const finalG = Math.min(255, Math.max(0, g + dispersion));
            const finalB = Math.min(255, Math.max(0, b + dispersion));
            
            particles.push({
                distance,
                angle,
                speed: (0.0005 / (distance * 0.5 + 1)) * (maxDist / 200),
                size: isDust ? (Math.random() * 2 + 2) : (Math.random() * 1.5 + 0.5),
                color: isDust ? params.dustColor : `rgb(${finalR}, ${finalG}, ${finalB})`,
                type: isDust ? 'dust' : 'star',
            });
        }
    }

    const draw = () => {
        const rect = canvas.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const centerX = width / 2;
        const centerY = height / 2;

        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(15, 23, 42, 0.4)'; // Fading effect
        ctx.fillRect(0, 0, width, height);

        // Draw a soft glow for the core
        const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width * params.coreSize * 0.5);
        coreGradient.addColorStop(0, `rgba(${coreColorRGB.r}, ${coreColorRGB.g}, ${coreColorRGB.b}, 0.1)`);
        coreGradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = coreGradient;
        ctx.fillRect(0, 0, width, height);

        ctx.globalCompositeOperation = 'lighter'; // Additive blending for stars

        particles.forEach(p => {
            p.angle += p.speed;

            let displayAngle = p.angle;
            if (galaxyType === 'Spiral' && params.armCount > 0) {
                 const armSeparation = (Math.PI * 2) / params.armCount;
                 const armOffset = p.angle - (p.angle % armSeparation);
                 const tightness = (p.type === 'dust' ? 1.5 : 1) * params.spiralTightness;
                 displayAngle = armOffset + Math.log1p(p.distance) * tightness + p.angle % armSeparation;
            }
            
            const x = centerX + Math.cos(displayAngle) * p.distance * (1 - params.ellipticity / 2);
            const y = centerY + Math.sin(displayAngle) * p.distance * (1 + params.ellipticity / 2);

            ctx.beginPath();
            ctx.arc(x, y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            if (p.type === 'dust') {
              ctx.globalAlpha = 0.3;
              ctx.globalCompositeOperation = 'source-over';
              ctx.fill();
              ctx.globalAlpha = 1.0;
              ctx.globalCompositeOperation = 'lighter';
            } else {
              ctx.fill();
            }
        });

        animationFrameId.current = requestAnimationFrame(draw);
    };

    setup();
    draw();
    
    window.addEventListener('resize', setup);

    return () => {
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }
        window.removeEventListener('resize', setup);
    };

  }, [params, galaxyType]);

  return <canvas ref={canvasRef} className="w-full h-64 rounded-lg bg-slate-900" />;
};