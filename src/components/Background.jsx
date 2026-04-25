import React, { useRef, useEffect } from 'react';

export default function Background({ timeOfDay, weather }) {
  const condition = (weather?.current?.condition?.text || '').toLowerCase();
  const isRaining = /rain|drizzle|shower|sleet|thunder|storm/.test(condition);
  const isThunder = /thunder|storm/.test(condition);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId = null;
    let particles = [];
    let lastTime = performance.now();

    // Resize canvas to device pixels
    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      // Reset any transform then scale according to DPR without accumulating
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener('resize', resize);

    function spawnSplash(x) {
      const count = 6 + Math.round(Math.random() * 6);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 18,
          y: 0,
          vx: (Math.random() - 0.5) * 1.8,
          vy: - (2 + Math.random() * 3),
          life: 600 + Math.random() * 400,
          r: 1 + Math.random() * 2,
          born: performance.now(),
        });
      }
    }

    function loop(now) {
      const dt = now - lastTime;
      lastTime = now;
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

      // spawn splashes randomly across width depending on rain intensity
      if (isRaining) {
        const spawnRate = 0.5; // splashes per frame approx
        if (Math.random() < 0.6) {
          const x = Math.random() * canvas.clientWidth;
          spawnSplash(x);
        }
      }

      // update particles
      particles = particles.filter(p => {
        const age = now - p.born;
        if (age > p.life) return false;
        // simple physics
        p.vy += 0.12 * (dt / 16);
        p.x += p.vx * (dt / 16);
        p.y += p.vy * (dt / 16);
        return true;
      });

      // draw splashes as small arcs/lines
      ctx.save();
      ctx.translate(0, canvas.clientHeight * 0.5); // position relative to canvas bottom area
      particles.forEach(p => {
        const age = now - p.born;
        const t = age / p.life;
        const alpha = 1 - t;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,255,255,${0.8 * alpha})`;
        ctx.lineWidth = p.r;
        ctx.moveTo(p.x, -p.y);
        ctx.lineTo(p.x - p.vx * 2, -p.y + p.vy * 0.6);
        ctx.stroke();
      });
      ctx.restore();

      animId = requestAnimationFrame(loop);
    }

    if (isRaining) animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isRaining]);

  return (
    <div className={`background-root ${timeOfDay}`} aria-hidden>
      {/* Clouds for day/dawn/dusk */}
      {(timeOfDay === 'day' || timeOfDay === 'dawn' || timeOfDay === 'dusk') && (
        <div className="clouds" aria-hidden>
          <div className="cloud cloud-1" />
          <div className="cloud cloud-2" />
          <div className="cloud cloud-3" />
        </div>
      )}

      {/* Stars for night */}
      {timeOfDay === 'night' && (
        <div className="stars">
          {Array.from({ length: 40 }).map((_, i) => (
            <span
              key={i}
              className="star"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${(i * 61) % 100}%`,
                animationDelay: `${(i % 7) * 0.2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Sun for day/dawn/dusk */}
      {(timeOfDay === 'day' || timeOfDay === 'dawn' || timeOfDay === 'dusk') && (
        <div className={`sun-wrap ${timeOfDay}`}>
          <div className={`sun ${timeOfDay === 'day' ? 'big' : 'small'} floaty`} />
        </div>
      )}

      {/* Moon for night */}
      {timeOfDay === 'night' && <div className="moon floaty" />}

      {/* rain overlay */}
      {isRaining && (
        <>
          <div className="rain" aria-hidden>
            {Array.from({ length: 80 }).map((_, i) => (
              <span
                key={i}
                className="raindrop"
                style={{
                  left: `${(i * 37) % 100}%`,
                  animationDelay: `${(i % 10) * 0.15}s`,
                  animationDuration: `${0.9 + (i % 5) * 0.3}s`,
                  opacity: 0.6 + ((i % 5) * 0.08),
                }}
              />
            ))}
          </div>
          <canvas ref={canvasRef} className="splash-canvas" />
        </>
      )}

      {/* lightning flash for thunder */}
      {isThunder && <div className="lightning" aria-hidden />}

      {/* subtle overlay to add depth */}
      <div className="hero-overlay" />
    </div>
  );
}
