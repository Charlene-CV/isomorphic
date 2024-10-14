import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';

const CwtRangeComponent = () => {
  const [pcfMultiplier, setPcfMultiplier] = useState<string>('10');
  const [ranges, setRanges] = useState<{ min: string; max: string }[]>([
    { min: '10000', max: '48000' },
  ]);

  const handlePcfMultiplierChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPcfMultiplier(e.target.value);
  };

  const handleRangeChange = (
    index: number,
    field: 'min' | 'max',
    value: string
  ) => {
    const newRanges = [...ranges];
    newRanges[index][field] = value;
    setRanges(newRanges);
  };

  const addRange = () => {
    setRanges([...ranges, { min: '', max: '' }]);
  };

  const removeRange = (index: number) => {
    const newRanges = ranges.filter((_, i) => i !== index);
    setRanges(newRanges);
  };

  return (
    <div className="col-span-full border border-gray-300 rounded-lg p-4">
      {/* CWT Ranges Header */}
      <div className="p-4 rounded-t-lg">
        <h2 className="font-semibold text-lg">CWT Ranges</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4">
        <p className="text-sm text-gray-600">
          <b>Set PCF Multiplier</b> PCF Multiplier (Standard is 10)
        </p>
        <input
          type="number"
          value={pcfMultiplier}
          onChange={handlePcfMultiplierChange}
          className="mt-2 w-full border rounded-md p-2"
        />

        {/* CWT Range Inputs */}
        <div className="col-span-2 grid grid-cols-2 gap-4 border-b py-2">
          <span className="font-semibold">Min CWT Range</span>
          <span className="font-semibold">Max CWT Range</span>
        </div>
        {ranges.map((range, index) => (
          <React.Fragment key={index}>
            <input
              type="number"
              value={range.min}
              onChange={(e) => handleRangeChange(index, 'min', e.target.value)}
              className="border rounded-md p-2"
              placeholder="Min CWT Range"
            />
            <div className="flex items-center">
              <input
                type="number"
                value={range.max}
                onChange={(e) =>
                  handleRangeChange(index, 'max', e.target.value)
                }
                className="border rounded-md p-2 flex-grow"
                placeholder="Max CWT Range"
              />
              <button
                onClick={() => removeRange(index)}
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
