import React, { useEffect, useRef } from 'react';

interface HeartParticle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  type: 'heart' | 'petal' | 'sparkle';
  life?: number;
  maxLife?: number;
}

export const FloatingHearts: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = [
      'rgba(244, 63, 94, 0.65)',   // rose-500
      'rgba(251, 113, 133, 0.7)',  // rose-400
      'rgba(244, 114, 182, 0.7)',  // pink-400
      'rgba(236, 72, 153, 0.65)',  // pink-500
      'rgba(255, 182, 193, 0.8)',  // lightpink
      'rgba(255, 215, 0, 0.6)',    // sparkle gold
    ];

    const particles: HeartParticle[] = [];
    const maxParticles = 35;

    // Helper to draw heart shape on 2D context
    const drawHeart = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string,
      rotation: number
    ) => {
      context.save();
      context.translate(x, y);
      context.rotate((rotation * Math.PI) / 180);
      context.fillStyle = color;
      context.beginPath();

      const topCurveHeight = size * 0.3;
      context.moveTo(0, topCurveHeight);
      // top left curve
      context.bezierCurveTo(
        -size / 2,
        -topCurveHeight,
        -size,
        topCurveHeight / 2,
        0,
        size
      );
      // top right curve
      context.bezierCurveTo(
        size,
        topCurveHeight / 2,
        size / 2,
        -topCurveHeight,
        0,
        topCurveHeight
      );

      context.closePath();
      context.fill();
      context.restore();
    };

    // Helper to draw falling sakura petal
    const drawPetal = (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string,
      rotation: number
    ) => {
      context.save();
      context.translate(x, y);
      context.rotate((rotation * Math.PI) / 180);
      context.fillStyle = color;
      context.beginPath();
      context.ellipse(0, 0, size * 0.6, size * 1.2, 0, 0, Math.PI * 2);
      context.fill();
      context.restore();
    };

    // Initialize initial ambient particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 12 + 8,
        speedY: -(Math.random() * 0.8 + 0.4),
        speedX: Math.sin(Math.random() * 10) * 0.5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.2,
        opacity: Math.random() * 0.6 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: Math.random() > 0.4 ? 'heart' : 'petal',
      });
    }

    // Burst particles on mouse click or tap
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      for (let i = 0; i < 14; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 3 + 1.5;
        particles.push({
          x: clientX,
          y: clientY,
          size: Math.random() * 14 + 10,
          speedX: Math.cos(angle) * velocity,
          speedY: Math.sin(angle) * velocity - 1.2,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 4,
          opacity: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          type: Math.random() > 0.3 ? 'heart' : 'sparkle',
          life: 0,
          maxLife: 60 + Math.random() * 30,
        });
      }
    };

    window.addEventListener('click', handlePointerDown);

    // Animation Render Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // If it's a burst click particle
        if (p.maxLife !== undefined) {
          p.life!++;
          p.opacity = 1 - p.life! / p.maxLife;
          p.speedY += 0.05; // slight gravity for burst

          if (p.life! >= p.maxLife) {
            particles.splice(i, 1);
            continue;
          }
        } else {
          // Ambient particle floating up
          p.speedX += Math.sin(p.y * 0.01) * 0.02;

          // Recycle ambient particle when it floats off top
          if (p.y < -30) {
            p.y = height + 20;
            p.x = Math.random() * width;
          }
          if (p.x < -30) p.x = width + 20;
          if (p.x > width + 30) p.x = -20;
        }

        ctx.globalAlpha = Math.max(0, p.opacity);

        if (p.type === 'heart') {
          drawHeart(ctx, p.x, p.y, p.size, p.color, p.rotation);
        } else if (p.type === 'petal') {
          drawPetal(ctx, p.x, p.y, p.size, p.color, p.rotation);
        } else {
          // Sparkle dot
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handlePointerDown);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
};
