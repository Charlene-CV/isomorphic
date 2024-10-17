import React from 'react';
import { FaTrash } from 'react-icons/fa';

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

interface ICommodity {
  uuid: string;
  descriptions: string;
  quantity: number;
  length: number;
  width: number;
  height: number;
  pieces: number;
  lf: number;
  weight: number;
  dim: number;
  class: string;
  typeUuid: string;
  orderUuid: string;
  type: CommodityType;
}

export interface CommodityType {
  uuid: string;
  name: string;
}

export interface Commodities {
  uuid: string;
  descriptions: string;
  quantity: number;
  length: number;
  width: number;
  height: number;
  pieces: number;
  lf: number;
  weight: number;
  dim: number;
  class: string;
  typeUuid: string;
  orderUuid: string;
  type: CommodityType;
}

interface CommodityProps {
  types: CommodityType[];
  commodities: Commodities[];
  setCommodities: React.Dispatch<React.SetStateAction<Commodities[]>>;
}

const CommodityComponent = ({
  types,
  commodities,
  setCommodities,
}: CommodityProps) => {
  const addCommodity = () => {
    const newCommodity = {
      uuid: generateUUID(),
      descriptions: '',
      quantity: 1,
      length: 0,
      width: 0,
      height: 0,
      pieces: 0,
      lf: 0,
      weight: 0,
      dim: 0,
      class: 'None',
      typeUuid: '',
      orderUuid: 'fbdbd91d-6229-4f85-9953-2f3ad30483f1',
      type: { name: 'Select Type', uuid: '' },
    };

    setCommodities((prevCommodities) => [...prevCommodities, newCommodity]);
  };

  const updateCommodity = (
    index: number,
    updatedCommodity: Partial<ICommodity>
  ) => {
    setCommodities((prevCommodities) =>
      prevCommodities.map((commodity, i) =>
        i === index ? { ...commodity, ...updatedCommodity } : commodity
      )
    );
  };

  const removeCommodity = (index: number) => {
    setCommodities((prevCommodities) =>
      prevCommodities.filter((_, i) => i !== index)
    );
  };

  // Calculate the total of all "dim" values
  const totalDim = commodities.reduce(
    (total, commodity) => total + commodity.dim,
    0
  );

  return (
    <div className="col-span-full border border-gray-300 rounded-lg p-4">
      <h2 className="font-semibold text-lg mb-4">Commodities</h2>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="text-center">Description *</th>
            <th className="text-center">QTY *</th>
            <th className="text-center">Type *</th>
            <th className="text-center">LG</th>
            <th className="text-center">WD</th>
            <th className="text-center">HT</th>
            <th className="text-center">PCS</th>
            <th className="text-center">LF</th>
            <th className="text-center">Total WT *</th>
            <th className="text-center">Class</th>
            <th className="text-center"></th>
          </tr>
        </thead>
        <tbody>
          {commodities.map((commodity, index) => (
            <React.Fragment key={commodity.uuid}>
              <tr className="border-b border-gray-200">
                <td className="p-2">
                  <input
                    value={commodity.descriptions}
                    onChange={(e) =>
                      updateCommodity(index, { descriptions: e.target.value })
                    }
                    className="rounded p-1 w-full"
                    placeholder="Description"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={commodity.quantity}
                    onChange={(e) =>
                      updateCommodity(index, {
                        quantity: parseInt(e.target.value, 10),
                      })
                    }
                    className="rounded p-1 w-full"
                    required
                  />
                </td>
                <td className="p-2">
                  <select
                    value={commodity.typeUuid}
                    onChange={(e) =>
                      updateCommodity(index, {
                        type:
                          types.find((type) => type.uuid === e.target.value) ||
                          commodity.type,
                      })
                    }
                    className="rounded p-1 w-full"
                    required
                  >
                    <option value="">Select Type</option>
                    {types.map((type) => (
                      <option key={type.uuid} value={type.uuid}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={commodity.length || ''}
                    onChange={(e) =>
                      updateCommodity(index, {
                        length: parseFloat(e.target.value),
                      })
                    }
                    className="rounded p-1 w-full"
                    placeholder="0"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={commodity.width || ''}
                    onChange={(e) =>
                      updateCommodity(index, {
                        width: parseFloat(e.target.value),
                      })
                    }
                    className="rounded p-1 w-full"
                    placeholder="0"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={commodity.height || ''}
                    onChange={(e) =>
                      updateCommodity(index, {
                        height: parseFloat(e.target.value),
                      })
                    }
                    className="rounded p-1 w-full"
                    placeholder="0"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={commodity.pieces || ''}
                    onChange={(e) =>
                      updateCommodity(index, {
                        pieces: parseInt(e.target.value, 10),
                      })
                    }
                    className="rounded p-1 w-full"
                    placeholder="0"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={commodity.lf || ''}
                    onChange={(e) =>
                      updateCommodity(index, {
                        lf: parseFloat(e.target.value),
                      })
                    }
                    className="rounded p-1 w-full"
                    required
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={commodity.weight || ''}
                    onChange={(e) =>
                      updateCommodity(index, {
                        weight: parseFloat(e.target.value),
                      })
                    }
                    className="rounded p-1 w-full"
                    required
                  />
                </td>
                <td className="p-2">
                  <select
                    value={commodity.class}
                    onChange={(e) =>
                      updateCommodity(index, { class: e.target.value })
                    }
                    className="rounded p-1 w-full"
                  >
                    <option value="None">None</option>
                    <option value="50">Class 50</option>
                    <option value="60">Class 60</option>
                  </select>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => removeCommodity(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4} className="text-left p-2 font-bold">
              Totals:
            </td>
            <td colSpan={4} className="text-left p-2"></td>
            <td className="text-right p-2 font-bold">{totalDim} lbs(DIM)</td>
          </tr>
        </tfoot>
      </table>

      <button
        type="button"
        onClick={addCommodity}
        className="text-blue-600 font-medium mt-4 inline-block"
      >
        + Add Commodity
      </button>
    </div>
  );
};

export default CommodityComponent;
