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
}

export const GalaxyFormationVisualizer: React.FC<GalaxyVisualizerProps> = ({ params, galaxyType }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let particles: Particle[] = [];
    
    const setup = () => {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        const width = rect.width;
        
        particles = [];
        const maxDist = width / 2.2;

        for (let i = 0; i < params.particleCount; i++) {
            const isCore = Math.random() < params.coreSize;
            let distance: number;

            if (galaxyType === 'Elliptical') {
                 distance = Math.pow(Math.random(), 1.5) * maxDist;
            } else {
                 distance = isCore 
                    ? Math.random() * maxDist * params.coreSize 
                    : (params.coreSize + (1 - params.coreSize) * Math.random()) * maxDist;
            }

            particles.push({
                distance,
                angle: Math.random() * Math.PI * 2,
                speed: (0.0005 / (distance * 0.5 + 1)) * (maxDist / 200),
                size: Math.random() * 1.5 + 0.5,
                color: isCore ? params.coreColor : params.armColor,
            });
        }
    }

    const draw = () => {
        const rect = canvas.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const centerX = width / 2;
        const centerY = height / 2;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.4)'; // Fading effect
        ctx.fillRect(0, 0, width, height);

        particles.forEach(p => {
            p.angle += p.speed;

            let displayAngle = p.angle;
            if (galaxyType === 'Spiral' && params.armCount > 0) {
                 const armOffset = Math.floor(p.angle * params.armCount / (Math.PI * 2)) * (Math.PI * 2) / params.armCount;
                 displayAngle = p.angle + Math.log(p.distance + 1) * params.spiralTightness + armOffset;
            }
            
            const x = centerX + Math.cos(displayAngle) * p.distance * (1 - params.ellipticity);
            const y = centerY + Math.sin(displayAngle) * p.distance;

            ctx.beginPath();
            ctx.arc(x, y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
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
