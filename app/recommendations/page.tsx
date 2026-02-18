'use client';

import { useState, useEffect } from 'react';
import { Loader2, AlertTriangle, CheckCircle, RefreshCw, MapPin, Globe, Edit3, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FarmTypeCard from '@/components/FarmTypeCard';
import WeatherInput from '@/components/WeatherInput';
import RecommendationCard from '@/components/RecommendationCard';
import DailySchedule from '@/components/DailySchedule';
import {
  getRecommendations,
  autoFetchWeather,
  REGIONS,
  CROP_STAGES,
  ANIMAL_TYPES,
  type WeatherData,
  type SoilData,
  type CropContext,
  type LivestockContext,
  type RecommendationRequest,
  type RecommendationResponse
} from '@/lib/api';

const FARM_TYPES = [
  { id: 'wheat', name_az: 'Taxıl təsərrüfatı', description_az: 'Buğda, arpa' },
  { id: 'livestock', name_az: 'Heyvandarlıq', description_az: 'Mal-qara, qoyun' },
  { id: 'orchard', name_az: 'Meyvə bağı', description_az: 'Üzüm, nar, alma' },
  { id: 'vegetable', name_az: 'Tərəvəzçilik', description_az: 'Pomidor, xiyar' },
  { id: 'mixed', name_az: 'Qarışıq', description_az: 'Bitkiçilik + heyvandarlıq' },
];

const CROP_TYPES: Record<string, { id: string; name_az: string }[]> = {
  wheat: [{ id: 'wheat', name_az: 'Buğda' }, { id: 'barley', name_az: 'Arpa' }],
  orchard: [{ id: 'grape', name_az: 'Üzüm' }, { id: 'pomegranate', name_az: 'Nar' }, { id: 'apple', name_az: 'Alma' }],
  vegetable: [{ id: 'tomato', name_az: 'Pomidor' }, { id: 'cucumber', name_az: 'Xiyar' }, { id: 'potato', name_az: 'Kartof' }],
};

export default function RecommendationsPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [farmType, setFarmType] = useState('');
  const [region, setRegion] = useState('aran');
  const [weather, setWeather] = useState<WeatherData>({ temperature: 25, humidity: 60, rainfall_last_24h: 0, rainfall_last_7days: 0, rainfall_forecast_48h: false, rainfall_forecast_amount_mm: 0, wind_speed: 10, frost_warning: false });
  const [soil, setSoil] = useState<SoilData>({ soil_moisture: 50 });
  const [cropContext, setCropContext] = useState<CropContext>({ crop_type: '', stage: '', days_since_irrigation: 0, days_since_fertilization: 0, growing_type: 'open_field' });
  const [livestockContext, setLivestockContext] = useState<LivestockContext>({ animal_type: 'cattle', count: 10, barn_hygiene_score: 7, days_since_vet_check: 30, vaccination_status: 'current', days_since_deworming: 60, ventilation_quality: 'good', water_availability: 'adequate' });

  // Auto-fetch weather states
  const [autoMode, setAutoMode] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState<string>('');
  const [weatherError, setWeatherError] = useState<string>('');
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Load saved farm profile on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('agriadvisor_farm_profile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        if (profile.farmType) setFarmType(profile.farmType);
        if (profile.region) setRegion(profile.region);

        // Pre-fill crop/animal selections if available
        if (profile.selectedCrops && profile.selectedCrops.length > 0) {
          setCropContext({ ...cropContext, crop_type: profile.selectedCrops[0] });
        }
        if (profile.selectedAnimals && profile.selectedAnimals.length > 0) {
          setLivestockContext({ ...livestockContext, animal_type: profile.selectedAnimals[0] as any });
        }

        setProfileLoaded(true);
      } catch (error) {
        console.error('Failed to load farm profile:', error);
      }
    }
  }, []);

  // Auto-fetch weather on step 2
  useEffect(() => {
    if (step === 2 && autoMode && !detectedLocation) {
      handleAutoFetchWeather();
    }
  }, [step, autoMode]);

  const handleAutoFetchWeather = async () => {
    setWeatherLoading(true);
    setWeatherError('');
    try {
      const result = await autoFetchWeather();

      // Update weather data
      setWeather({
        temperature: result.temperature,
        humidity: result.humidity,
        rainfall_last_24h: result.rainfall_last_24h,
        rainfall_last_7days: 0,
        rainfall_forecast_48h: false,
        rainfall_forecast_amount_mm: 0,
        wind_speed: result.wind_speed,
        frost_warning: result.frost_warning,
      });

      // Update region based on detected location (backend provides mapped region)
      setRegion(result.region);

      // Store detected location for display
      const locationDisplay = result.fallback
        ? `${result.location.city}, ${result.location.country} (VPN/proxy aşkarlandı, Bakı istifadə edilir)`
        : `${result.location.city}, ${result.location.country}`;
      setDetectedLocation(locationDisplay);

    } catch (err) {
      console.error('Auto-fetch failed:', err);
      setWeatherError('Avtomatik hava məlumatı alına bilmədi. Zəhmət olmasa əl ilə daxil edin.');
      setAutoMode(false); // Fallback to manual mode
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // Validate crop fields
      if (['wheat', 'orchard', 'vegetable'].includes(farmType)) {
        if (!cropContext.crop_type || !cropContext.stage) {
          setError('Bitki növü və inkişaf mərhələsini seçin');
          setLoading(false);
          return;
        }
      }

      const request: RecommendationRequest = {
        farm_type: farmType,
        region: region,
        weather: weather,
        soil: farmType !== 'livestock' ? soil : undefined,
        crop_context: ['wheat', 'orchard', 'vegetable'].includes(farmType) ? cropContext : undefined,
        livestock_context: farmType === 'livestock' ? livestockContext : undefined,
      };

      const response = await getRecommendations(request);
      setResult(response);
      setStep(4);
    } catch (err) {
      console.error('API Error:', err);
      setError(err instanceof Error ? err.message : 'Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => { setStep(1); setResult(null); setError(null); };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className={`flex items-center ${s < 4 ? 'flex-1' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${step >= s ? 'bg-leaf-600 text-white' : 'bg-earth-200 text-earth-500'}`}>
                    {s === 4 && result ? <CheckCircle className="w-5 h-5" /> : s}
                  </div>
                  {s < 4 && <div className={`flex-1 h-1 mx-2 rounded ${step > s ? 'bg-leaf-500' : 'bg-earth-200'}`} />}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-earth-500">
              <span>Ferma</span><span>Hava</span><span>Detallar</span><span>Nəticə</span>
            </div>
          </div>

          {/* Step 1: Farm Type */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h1 className="text-3xl font-display font-bold text-earth-900 mb-2">Ferma Tipinizi Seçin</h1>
              <p className="text-earth-600 mb-4">Tövsiyələr ferma tipinizə görə fərdiləşdiriləcək</p>

              {/* Profile loaded indicator */}
              {profileLoaded && (
                <div className="card p-4 mb-6 bg-gradient-to-r from-leaf-50 to-emerald-50 border-2 border-leaf-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-leaf-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-earth-800 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-leaf-600" />
                        Ferma profiliniz yükləndi
                      </p>
                      <p className="text-sm text-earth-600 mt-0.5">
                        Saxlanılmış məlumatlar avtomatik dolduruldu
                      </p>
                    </div>
                    <Link
                      href="/farm"
                      className="px-3 py-1.5 text-sm bg-white border border-leaf-300 text-leaf-700 rounded-lg hover:bg-leaf-50 transition-colors"
                    >
                      Dəyişdir
                    </Link>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {FARM_TYPES.map((type) => (
                  <FarmTypeCard key={type.id} {...type} selected={farmType === type.id} onClick={() => setFarmType(type.id)} />
                ))}
              </div>
              <div className="mt-8 flex justify-end">
                <button type="button" onClick={() => setStep(2)} disabled={!farmType} className="btn-primary disabled:opacity-50">Davam et</button>
              </div>
            </div>
          )}

          {/* Step 2: Weather */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-display font-bold text-earth-900">Hava Şəraitini Daxil Edin</h1>
                <button
                  type="button"
                  onClick={() => {
                    setAutoMode(!autoMode);
                    if (!autoMode && !detectedLocation) {
                      handleAutoFetchWeather();
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all text-sm font-medium ${
                    autoMode
                      ? 'border-leaf-500 bg-leaf-50 text-leaf-700'
                      : 'border-earth-200 bg-white text-earth-600 hover:border-earth-300'
                  }`}
                  disabled={weatherLoading}
                >
                  {autoMode ? <Globe className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                  {autoMode ? 'Avtomatik' : 'Əl ilə'}
                </button>
              </div>
              <p className="text-earth-600 mb-6">
                {autoMode ? 'IP ünvanınıza əsasən avtomatik hava məlumatı' : 'Cari hava məlumatlarını əl ilə daxil edin'}
              </p>

              {/* Auto-fetch status */}
              {autoMode && weatherLoading && (
                <div className="card p-6 mb-6 bg-leaf-50 border-2 border-leaf-200">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-leaf-600 animate-spin" />
                    <div>
                      <p className="font-medium text-earth-800">Yerləşməniz müəyyən edilir...</p>
                      <p className="text-sm text-earth-600 mt-1">IP əsaslı hava məlumatı alınır</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Location detected */}
              {autoMode && detectedLocation && !weatherLoading && (
                <div className="card p-4 mb-6 bg-gradient-to-r from-leaf-50 to-sky-50 border-2 border-leaf-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-leaf-500 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-earth-800 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-leaf-600" />
                        Yerləşməniz müəyyən edildi
                      </p>
                      <p className="text-sm text-earth-600 mt-0.5">{detectedLocation}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAutoFetchWeather}
                      className="px-3 py-1.5 text-sm bg-white border border-leaf-300 text-leaf-700 rounded-lg hover:bg-leaf-50 transition-colors"
                    >
                      Yenilə
                    </button>
                  </div>
                </div>
              )}

              {/* Error fallback */}
              {weatherError && (
                <div className="alert-warning mb-6 flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5" />
                  <div className="flex-1">
                    <p className="font-medium">Avtomatik rejim uğursuz oldu</p>
                    <p className="text-sm mt-1">{weatherError}</p>
                  </div>
                </div>
              )}

              <div className="card p-6 mb-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-earth-700 mb-2">
                    Region {autoMode && detectedLocation && <span className="text-xs text-leaf-600">(avtomatik seçildi)</span>}
                  </label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="select"
                    disabled={autoMode && weatherLoading}
                  >
                    {REGIONS.map((r) => <option key={r.id} value={r.id}>{r.name_az}</option>)}
                  </select>
                </div>
                <WeatherInput
                  value={weather}
                  onChange={setWeather}
                  disabled={autoMode && weatherLoading}
                />
                {farmType !== 'livestock' && (
                  <div className="mt-6 pt-6 border-t border-earth-200">
                    <label className="block text-sm font-medium text-earth-700 mb-2">Torpaq nəmliyi (%)</label>
                    <input type="number" value={soil.soil_moisture} onChange={(e) => setSoil({ ...soil, soil_moisture: parseFloat(e.target.value) || 0 })} className="input" min="0" max="100" />
                    <input type="range" value={soil.soil_moisture} onChange={(e) => setSoil({ ...soil, soil_moisture: parseFloat(e.target.value) })} className="w-full mt-2 accent-earth-600" min="0" max="100" />
                  </div>
                )}
              </div>
              <div className="flex justify-between">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary">Geri</button>
                <button type="button" onClick={() => setStep(3)} className="btn-primary" disabled={weatherLoading}>
                  {weatherLoading ? 'Gözləyin...' : 'Davam et'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h1 className="text-3xl font-display font-bold text-earth-900 mb-2">Əlavə Məlumatlar</h1>
              <p className="text-earth-600 mb-8">Daha dəqiq tövsiyələr üçün</p>
              <div className="card p-6 mb-6">
                {['wheat', 'orchard', 'vegetable'].includes(farmType) && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-2">Bitki növü</label>
                      <select value={cropContext.crop_type} onChange={(e) => setCropContext({ ...cropContext, crop_type: e.target.value, stage: '' })} className="select">
                        <option value="">Seçin...</option>
                        {CROP_TYPES[farmType]?.map((c) => <option key={c.id} value={c.id}>{c.name_az}</option>)}
                      </select>
                    </div>
                    {cropContext.crop_type && CROP_STAGES[cropContext.crop_type] && (
                      <div>
                        <label className="block text-sm font-medium text-earth-700 mb-2">İnkişaf mərhələsi</label>
                        <select value={cropContext.stage} onChange={(e) => setCropContext({ ...cropContext, stage: e.target.value })} className="select">
                          <option value="">Seçin...</option>
                          {CROP_STAGES[cropContext.crop_type].map((s) => <option key={s.id} value={s.id}>{s.name_az}</option>)}
                        </select>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-earth-700 mb-2">Son suvarma (gün)</label>
                        <input type="number" value={cropContext.days_since_irrigation} onChange={(e) => setCropContext({ ...cropContext, days_since_irrigation: parseInt(e.target.value) || 0 })} className="input" min="0" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-earth-700 mb-2">Son gübrələmə (gün)</label>
                        <input type="number" value={cropContext.days_since_fertilization} onChange={(e) => setCropContext({ ...cropContext, days_since_fertilization: parseInt(e.target.value) || 0 })} className="input" min="0" />
                      </div>
                    </div>
                  </div>
                )}
                {farmType === 'livestock' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-earth-700 mb-2">Heyvan növü</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {ANIMAL_TYPES.map((animal) => (
                          <button key={animal.id} type="button" onClick={() => setLivestockContext({ ...livestockContext, animal_type: animal.id as any })}
                            className={`p-3 rounded-xl border-2 transition-all ${livestockContext.animal_type === animal.id ? 'border-leaf-500 bg-leaf-50' : 'border-earth-200 hover:border-earth-300'}`}>
                            <div className="text-2xl mb-1">{animal.icon}</div>
                            <div className="text-sm font-medium">{animal.name_az}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-earth-700 mb-2">Heyvan sayı</label>
                        <input type="number" value={livestockContext.count} onChange={(e) => setLivestockContext({ ...livestockContext, count: parseInt(e.target.value) || 1 })} className="input" min="1" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-earth-700 mb-2">Gigiyena skoru (1-10)</label>
                        <input type="number" value={livestockContext.barn_hygiene_score} onChange={(e) => setLivestockContext({ ...livestockContext, barn_hygiene_score: parseInt(e.target.value) || 5 })} className="input" min="1" max="10" />
                      </div>
                    </div>
                  </div>
                )}
                {farmType === 'mixed' && (
                  <div className="text-center py-8 text-earth-500">
                    <p>Qarışıq təsərrüfat üçün əsas hava məlumatları kifayətdir.</p>
                  </div>
                )}
              </div>
              {error && <div className="alert-critical mb-6 flex items-center gap-3"><AlertTriangle className="w-5 h-5 text-danger-600" /><span>{error}</span></div>}
              <div className="flex justify-between">
                <button type="button" onClick={() => setStep(2)} className="btn-secondary">Geri</button>
                <button type="button" onClick={handleSubmit} disabled={loading} className="btn-primary flex items-center gap-2">
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Yüklənir...</> : 'Tövsiyə Al'}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Results */}
          {step === 4 && result && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-display font-bold text-earth-900 mb-2">Tövsiyələriniz Hazırdır</h1>
                  <p className="text-earth-600">{result.generated_at && new Date(result.generated_at).toLocaleString('az-AZ')}</p>
                </div>
                <button type="button" onClick={resetForm} className="btn-secondary flex items-center gap-2"><RefreshCw className="w-4 h-4" />Yenidən</button>
              </div>

              <div className={`card p-6 mb-6 ${result.critical_alerts.length > 0 ? 'bg-danger-50 border-danger-200' : 'bg-leaf-50 border-leaf-200'}`}>
                <p className="text-lg font-medium">{result.summary_az}</p>
                <p className="text-sm text-earth-600 mt-2">Ümumi {result.total_recommendations} tövsiyə</p>
              </div>

              {result.daily_schedule.length > 0 && <div className="mb-8"><DailySchedule schedule={result.daily_schedule} /></div>}

              {result.critical_alerts.length > 0 && (
                <div className="mb-8">
                  <h2 className="section-title"><span className="w-8 h-8 bg-danger-100 rounded-lg flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-danger-600" /></span>Kritik Xəbərdarlıqlar</h2>
                  <div className="space-y-4">{result.critical_alerts.map((rec) => <RecommendationCard key={rec.rule_id} recommendation={rec} />)}</div>
                </div>
              )}

              {result.high_priority.length > 0 && (
                <div className="mb-8">
                  <h2 className="section-title"><span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center"><span className="w-3 h-3 bg-orange-500 rounded-full" /></span>Yüksək Prioritet</h2>
                  <div className="space-y-4">{result.high_priority.map((rec) => <RecommendationCard key={rec.rule_id} recommendation={rec} />)}</div>
                </div>
              )}

              {result.medium_priority.length > 0 && (
                <div className="mb-8">
                  <h2 className="section-title"><span className="w-8 h-8 bg-wheat-100 rounded-lg flex items-center justify-center"><span className="w-3 h-3 bg-wheat-500 rounded-full" /></span>Orta Prioritet</h2>
                  <div className="space-y-4">{result.medium_priority.map((rec) => <RecommendationCard key={rec.rule_id} recommendation={rec} />)}</div>
                </div>
              )}

              {(result.low_priority.length > 0 || result.info.length > 0) && (
                <div className="mb-8">
                  <h2 className="section-title"><span className="w-8 h-8 bg-leaf-100 rounded-lg flex items-center justify-center"><span className="w-3 h-3 bg-leaf-500 rounded-full" /></span>Əlavə Məlumatlar</h2>
                  <div className="space-y-4">{[...result.low_priority, ...result.info].map((rec) => <RecommendationCard key={rec.rule_id} recommendation={rec} />)}</div>
                </div>
              )}

              {result.total_recommendations === 0 && (
                <div className="card p-12 text-center">
                  <div className="w-20 h-20 bg-leaf-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="w-10 h-10 text-leaf-600" /></div>
                  <h3 className="text-2xl font-display font-semibold text-earth-800 mb-2">Hər şey qaydasındadır!</h3>
                  <p className="text-earth-600">Hazırda heç bir xüsusi tövsiyə yoxdur.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
