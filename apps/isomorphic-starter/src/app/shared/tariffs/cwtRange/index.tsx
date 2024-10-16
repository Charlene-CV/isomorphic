import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { Tariffs } from '..';

export interface CwtRange {
  uuid: string;
  minRange?: number | null;
  maxRange?: number | null;
  tariff: Tariffs;
}

interface CwtRangeProps {
  tariff: Tariffs;
  cwtRanges: CwtRange[];
  setCwtRanges: React.Dispatch<React.SetStateAction<CwtRange[]>>;
  pcfMultiplier: number;
  setPcfMultiplier: React.Dispatch<React.SetStateAction<number>>;
}

const CwtRangeComponent: React.FC<CwtRangeProps> = ({
  tariff,
  cwtRanges,
  setCwtRanges,
  pcfMultiplier,
  setPcfMultiplier,
}) => {
  const handlePcfMultiplierChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value);
    setPcfMultiplier(isNaN(value) ? 0 : value);
  };

  const handleRangeChange = (
    uuid: string,
    field: 'minRange' | 'maxRange',
    value: string
  ) => {
    const numericValue = value === '' ? null : parseFloat(value);
    setCwtRanges((prevRanges) =>
      prevRanges.map((range) =>
        range.uuid === uuid ? { ...range, [field]: numericValue } : range
      )
    );
  };

  const addRange = () => {
    const newRange: CwtRange = {
      uuid: `new-${Date.now()}`,
      minRange: null,
      maxRange: null,
      tariff: tariff,
    };
    setCwtRanges([...cwtRanges, newRange]);
  };

  const removeRange = (uuid: string) => {
    setCwtRanges(cwtRanges.filter((range) => range.uuid !== uuid));
  };

  // Sort ranges in ascending order by minRange (fallback to maxRange if minRange is null)
  const sortedRanges = [...cwtRanges].sort((a, b) => {
    const minA = a.minRange ?? Number.MAX_SAFE_INTEGER;
    const minB = b.minRange ?? Number.MAX_SAFE_INTEGER;
    return minA - minB;
  });

  return (
    <div className="col-span-full border border-gray-300 rounded-lg p-4">
      {/* CWT Ranges Header */}
      <div className="p-4 rounded-t-lg">
        <h2 className="font-semibold text-lg">CWT Ranges</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4">
        <div className="flex-2">
          <p className="text-sm text-gray-600">
            <b>Set PCF Multiplier</b> PCF Multiplier (Standard is 10)
          </p>
          <input
            type="number"
            value={pcfMultiplier}
            onChange={handlePcfMultiplierChange}
            className="mt-2 w-full border rounded-md p-2"
            min="0"
          />
        </div>

        {/* CWT Range Inputs */}
        <div className="col-span-2 grid grid-cols-2 gap-4 border-b py-2">
          <span className="font-semibold">Min CWT Range</span>
          <span className="font-semibold">Max CWT Range</span>
        </div>

        {sortedRanges.map((range) => (
          <React.Fragment key={range.uuid}>
            <input
              type="number"
              value={range.minRange ?? ''}
              onChange={(e) =>
                handleRangeChange(range.uuid, 'minRange', e.target.value)
              }
              className="border rounded-md p-2"
              placeholder="Min CWT Range"
              min="0"
            />
            <div className="flex items-center">
              <input
                type="number"
                value={range.maxRange ?? ''}
                onChange={(e) =>
                  handleRangeChange(range.uuid, 'maxRange', e.target.value)
                }
                className="border rounded-md p-2 flex-grow"
                placeholder="Max CWT Range"
                min="0"
              />
              <button
                type="button"
                onClick={() => removeRange(range.uuid)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Add additional ranges button */}
      <div className="p-4">
        <button
          type="button"
          onClick={addRange}
          className="text-blue-600 hover:text-blue-800 font-semibold"
        >
          + Add additional ranges
        </button>
      </div>
    </div>
  );
};

export default CwtRangeComponent;
