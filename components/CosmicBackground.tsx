import React, { useRef, useEffect } from 'react';

const CosmicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles: { x: number; y: number; z: number; size: number; color: string }[] = [];
    const particleCount = 500;
    const colors = ['#FFFFFF', '#C7D2FE', '#A5B4FC', '#818CF8'];

    const setup = () => {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        
        particles.length = 0; // Clear existing particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                z: Math.random() * 1000,
                size: Math.random() * 1.5 + 0.5,
                color: colors[Math.floor(Math.random() * colors.length)],
            });
        }
    };

    const draw = () => {
        if (!ctx) return;
        const width = window.innerWidth;
        const height = window.innerHeight;

        ctx.clearRect(0, 0, width, height);

        ctx.save();
        ctx.translate(width / 2, height / 2);

        particles.forEach(p => {
            const scale = 1000 / (1000 + p.z);
            const x = p.x * 2 - width;
            const y = p.y * 2 - height;
            
            const screenX = x * scale;
            const screenY = y * scale;
            const alpha = (1000 - p.z) / 1000;

            ctx.beginPath();
            ctx.arc(screenX, screenY, p.size * scale, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = alpha;
            ctx.fill();

            p.z -= 1;
            if (p.z < 0) {
                p.z = 1000;
            }
        });

        ctx.restore();
        animationFrameId = requestAnimationFrame(draw);
    };

    setup();
    draw();
    
    window.addEventListener('resize', setup);

    return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', setup);
    };
  }, []);

  return (
    <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
};

export default CosmicBackground;
