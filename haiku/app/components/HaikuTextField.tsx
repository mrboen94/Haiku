import React, { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  alpha: number;
  color: number[];
  velocity: {
    x: number;
    y: number;
  };
}

const MAX_PARTICLES = 50;
const PARTICLE_ALPHA_FADEOUT = 0.96;
const PARTICLE_VELOCITY_RANGE = {
  x: [0, 3], // controls the x direction particle velocity range
  y: [-2.5, -1.5], // controls the y direction particle velocity range
};

const MyAnimatedTextarea: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const [needsRedraw, setNeedsRedraw] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawFrame = () => {
      if (particles.current.length) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.current.forEach((particle) => {
          particle.velocity.y += 0.075; // Gravity
          particle.x += particle.velocity.x;
          particle.y += particle.velocity.y;
          particle.alpha *= PARTICLE_ALPHA_FADEOUT;

          if (particle.alpha > 0.1) {
            ctx.fillStyle = `rgba(${particle.color.join(",")}, ${
              particle.alpha
            })`;
            ctx.fillRect(
              Math.round(particle.x - 1),
              Math.round(particle.y - 1),
              3,
              3,
            );
          }
        });

        particles.current = particles.current.filter(
          (particle) => particle.alpha > 0.1,
        );
      }

      if (particles.current.length > 0 || needsRedraw) {
        requestAnimationFrame(drawFrame);
      }
    };

    requestAnimationFrame(drawFrame);
  }, [needsRedraw]);

  const spawnParticles = (x: number, y: number) => {
    const numParticles = 5 + Math.round(Math.random() * 5);
    for (let i = 0; i < numParticles; i++) {
      const color = [255, 0, 0]; // Red color for demonstration
      particles.current.push(createParticle(x, y, color));
    }

    if (!needsRedraw) {
      setNeedsRedraw(true);
    }
  };

  const createParticle = (x: number, y: number, color: number[]): Particle => {
    return {
      x,
      y,
      alpha: 1,
      color,
      velocity: {
        x:
          PARTICLE_VELOCITY_RANGE.x[0] +
          Math.random() *
            (PARTICLE_VELOCITY_RANGE.x[1] - PARTICLE_VELOCITY_RANGE.x[0]),
        y:
          PARTICLE_VELOCITY_RANGE.y[0] +
          Math.random() *
            (PARTICLE_VELOCITY_RANGE.y[1] - PARTICLE_VELOCITY_RANGE.y[0]),
      },
    };
  };

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const { left, top } = textarea.getBoundingClientRect();
    const cursorPos = textarea.selectionStart;
    const lines = textarea.value.substring(0, cursorPos).split("\n");

    const lineNum = lines.length;
    const colNum = lines[lines.length - 1].length;

    // You may need to adjust these based on your specific styling
    const charWidth = 10; // Approximate width of a character in pixels
    const lineHeight = 20; // Approximate line height in pixels

    const x = left + colNum * charWidth;
    const y = top + (lineNum - 1) * lineHeight;

    spawnParticles(x, y);
  };

  return (
    <div style={{ position: "relative" }}>
      <textarea
        onInput={handleInput}
        style={{ zIndex: 1 }}
        className={"font-mono h-64 leading-5 w-full"}
      />
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>
    </div>
  );
};

export default MyAnimatedTextarea;
