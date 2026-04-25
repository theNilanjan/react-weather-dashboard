import { format } from 'date-fns';

// 'day' shape (WeatherAPI): { date, day: { maxtemp_c, mintemp_c, avgtemp_c, condition: { text, icon } }, astro }
export default function ForecastCard({ day, theme, index = 0 }) {
  if (!day) return null;

  const date = new Date(day.date);
  const dayName = format(date, 'EEE'); // Mon, Tue
  const formatted = format(date, 'MMM d'); // Apr 26
  const { maxtemp_c, mintemp_c, avgtemp_c, condition } = day.day;

  return (
    <div
      className="glass-card p-4 rounded-xl text-center hover:scale-105 transition-transform duration-200 fade-in slide-up stagger"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      <div className="text-sm text-white/80">{dayName}</div>
      <div className="text-xs text-white/70">{formatted}</div>
      <img src={condition.icon} alt={condition.text} className="mx-auto my-2 w-14 h-14 sm:w-16 sm:h-16" />
      <div className="font-semibold">{condition.text}</div>
      <div className="mt-2 flex flex-col sm:flex-row items-center justify-center gap-2 text-sm">
        <div className="px-3 py-1 bg-white/10 rounded-lg">High: {Math.round(maxtemp_c)}°C</div>
        <div className="px-3 py-1 bg-white/10 rounded-lg">Low: {Math.round(mintemp_c)}°C</div>
      </div>
    </div>
  );
}
