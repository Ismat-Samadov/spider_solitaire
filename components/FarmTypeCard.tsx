'use client';

import { Wheat, Trees, Salad, Layers, Leaf } from 'lucide-react';
import clsx from 'clsx';

interface FarmTypeCardProps {
  id: string;
  name_az: string;
  description_az: string;
  selected?: boolean;
  onClick?: () => void;
}

const farmIcons: Record<string, React.ReactNode> = {
  wheat: <Wheat className="w-8 h-8" />,
  livestock: (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 4c-2 0-4 1.5-4 4 0 1 .5 2 1 3l-1 2c-.5 1-1 2-1 3v4h2v-4l2-3h2l2 3v4h2v-4c0-1-.5-2-1-3l-1-2c.5-1 1-2 1-3 0-2.5-2-4-4-4z" />
      <circle cx="9" cy="7" r="1" />
      <circle cx="15" cy="7" r="1" />
    </svg>
  ),
  orchard: <Trees className="w-8 h-8" />,
  vegetable: <Salad className="w-8 h-8" />,
  mixed: <Layers className="w-8 h-8" />,
};

const farmColors: Record<string, string> = {
  wheat: 'from-wheat-400 to-wheat-600',
  livestock: 'from-earth-400 to-earth-600',
  orchard: 'from-leaf-400 to-leaf-600',
  vegetable: 'from-emerald-400 to-emerald-600',
  mixed: 'from-sky-400 to-sky-600',
};

export default function FarmTypeCard({ 
  id, 
  name_az, 
  description_az, 
  selected = false,
  onClick 
}: FarmTypeCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'farm-type-card w-full transition-all duration-300',
        selected && 'selected'
      )}
    >
      <div className={clsx(
        'w-16 h-16 rounded-2xl flex items-center justify-center text-white',
        'bg-gradient-to-br shadow-lg transition-transform',
        farmColors[id] || 'from-gray-400 to-gray-600',
        selected && 'scale-110 shadow-xl'
      )}>
        {farmIcons[id] || <Leaf className="w-8 h-8" />}
      </div>
      
      <div>
        <h3 className="font-semibold text-earth-800 text-lg">{name_az}</h3>
        <p className="text-earth-500 text-sm mt-1">{description_az}</p>
      </div>

      {selected && (
        <div className="absolute top-3 right-3">
          <div className="w-6 h-6 bg-leaf-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}
    </button>
  );
}
