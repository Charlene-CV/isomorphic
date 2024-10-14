import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';

const CwtLanesComponent = () => {
  const [lanes, setLanes] = useState([
    {
      origin: 'GUELPH, ON',
      destination: 'MISSISSAUGA, ON',
      minCost: '$42.51',
      priceRanges: [
        { range: '0-499 cwt', price: '$8.98' },
        { range: '500-999 cwt', price: '$7.31' },
        { range: '1000-1999 cwt', price: '$5.67' },
        { range: '2000-4999 cwt', price: '$4.23' },
        { range: '5000-9999 cwt', price: '$3.17' },
      ],
    },
  ]);

  const addLane = () => {
    setLanes([
      ...lanes,
      {
        origin: '',
        destination: '',
        minCost: '',
        priceRanges: [{ range: '', price: '' }],
      },
    ]);
  };

  const handleLaneChange = (index: number, field: string, value: string) => {
    const updatedLanes: any = [...lanes];
    updatedLanes[index][field] = value;
    setLanes(updatedLanes);
  };

  const handlePriceRangeChange = (
    laneIndex: number,
    priceIndex: number,
    field: 'range' | 'price',
    value: string
  ) => {
    const updatedLanes = [...lanes];
    updatedLanes[laneIndex].priceRanges[priceIndex][field] = value;
    setLanes(updatedLanes);
  };

  const addPriceRange = (laneIndex: number) => {
    const updatedLanes = [...lanes];
    updatedLanes[laneIndex].priceRanges.push({ range: '', price: '' });
    setLanes(updatedLanes);
  };

  const removeLane = (index: number) => {
    const updatedLanes = lanes.filter((_, i) => i !== index);
    setLanes(updatedLanes);
  };

  const removePriceRange = (laneIndex: number, priceIndex: number) => {
    const updatedLanes = [...lanes];
    updatedLanes[laneIndex].priceRanges = updatedLanes[
      laneIndex
    ].priceRanges.filter((_, i) => i !== priceIndex);
    setLanes(updatedLanes);
  };

  return (
    <div className="col-span-full border border-gray-300 rounded-lg p-4">
      {/* CWT Lanes Header */}
      <div className="p-4 rounded-t-lg">
        <h2 className="font-semibold text-lg">CWT Lanes</h2>
      </div>

      {/* Lanes */}
      {lanes.map((lane, laneIndex) => (
        <div key={laneIndex} className="p-4 border-b border-gray-300 mb-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold">Origin</label>
              <input
                type="text"
                value={lane.origin}
                onChange={(e) =>
                  handleLaneChange(laneIndex, 'origin', e.target.value)
                }
                className="mt-1 border rounded-md p-2 w-full"
                placeholder="Origin"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold">Destination</label>
              <input
                type="text"
                value={lane.destination}
                onChange={(e) =>
                  handleLaneChange(laneIndex, 'destination', e.target.value)
                }
                className="mt-1 border rounded-md p-2 w-full"
                placeholder="Destination"
              />
            </div>
          </div>

          {/* Price per CWT by CWT range */}
          <h3 className="font-semibold text-lg mt-4">
            Price per CWT by CWT range
          </h3>
          <div className="grid grid-cols-3 gap-4 mt-2">
            {lane.priceRanges.map((priceRange, priceIndex) => (
              <React.Fragment key={priceIndex}>
                <input
                  type="text"
                  value={priceRange.range}
                  onChange={(e) =>
                    handlePriceRangeChange(
                      laneIndex,
                      priceIndex,
                      'range',
                      e.target.value
                    )
                  }
                  className="border rounded-md p-2"
                  placeholder="CWT Range"
                />
                <input
                  type="text"
                  value={priceRange.price}
                  onChange={(e) =>
                    handlePriceRangeChange(
                      laneIndex,
                      priceIndex,
                      'price',
                      e.target.value
                    )
                  }
                  className="border rounded-md p-2"
                  placeholder="Price per CWT"
                />
                <button
                  onClick={() => removePriceRange(laneIndex, priceIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </React.Fragment>
            ))}
          </div>
          <div className="col-span-full flex gap-6">
            <button
              onClick={() => addPriceRange(laneIndex)}
              className="text-blue-600 hover:text-blue-800 font-semibold mt-2"
            >
              + Add Price Range
            </button>
          </div>
        </div>
      ))}

      {/* Add additional lanes button */}
      <div className="p-4">
        <button
          onClick={addLane}
          className="text-blue-600 hover:text-blue-800 font-semibold"
        >
          + Add additional lanes
        </button>
      </div>
    </div>
  );
};

export default CwtLanesComponent;
