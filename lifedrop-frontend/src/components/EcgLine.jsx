const PATH =
  'M0,50 Q15,36 30,50 L60,50 L66,62 L76,10 L86,74 L94,50 L120,50 Q135,28 150,50 L200,50 ' +
  'Q215,36 230,50 L260,50 L266,62 L276,10 L286,74 L294,50 L320,50 Q335,28 350,50 L400,50 ' +
  'Q415,36 430,50 L460,50 L466,62 L476,10 L486,74 L494,50 L520,50 Q535,28 550,50 L600,50';

/**
 * Animated ECG / heartbeat-monitor line: a dim baseline with a bright pulse
 * sweeping across it, evoking a hospital vital-signs monitor.
 */
export default function EcgLine({ className = '' }) {
  return (
    <svg
      className={`ecg-line ${className}`.trim()}
      viewBox="0 0 600 100"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <path className="ecg-base" d={PATH} />
      <path className="ecg-pulse" d={PATH} />
    </svg>
  );
}
