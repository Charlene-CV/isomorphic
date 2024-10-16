import React, { useState, useCallback } from 'react';
import { FaTrash } from 'react-icons/fa';
import { Tariffs } from '..';
import { CwtRange } from '../cwtRange';

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

interface IPriceRange {
  range: {
    minRange: number;
    maxRange: number;
  };
  price: number;
}

export interface CwtLanes {
  uuid: string;
  origin?: string | null;
  destination?: string | null;
  minCost?: number | null;
  maxCost?: number | null;
  minTransit?: number | null;
  maxTransit?: number | null;
  priceRange?: IPriceRange[] | null;
  tariff: Tariffs;
  cwtRanges: CwtRange[];
}

interface CwtLaneProps {
  tariff: Tariffs;
  cwtRanges: CwtRange[];
  cwtLanes: CwtLanes[];
  setCwtLanes: React.Dispatch<React.SetStateAction<CwtLanes[]>>;
}

const CwtLanesComponent = ({
  tariff,
  cwtRanges,
  cwtLanes,
  setCwtLanes,
}: CwtLaneProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter lanes based on search term
  const filteredLanes = cwtLanes.filter(
    (lane) =>
      lane.origin?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lane.destination?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLanes = filteredLanes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLanes.length / itemsPerPage);

  // State update helper function
  const updateLane = (index: number, updatedLane: Partial<CwtLanes>) => {
    setCwtLanes((prevLanes) =>
      prevLanes.map((lane, i) =>
        i === index ? { ...lane, ...updatedLane } : lane
      )
    );
  };

  const addLane = () => {
    const newPriceRanges = cwtRanges
      .map((range) => ({
        range: {
          minRange: range?.minRange ?? 0,
          maxRange: range?.maxRange ?? 0,
        },
        price: 0, // Default price can be set to 0 or any other value
      }))
      .sort((a, b) => a.range.minRange - b.range.minRange);

    const newLane = {
      uuid: generateUUID(),
      origin: '',
      destination: '',
      minCost: null,
      maxCost: null,
      minTransit: null,
      maxTransit: null,
      priceRange: newPriceRanges,
      tariff: tariff,
      cwtRanges: cwtRanges,
    };

    setCwtLanes((prevLanes) => [...prevLanes, newLane]);
  };

  const handleLaneChange = (
    index: number,
    field: keyof CwtLanes,
    value: string | null | number
  ) => {
    updateLane(index, { [field]: value });
  };

  const handlePriceRangeChange = (
    laneIndex: number,
    priceIndex: number,
    field: keyof IPriceRange,
    value: string
  ) => {
    setCwtLanes((prevLanes) => {
      const updatedLanes: any = [...prevLanes];
      if (updatedLanes[laneIndex].priceRange) {
        if (field === 'price') {
          updatedLanes[laneIndex].priceRange[priceIndex][field] =
            parseFloat(value) || 0;
        } else {
          updatedLanes[laneIndex].priceRange[priceIndex][field] = value;
        }

        // Sort the priceRange array by minRange after updating
        updatedLanes[laneIndex].priceRange.sort(
          (a: IPriceRange, b: IPriceRange) =>
            a.range.minRange - b.range.minRange
        );
      }
      return updatedLanes;
    });
  };

  const addPriceRange = (laneIndex: number) => {
    setCwtLanes((prevLanes) => {
      const updatedLanes = [...prevLanes];
      if (updatedLanes[laneIndex].priceRange) {
        updatedLanes[laneIndex].priceRange.push({
          range: { minRange: 0, maxRange: 0 },
          price: 0,
        });
      }
      return updatedLanes;
    });
  };

  const removeLane = (index: number) => {
    setCwtLanes((prevLanes) => prevLanes.filter((_, i) => i !== index));
  };

  const removePriceRange = (laneIndex: number, priceIndex: number) => {
    setCwtLanes((prevLanes) => {
      const updatedLanes = [...prevLanes];
      if (updatedLanes[laneIndex].priceRange) {
        updatedLanes[laneIndex].priceRange = updatedLanes[
          laneIndex
        ].priceRange.filter((_, i) => i !== priceIndex);
      }
      return updatedLanes;
    });
  };

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return (
    <div className="col-span-full border border-gray-300 rounded-lg p-4">
      {/* CWT Lanes Header */}
      <div className="p-4 rounded-t-lg">
        <h2 className="font-semibold text-lg">CWT Lanes</h2>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by origin or destination"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-md p-2 w-full"
        />
      </div>

      {/* Lanes */}
      {currentLanes.map((lane, laneIndex) => (
        <div key={laneIndex} className="p-4 border-b border-gray-300 mb-4">
          <div className="flex gap-4">
            <div className="flex-2">
              <label className="block text-sm font-semibold">Origin</label>
              <input
                type="text"
                value={lane.origin || ''}
                onChange={(e) =>
                  handleLaneChange(laneIndex, 'origin', e.target.value)
                }
                className="mt-1 border rounded-md p-2"
                placeholder="Origin"
              />
              <span className="text-lg font-semibold text-gray-300">
                {' '}
                {'-->'}
              </span>
            </div>
            <div className="flex-2">
              <label className="block text-sm font-semibold">Destination</label>
              <input
                type="text"
                value={lane.destination || ''}
                onChange={(e) =>
                  handleLaneChange(laneIndex, 'destination', e.target.value)
                }
                className="mt-1 border rounded-md p-2"
                placeholder="Destination"
              />
            </div>
            <div className="flex-4">
              <label className="block text-sm font-semibold">Min Cost</label>
              <input
                type="number"
                value={lane.minCost || ''}
                onChange={(e) => {
                  const value = e.target.value
                    ? Number.parseFloat(e.target.value)
                    : null; // Convert to number or set to null
                  // setMinCost(value);
                  handleLaneChange(laneIndex, 'minCost', value);
                }}
                className="border rounded-md p-2"
                placeholder="Min Cost"
              />
              <label className="block text-sm font-semibold">Max Cost</label>
              <input
                type="number"
                value={lane.maxCost || ''}
                onChange={(e) => {
                  const value = e.target.value
                    ? Number.parseFloat(e.target.value)
                    : null; // Convert to number or set to null
                  // setMaxCost(value);
                  handleLaneChange(laneIndex, 'maxCost', value);
                }}
                className="border rounded-md p-2"
                placeholder="Max Cost"
              />
            </div>
            <div className="flex-4">
              <label className="block text-sm font-semibold">Min Transit</label>
              <input
                type="number"
                value={lane.minTransit || ''}
                onChange={(e) => {
                  const value = e.target.value
                    ? Number.parseFloat(e.target.value)
                    : null; // Convert to number or set to null
                  // setMinTransit(value);
                  handleLaneChange(laneIndex, 'minTransit', value);
                }}
                className="border rounded-md p-2"
                placeholder="Min Transit"
              />
              <label className="block text-sm font-semibold">Max Transit</label>
              <input
                type="number"
                value={lane.maxTransit || ''}
                onChange={(e) => {
                  const value = e.target.value
                    ? Number.parseFloat(e.target.value)
                    : null; // Convert to number or set to null
                  // setMaxTransit(value);
                  handleLaneChange(laneIndex, 'maxTransit', value);
                }}
                className="border rounded-md p-2"
                placeholder="Max Transit"
              />
            </div>
          </div>

          {/* Price per CWT by CWT range */}
          <h3 className="font-semibold text-lg mt-4">
            Price per CWT by CWT range
          </h3>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {lane.priceRange?.map((priceRange, priceIndex) => (
              <React.Fragment key={priceIndex}>
                <input
                  type="text"
                  value={priceRange.range.minRange || 0}
                  className="border rounded-md p-2"
                  placeholder="Min Range"
                />
                <input
                  type="text"
                  value={priceRange.range.maxRange || 0}
                  className="border rounded-md p-2"
                  placeholder="Max Range"
                />
                <input
                  type="number"
                  value={priceRange.price || ''}
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
                <div className="flex items-center">
                  <button
                    onClick={() => removePriceRange(laneIndex, priceIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
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

          {/* Remove Lane Button */}
          <div className="flex justify-end mt-2">
            <button
              onClick={() => removeLane(laneIndex)}
              className="text-red-500 hover:text-red-700"
            >
              Remove Lane
            </button>
          </div>
        </div>
      ))}

      {/* Add Lane Button */}
      <div className="flex justify-between mt-4">
        <button
          onClick={addLane}
          className="text-blue-600 hover:text-blue-800 font-semibold"
        >
          + Add Lane
        </button>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="text-blue-600 hover:text-blue-800"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="text-blue-600 hover:text-blue-800"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CwtLanesComponent;
