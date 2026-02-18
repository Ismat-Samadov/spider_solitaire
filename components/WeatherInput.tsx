'use client';

import { Thermometer, Droplets, CloudRain, Wind } from 'lucide-react';
import type { WeatherData } from '@/lib/api';

interface WeatherInputProps {
  value: WeatherData;
  onChange: (weather: WeatherData) => void;
  disabled?: boolean;
}

export default function WeatherInput({ value, onChange, disabled = false }: WeatherInputProps) {
  const handleChange = (field: keyof WeatherData, newValue: number | boolean) => {
    onChange({ ...value, [field]: newValue });
  };

  return (
    <div className="space-y-4">
      <h3 className="section-title text-lg">
        <span className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
          <CloudRain className="w-5 h-5 text-sky-600" />
        </span>
        Hava Şəraiti
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Temperature */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-earth-700">
            <Thermometer className="w-4 h-4 text-danger-500" />
            Temperatur (°C)
          </label>
          <input
            type="number"
            value={value.temperature}
            onChange={(e) => handleChange('temperature', parseFloat(e.target.value) || 0)}
            className="input"
            min="-20"
            max="50"
            disabled={disabled}
          />
          <input
            type="range"
            value={value.temperature}
            onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
            className="w-full accent-danger-500"
            min="-10"
            max="45"
            disabled={disabled}
          />
        </div>

        {/* Humidity */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-earth-700">
            <Droplets className="w-4 h-4 text-sky-500" />
            Rütubət (%)
          </label>
          <input
            type="number"
            value={value.humidity}
            onChange={(e) => handleChange('humidity', parseFloat(e.target.value) || 0)}
            className="input"
            min="0"
            max="100"
            disabled={disabled}
          />
          <input
            type="range"
            value={value.humidity}
            onChange={(e) => handleChange('humidity', parseFloat(e.target.value))}
            className="w-full accent-sky-500"
            min="0"
            max="100"
            disabled={disabled}
          />
        </div>

        {/* Rainfall last 24h */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-earth-700">
            <CloudRain className="w-4 h-4 text-sky-600" />
            Son 24 saat yağış (mm)
          </label>
          <input
            type="number"
            value={value.rainfall_last_24h || 0}
            onChange={(e) => handleChange('rainfall_last_24h', parseFloat(e.target.value) || 0)}
            className="input"
            min="0"
            max="100"
            disabled={disabled}
          />
        </div>

        {/* Wind speed */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-earth-700">
            <Wind className="w-4 h-4 text-earth-500" />
            Külək (km/saat)
          </label>
          <input
            type="number"
            value={value.wind_speed || 0}
            onChange={(e) => handleChange('wind_speed', parseFloat(e.target.value) || 0)}
            className="input"
            min="0"
            max="100"
            disabled={disabled}
          />
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex flex-wrap gap-4 pt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={value.rainfall_forecast_48h || false}
            onChange={(e) => handleChange('rainfall_forecast_48h', e.target.checked)}
            className="w-5 h-5 rounded border-earth-300 text-leaf-600 focus:ring-leaf-500"
            disabled={disabled}
          />
          <span className="text-sm text-earth-700">48 saatda yağış gözlənilir</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={value.frost_warning || false}
            onChange={(e) => handleChange('frost_warning', e.target.checked)}
            className="w-5 h-5 rounded border-earth-300 text-sky-600 focus:ring-sky-500"
            disabled={disabled}
          />
          <span className="text-sm text-earth-700">Şaxta xəbərdarlığı</span>
        </label>
      </div>
    </div>
  );
}
