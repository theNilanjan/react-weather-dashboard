import { WiThermometer, WiHumidity, WiStrongWind } from 'react-icons/wi';

export default function CurrentWeather({ weather, theme }) {
  if (!weather) return null;

  // WeatherAPI response structure: { location: {...}, current: {...} }
  const { location, current } = weather;

  return (
    <section className="glass-card p-6 rounded-xl max-w-3xl mx-auto shadow-lg fade-in slide-up" style={{animationDelay: '180ms'}}>
      <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold header-glow">{location.name}, {location.country}</h2>
          <p className="text-sm text-white/80">{location.localtime}</p>
          <div className="mt-4 text-sm text-white/80">{current.condition.text}</div>
        </div>

        <div className="flex items-center gap-4">
          <img
            src={current.condition.icon}
            alt={current.condition.text}
            className="w-24 h-24 sm:w-28 sm:h-28"
          />
          <div className="text-right">
            <div className="text-4xl sm:text-5xl font-extrabold">{Math.round(current.temp_c)}°C</div>
            <div className="text-sm text-white/80">Feels like {Math.round(current.feelslike_c)}°C</div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
          <WiThermometer size={28} className="text-white/90" />
          <div>
            <div className="text-sm text-white/80">Feels like</div>
            <div className="font-semibold">{Math.round(current.feelslike_c)}°C</div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
          <WiHumidity size={28} className="text-white/90" />
          <div>
            <div className="text-sm text-white/80">Humidity</div>
            <div className="font-semibold">{current.humidity}%</div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg">
          <WiStrongWind size={28} className="text-white/90" />
          <div>
            <div className="text-sm text-white/80">Wind</div>
            <div className="font-semibold">{current.wind_kph} kph</div>
          </div>
        </div>
      </div>
    </section>
  );
}
