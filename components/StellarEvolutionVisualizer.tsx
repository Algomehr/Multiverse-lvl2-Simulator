import React, { useRef, useEffect } from 'react';
import { StellarEvolutionData } from '../types';

interface StellarEvolutionVisualizerProps {
  data: StellarEvolutionData;
}

export const StellarEvolutionVisualizer: React.FC<StellarEvolutionVisualizerProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        
        const width = rect.width;
        const height = rect.height;

        ctx.clearRect(0, 0, width, height);

        const stages = data.stages;
        const numStages = stages.length;
        const padding = 60;
        const contentWidth = width - 2 * padding;
        const stepX = numStages > 1 ? contentWidth / (numStages - 1) : 0;
        const y_pos = height / 2.2;
        
        // Use a logarithmic scale for sizes to prevent huge stars from overwhelming the canvas
        const sizes = stages.map(s => Math.log10(Math.max(s.relativeSize, 1)) + 1);
        const maxSize = Math.max(...sizes);
        const baseRadius = 15;
        const radiusScale = 30 / maxSize;

        // Draw connecting lines
        ctx.beginPath();
        ctx.moveTo(padding, y_pos);
        for (let i = 1; i < numStages; i++) {
            const x = padding + i * stepX;
            ctx.lineTo(x, y_pos);
        }
        ctx.strokeStyle = '#4a5568';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw stages
        stages.forEach((stage, i) => {
            const x = padding + i * stepX;
            const radius = sizes[i] * radiusScale + baseRadius;
            
            // Star glow
            const grad = ctx.createRadialGradient(x, y_pos, radius * 0.2, x, y_pos, radius);
            grad.addColorStop(0, `${stage.color}ff`);
            grad.addColorStop(0.4, `${stage.color}80`);
            grad.addColorStop(1, `${stage.color}00`);

            ctx.fillStyle = grad;
            ctx.fillRect(x - radius * 2, y_pos - radius * 2, radius * 4, radius * 4);
            
            // Star core
            ctx.beginPath();
            ctx.arc(x, y_pos, radius, 0, Math.PI * 2);
            ctx.fillStyle = stage.color;
            ctx.fill();

            // Text labels
            ctx.fillStyle = '#c7d2fe';
            ctx.textAlign = 'center';
            ctx.font = 'bold 14px Inter, Vazirmatn, sans-serif';
            ctx.fillText(stage.name, x, y_pos + radius + 25);

            ctx.fillStyle = '#a0aec0';
            ctx.font = '12px Inter, Vazirmatn, sans-serif';
            ctx.fillText(stage.duration, x, y_pos + radius + 45);
        });
    };

    draw();
    
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);

  }, [data]);

  return <canvas ref={canvasRef} className="w-full h-64 rounded-lg" />;
};
