'use client';

import { useState, useEffect } from 'react';
import { Save, Wheat, Trees, Salad, Beef, MapPin, Check } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { REGIONS, ANIMAL_TYPES, CROP_STAGES } from '@/lib/api';

const FARM_TYPES = [
  { id: 'wheat', name_az: 'Taxıl təsərrüfatı', icon: Wheat, color: 'from-wheat-400 to-wheat-600' },
  { id: 'livestock', name_az: 'Heyvandarlıq', icon: Beef, color: 'from-earth-400 to-earth-600' },
  { id: 'orchard', name_az: 'Meyvə bağı', icon: Trees, color: 'from-leaf-400 to-leaf-600' },
  { id: 'vegetable', name_az: 'Tərəvəzçilik', icon: Salad, color: 'from-emerald-400 to-emerald-600' },
];

const CROPS = {
  wheat: [{ id: 'wheat', name: 'Buğda' }, { id: 'barley', name: 'Arpa' }],
  orchard: [{ id: 'grape', name: 'Üzüm' }, { id: 'pomegranate', name: 'Nar' }, { id: 'apple', name: 'Alma' }, { id: 'fig', name: 'Əncir' }],
  vegetable: [{ id: 'tomato', name: 'Pomidor' }, { id: 'cucumber', name: 'Xiyar' }, { id: 'potato', name: 'Kartof' }, { id: 'pepper', name: 'Bibər' }],
};

export default function FarmPage() {
  const [saved, setSaved] = useState(false);
  const [farmType, setFarmType] = useState('wheat');
  const [region, setRegion] = useState('aran');
  const [farmName, setFarmName] = useState('');
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [selectedAnimals, setSelectedAnimals] = useState<string[]>([]);
  const [area, setArea] = useState('');

  // Load saved profile on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('agriadvisor_farm_profile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setFarmType(profile.farmType || 'wheat');
        setRegion(profile.region || 'aran');
        setFarmName(profile.farmName || '');
        setSelectedCrops(profile.selectedCrops || []);
        setSelectedAnimals(profile.selectedAnimals || []);
        setArea(profile.area || '');
      } catch (error) {
        console.error('Failed to load farm profile:', error);
      }
    }
  }, []);

  const handleSave = () => {
    // In a real app, this would save to a database
    localStorage.setItem('agriadvisor_farm_profile', JSON.stringify({
      farmType,
      region,
      farmName,
      selectedCrops,
      selectedAnimals,
      area,
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleCrop = (cropId: string) => {
    setSelectedCrops(prev => 
      prev.includes(cropId) 
        ? prev.filter(c => c !== cropId) 
        : [...prev, cropId]
    );
  };

  const toggleAnimal = (animalId: string) => {
    setSelectedAnimals(prev => 
      prev.includes(animalId) 
        ? prev.filter(a => a !== animalId) 
        : [...prev, animalId]
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-earth-900 mb-2">
              Ferma Profilim
            </h1>
            <p className="text-earth-600">
              Ferma məlumatlarınızı saxlayın ki, hər dəfə yenidən daxil etməyəsiniz
            </p>
          </div>

          <div className="space-y-6">
            {/* Farm Name */}
            <div className="card p-6">
              <label className="block text-sm font-medium text-earth-700 mb-2">
                Ferma adı
              </label>
              <input
                type="text"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                placeholder="Məs: Şəmkir Taxıl Ferması"
                className="input"
              />
            </div>

            {/* Farm Type */}
            <div className="card p-6">
              <label className="block text-sm font-medium text-earth-700 mb-4">
                Ferma tipi
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {FARM_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFarmType(type.id)}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      farmType === type.id 
                        ? 'border-leaf-500 bg-leaf-50' 
                        : 'border-earth-200 hover:border-earth-300'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center`}>
                      <type.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-earth-700">{type.name_az}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Region */}
            <div className="card p-6">
              <label className="block text-sm font-medium text-earth-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Region
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="select"
              >
                {REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>{r.name_az}</option>
                ))}
              </select>
            </div>

            {/* Area */}
            <div className="card p-6">
              <label className="block text-sm font-medium text-earth-700 mb-2">
                Sahə (hektar)
              </label>
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Məs: 10"
                className="input"
                min="0"
              />
            </div>

            {/* Crops (for non-livestock) */}
            {farmType !== 'livestock' && CROPS[farmType as keyof typeof CROPS] && (
              <div className="card p-6">
                <label className="block text-sm font-medium text-earth-700 mb-4">
                  Yetişdirdiyiniz məhsullar
                </label>
                <div className="flex flex-wrap gap-2">
                  {CROPS[farmType as keyof typeof CROPS].map((crop) => (
                    <button
                      key={crop.id}
                      type="button"
                      onClick={() => toggleCrop(crop.id)}
                      className={`px-4 py-2 rounded-full border-2 transition-all flex items-center gap-2 ${
                        selectedCrops.includes(crop.id)
                          ? 'border-leaf-500 bg-leaf-100 text-leaf-700'
                          : 'border-earth-200 text-earth-600 hover:border-earth-300'
                      }`}
                    >
                      {selectedCrops.includes(crop.id) && <Check className="w-4 h-4" />}
                      {crop.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Animals (for livestock) */}
            {farmType === 'livestock' && (
              <div className="card p-6">
                <label className="block text-sm font-medium text-earth-700 mb-4">
                  Heyvan növləri
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {ANIMAL_TYPES.map((animal) => (
                    <button
                      key={animal.id}
                      type="button"
                      onClick={() => toggleAnimal(animal.id)}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        selectedAnimals.includes(animal.id)
                          ? 'border-leaf-500 bg-leaf-50'
                          : 'border-earth-200 hover:border-earth-300'
                      }`}
                    >
                      <span className="text-3xl">{animal.icon}</span>
                      <span className="text-sm font-medium">{animal.name_az}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                className={`btn-primary flex items-center gap-2 ${saved ? 'bg-leaf-700' : ''}`}
              >
                {saved ? (
                  <>
                    <Check className="w-5 h-5" />
                    Saxlanıldı!
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Saxla
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
