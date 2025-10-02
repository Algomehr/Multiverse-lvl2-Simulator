import React from 'react';
import { PhysicalConstant } from '../types';

interface PhysicsSliderProps {
  constant: PhysicalConstant;
  name: string;
  onChange: (id: string, value: number) => void;
}

export const PhysicsSlider: React.FC<PhysicsSliderProps> = ({ constant, name, onChange }) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor={constant.id} className="text-sm font-medium text-indigo-300">
          {name}
        </label>
        <span className="text-sm font-semibold text-white bg-indigo-500/50 rounded-md px-2 py-0.5">
          {constant.value.toFixed(2)}x
        </span>
      </div>
      <input
        id={constant.id}
        type="range"
        min={constant.min}
        max={constant.max}
        step={constant.step}
        value={constant.value}
        onChange={(e) => onChange(constant.id, parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-indigo-500"
      />
    </div>
  );
};