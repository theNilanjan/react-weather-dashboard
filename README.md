# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## Project: Weather Dashboard

This project is a modern Weather Dashboard built with React, Vite and Tailwind CSS. It uses WeatherAPI.com's free tier for weather and forecast data.

Features
- City search (uses WeatherAPI search endpoint)
- Current weather + 7-day forecast
- Geolocation default (uses browser location)
- Animated background: sun, moon, stars, clouds
- Dark mode, responsive design, animated cards

Quick start

1. Install dependencies

```bash
npm install
```

2. Run dev server

```bash
npm run dev
```

3. Open http://localhost:5173

Debugging tips
- If the app shows "Invalid API Key", open `src/pages/Home.jsx` and set `API_KEY` to your WeatherAPI key.
- If geolocation doesn't work: make sure you allow location in the browser and click "Use my location" if needed.
- Check browser console (F12) for network or error messages.

Mobile
- The layout is responsive; search bar and cards adapt to smaller screens.

Next improvements
- Add autocomplete suggestions while typing
- Add unit toggle (Celsius/Fahrenheit)
- Add persistent favorites and localStorage saves

Notes
- This project uses WeatherAPI.com free tier; replace with OpenWeather if you prefer (update endpoints and params accordingly).

