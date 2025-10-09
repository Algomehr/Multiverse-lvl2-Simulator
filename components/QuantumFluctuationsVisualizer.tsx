import React, { useRef, useEffect } from 'react';

interface QuantumFluctuationsVisualizerProps {
  energyLevel: number; // 0 to 1
  fluctuationScale: number; // 0 to 1
}

interface Particle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  color: string;
  vx: number;
  vy: number;
}

const PARTICLE_COLORS = ['#A5B4FC', '#C7D2FE', '#FBCFE8', '#F9A8D4'];

export const QuantumFluctuationsVisualizer: React.FC<QuantumFluctuationsVisualizerProps> = ({ energyLevel, fluctuationScale }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setup = () => {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        particles.current = [];
    };

    const draw = () => {
        const rect = canvas.getBoundingClientRect();
        const { width, height } = rect;

        ctx.clearRect(0, 0, width, height);

        // Spawn new particles
        const particlesToSpawn = Math.floor(energyLevel * 5);
        for (let i = 0; i < particlesToSpawn; i++) {
            if (particles.current.length < energyLevel * 500) {
                const maxLife = 50 + Math.random() * 100 * (1 - energyLevel);
                particles.current.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    size: 1 + Math.random() * 3 * fluctuationScale,
                    opacity: 0,
                    life: 0,
                    maxLife,
                    color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
                    vx: (Math.random() - 0.5) * fluctuationScale,
                    vy: (Math.random() - 0.5) * fluctuationScale,
                });
            }
        }

        // Update and draw particles
        particles.current.forEach((p, index) => {
            p.life++;
            p.x += p.vx;
            p.y += p.vy;

            // Fade in and out
            if (p.life < p.maxLife / 2) {
                p.opacity = p.life / (p.maxLife / 2);
            } else {
                p.opacity = 1 - ((p.life - p.maxLife / 2) / (p.maxLife / 2));
            }
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity * 0.8;
            ctx.fill();

            // Remove dead particles
            if (p.life >= p.maxLife) {
                particles.current.splice(index, 1);
            }
        });
        ctx.globalAlpha = 1.0;

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
  }, [energyLevel, fluctuationScale]);

  return <canvas ref={canvasRef} className="w-full h-64 rounded-lg bg-slate-900" />;
};