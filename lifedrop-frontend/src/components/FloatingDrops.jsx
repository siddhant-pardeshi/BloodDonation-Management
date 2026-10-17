const DROPS = [
  { left: '6%', size: 14, delay: -1.0, duration: 7.5, opacity: 0.5 },
  { left: '16%', size: 9, delay: -4.2, duration: 9.0, opacity: 0.35 },
  { left: '27%', size: 12, delay: -2.6, duration: 8.0, opacity: 0.45 },
  { left: '38%', size: 8, delay: -6.1, duration: 10.0, opacity: 0.3 },
  { left: '52%', size: 15, delay: -3.4, duration: 7.0, opacity: 0.5 },
  { left: '63%', size: 10, delay: -0.4, duration: 8.6, opacity: 0.4 },
  { left: '74%', size: 13, delay: -5.3, duration: 7.8, opacity: 0.45 },
  { left: '85%', size: 9, delay: -2.0, duration: 9.4, opacity: 0.35 },
  { left: '94%', size: 11, delay: -7.0, duration: 8.2, opacity: 0.4 },
];

/**
 * Decorative blood drops gently falling behind the hero content.
 */
export default function FloatingDrops() {
  return (
    <div className="hero-drops" aria-hidden="true">
      {DROPS.map((drop, index) => (
        <span
          key={index}
          className="hero-drop"
          style={{
            left: drop.left,
            width: `${drop.size}px`,
            height: `${drop.size * 1.45}px`,
            opacity: drop.opacity,
            animationDelay: `${drop.delay}s`,
            animationDuration: `${drop.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
