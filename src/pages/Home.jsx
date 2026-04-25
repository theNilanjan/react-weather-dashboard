import { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import CurrentWeather from '../components/CurrentWeather';
import ForecastCard from '../components/ForecastCard';
import Background from '../components/Background';
import ThemeToggle from '../components/ThemeToggle';
import Loader from '../components/Loader';

// 🔑 Using WeatherAPI.com (better CORS support, free tier)
// Get free API key: https://www.weatherapi.com/
// Just sign up and get your key from dashboard
const API_KEY = '69730666c92447be99c190134262504'; // Your WeatherAPI key here (no trailing spaces)
const WEATHER_API_URL = 'https://api.weatherapi.com/v1/current.json';
const FORECAST_API_URL = 'https://api.weatherapi.com/v1/forecast.json';
const SEARCH_API_URL = 'https://api.weatherapi.com/v1/search.json';
const DEFAULT_CITY = 'London';

export default function Home({ theme, toggleTheme }) {
  const [city, setCity] = useState(''); // start empty; set after geolocation or fallback
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [geoSupported, setGeoSupported] = useState(true);
  const [geoStatus, setGeoStatus] = useState('unknown'); // 'unknown'|'granted'|'denied'|'prompt'
  const [geoChecked, setGeoChecked] = useState(false);

  // On mount: try to detect user location via browser geolocation
  useEffect(() => {
    // On mount try to get geolocation; only set city when we have a result or fallback
    if ('geolocation' in navigator) {
      setGeoSupported(true);
      // Try to check permission (may not be supported in all browsers)
      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions.query({ name: 'geolocation' }).then((perm) => {
          setGeoStatus(perm.state);
        }).catch(() => setGeoStatus('prompt'));
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const coordString = `${latitude},${longitude}`;
          console.log('Detected coords:', coordString);
          setCity(coordString); // triggers fetchWeather via other effect
          setGeoStatus('granted');
          setGeoChecked(true);
        },
        (err) => {
          console.warn('Geolocation failed or denied:', err.message);
          setGeoStatus(err.code === 1 ? 'denied' : 'prompt');
          // fallback to default city when geolocation denied/failed
          setCity(DEFAULT_CITY);
          setGeoChecked(true);
        },
        { timeout: 8000 }
      );
    } else {
      setGeoSupported(false);
      // no geolocation support — use fallback
      setCity(DEFAULT_CITY);
      setGeoChecked(true);
    }
  }, []);

  // 🎯 useEffect: Runs when component mounts or when 'city' changes
  // Think of it as: "After this component appears, do this..."
  useEffect(() => {
    if (!city) return;
    fetchWeather(city);
  }, [city]); // re-run when 'city' changes

  // Function to fetch current weather
  const fetchWeather = async (cityName) => {
    try {
      setLoading(true);
      setError(null);

      // Resolve ambiguous place names using WeatherAPI search endpoint
      let query = cityName;

      // If cityName looks like coordinates "lat,lon", use it directly
      const coordRe = /^\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*$/;
      if (!coordRe.test(cityName)) {
        try {
          const searchRes = await axios.get(SEARCH_API_URL, {
            params: { key: API_KEY, q: cityName },
          });
          if (Array.isArray(searchRes.data) && searchRes.data.length > 0) {
            // Use the best match's lat/lon
            const best = searchRes.data[0];
            if (best?.lat && best?.lon) {
              query = `${best.lat},${best.lon}`;
            } else if (best?.name) {
              query = `${best.name}${best.region ? ', ' + best.region : ''}${best.country ? ', ' + best.country : ''}`;
            }
            console.log('Resolved search:', searchRes.data[0]);
          } else {
            console.log('No search matches, using raw query');
          }
        } catch (searchErr) {
          console.warn('Search endpoint failed, using raw query:', searchErr?.message || searchErr);
        }
      }

      // 🌐 API Call: Get current weather + forecast (WeatherAPI.com)
      const response = await axios.get(WEATHER_API_URL, {
        params: {
          key: API_KEY, // WeatherAPI uses 'key' not 'appid'
          q: query, // city name or lat,lon
          aqi: 'yes',
        },
      });

      // Save current weather (WeatherAPI format)
      setWeather(response.data);
      console.log('✅ Weather data received:', response.data);

      // Determine time of day from response (use localtime if available)
      try {
        const localtime = response.data.location?.localtime; // e.g. "2026-04-26 14:30"
        const isDay = response.data.current?.is_day; // 1 or 0
        let tod = 'day';
        if (localtime) {
          const hour = parseInt(localtime.split(' ')[1].split(':')[0], 10);
          if (hour >= 5 && hour < 8) tod = 'dawn';
          else if (hour >= 8 && hour < 18) tod = 'day';
          else if (hour >= 18 && hour < 20) tod = 'dusk';
          else tod = 'night';
        } else if (typeof isDay !== 'undefined') {
          tod = isDay ? 'day' : 'night';
        }
        setTimeOfDay(tod);
      } catch (e) {
        console.warn('Could not determine time of day', e);
      }

      // 🌐 API Call 2: Get forecast
      const forecastResponse = await axios.get(FORECAST_API_URL, {
        params: {
          key: API_KEY,
          q: query,
          days: 7,                // Get 7-day forecast
          aqi: 'yes',
        },
      });

      // Process forecast data (WeatherAPI structure: forecast.forecastday)
      if (forecastResponse.data?.forecast?.forecastday) {
        setForecast(forecastResponse.data.forecast.forecastday);
        console.log('✅ Forecast data received:', forecastResponse.data.forecast.forecastday);
      }

      setLoading(false);

    } catch (err) {
      // Handle errors with detailed logging
      console.error('❌ FULL ERROR:', err);
      console.error('Status Code:', err.response?.status);
      console.error('Error Message:', err.response?.data?.error?.message);
      console.error('Error Details:', err.message);
      
      if (err.response?.status === 400) {
        setError('❌ Invalid city name. Please try again.');
      } else if (err.response?.status === 401) {
        setError('❌ Invalid API Key. Check your WeatherAPI key.');
      } else if (err.response?.status === 403) {
        setError('❌ API Key not allowed. Check your subscription.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('❌ Network error. Check your internet connection.');
      } else {
        setError(`❌ Failed to fetch weather: ${err.response?.status || 'Unknown error'}`);
      }
      
      setLoading(false);
    }
  };

  // Helper to request location on user action (retry)
  const requestLocation = () => {
    if (!('geolocation' in navigator)) {
      setGeoSupported(false);
      setGeoStatus('denied');
      return;
    }

    setGeoChecked(false);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const coordString = `${latitude},${longitude}`;
        console.log('User requested coords:', coordString);
        setCity(coordString);
        setGeoStatus('granted');
        setGeoChecked(true);
      },
      (err) => {
        console.warn('User location denied or failed:', err.message);
        setGeoStatus(err.code === 1 ? 'denied' : 'prompt');
        setGeoChecked(true);
      },
      { timeout: 8000 }
    );
  };

  // Choose background by time of day (overridden by dark theme)
  const dayBg = timeOfDay === 'day' ? 'from-blue-400 to-yellow-300' :
                timeOfDay === 'dawn' ? 'from-purple-600 via-pink-500 to-orange-400' :
                timeOfDay === 'dusk' ? 'from-orange-400 via-pink-600 to-indigo-800' :
                'from-indigo-900 to-gray-900';

  return (
    <div className={`relative overflow-hidden min-h-screen transition-colors duration-500 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 to-black text-white'
        : `bg-gradient-to-br ${dayBg} text-${timeOfDay === 'night' ? 'white' : 'gray-900'}`
    }`}>
      <Background timeOfDay={timeOfDay} />
      {/* Header with Theme Toggle */}
      <header className="flex justify-between items-center p-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold">⛅ Weather Dashboard</h1>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Search Bar */}
          <SearchBar onSearch={setCity} />

          {/* Geolocation status and retry */}
          {!geoChecked && (
            <div className="text-sm mb-4 text-white/80">Detecting your location…</div>
          )}

          {geoChecked && geoStatus !== 'granted' && (
            <div className="mb-4">
              <div className="text-sm text-white/90 mb-2">
                {geoStatus === 'denied'
                  ? 'Location access denied. Enable location in your browser to use your current location as default.'
                  : 'Click the button to allow using your device location for default weather.'}
              </div>
              <button
                onClick={requestLocation}
                className="px-4 py-2 bg-white/40 hover:bg-white/60 text-white rounded-md mr-2"
              >
                Use my location
              </button>
            </div>
          )}

        {/* Loading State - Show spinner while fetching */}
        {loading && <Loader />}

        {/* Error State - Show error message if something went wrong */}
        {error && !loading && (
          <div className="bg-red-500/80 text-white p-4 rounded-lg mb-6 backdrop-blur-md">
            {error}
          </div>
        )}

        {/* Current Weather - Show only if we have data and not loading */}
        {weather && !loading && <CurrentWeather weather={weather} theme={theme} />}

        {/* 7-Day Forecast */}
        {forecast.length > 0 && !loading && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">📅 7-Day Forecast</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
              {forecast.map((day, index) => (
                  <ForecastCard key={index} day={day} theme={theme} index={index} />
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
