export default function SignalDivider() {
  return (
    <div className="relative h-px w-full bg-line" aria-hidden="true">
      <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal animate-pulse-signal" />
    </div>
  );
}
