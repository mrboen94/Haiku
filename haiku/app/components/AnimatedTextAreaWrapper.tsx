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
const PARTICLE_ALPHA_FADEOUT = 0.99;
const PARTICLE_VELOCITY_RANGE = {
  x: [0, 3], // controls the x direction particle velocity range
  y: [-3.5, -1.5], // controls the y direction particle velocity range
};

interface AnimatedTextAreaProps {
  haiku: string;
  onChange: (event: any) => void;
}

export const AnimatedTextAreaWrapper = ({
  haiku,
  onChange,
}: AnimatedTextAreaProps) => {
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
      const color = [Math.random() * 155, Math.random() * 155 + 100, 255];
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
    const charWidth = 9.65; // Approximate width of a character in pixels
    const lineHeight = 20; // Approximate line height in pixels

    const x = left + colNum * charWidth;
    const y = top + (lineNum - 1) * lineHeight;

    spawnParticles(x, y);
  };

  if (window != null)
    return (
      <div
        className={
          "rounded-[calc(1.5rem-1px)] p-px bg-gradient-to-tr from-blue-400 to-cyan-500"
        }
      >
        <div
          className={
            "rounded-[calc(1.5rem-1px)] p-10 bg-gradient-to-tr from-blue-900 to-cyan-900"
          }
        >
          <div className={""}>
            <textarea
              onInput={handleInput}
              id={"haikuWindow"}
              value={haiku}
              onChange={onChange}
              rows={5}
              cols={50}
              className={
                "font-mono h-32 leading-5 w-full z-index-10 border-none outline-none resize-none bg-transparent text-white"
              }
            />
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
              }}
              width={window.innerWidth}
              height={window.innerHeight}
            />
          </div>
        </div>
      </div>
    );
  return null;
};
