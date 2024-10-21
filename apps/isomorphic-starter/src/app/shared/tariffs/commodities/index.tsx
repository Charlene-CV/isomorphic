import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { commodities },
  });

  // Reset form values if commodities props change (useful for editing existing data)
  useEffect(() => {
    reset({ commodities });
    console.log('commodities', commodities);
  }, [commodities, reset]);

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
                {/* Description */}
                <td className="p-2 text-center">
                  <Controller
                    name={`commodities.${index}.descriptions`}
                    control={control}
                    defaultValue={commodity.descriptions}
                    render={({ field }) => (
                      <input
                        {...field}
                        className="rounded p-1 w-full"
                        placeholder="Description"
                        onChange={(e) =>
                          updateCommodity(index, {
                            descriptions: e.target.value,
                          })
                        }
                      />
                    )}
                  />
                </td>

                {/* Quantity */}
                <td className="p-2 text-center">
                  <Controller
                    name={`commodities.${index}.quantity`}
                    control={control}
                    defaultValue={commodity.quantity}
                    render={({ field }) => (
                      <input
                        type="number"
                        {...field}
                        className="rounded p-1 w-14"
                        onChange={(e) =>
                          updateCommodity(index, {
                            quantity: parseInt(e.target.value, 10),
                          })
                        }
                      />
                    )}
                  />
                </td>

                {/* Type */}
                <td className="p-2 text-center">
                  <Controller
                    name={`commodities.${index}.typeUuid`}
                    control={control}
                    defaultValue={commodity.type?.uuid || ''} // Set the default value, handle the case when type is undefined
                    render={({ field }) => {
                      // Find the selected option based on the current typeUuid
                      const selectedType =
                        types.find((type) => type.uuid === field.value) ||
                        undefined;

                      return (
                        <select
                          {...field}
                          className="rounded p-1 w-full"
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            field.onChange(selectedValue); // Sync with React Hook Form
                            updateCommodity(index, {
                              typeUuid: selectedValue,
                              type: selectedType || undefined, // Set type to null if no type is selected
                            });
                          }}
                          required
                        >
                          <option value="">Select Type</option>
                          {types.map((type) => (
                            <option key={type.uuid} value={type.uuid}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      );
                    }}
                  />
                </td>

                {/* Other inputs */}
                <td className="p-2 text-center">
                  <Controller
                    name={`commodities.${index}.length`}
                    control={control}
                    defaultValue={commodity.length}
                    render={({ field }) => (
                      <input
                        type="number"
                        {...field}
                        className="rounded p-1 w-14"
                        placeholder="0"
                        onChange={(e) =>
                          updateCommodity(index, {
                            length: parseFloat(e.target.value),
                          })
                        }
                      />
                    )}
                  />
                </td>

                <td className="p-2 text-center">
                  <Controller
                    name={`commodities.${index}.width`}
                    control={control}
                    defaultValue={commodity.width}
                    render={({ field }) => (
                      <input
                        type="number"
                        {...field}
                        className="rounded p-1 w-14"
                        placeholder="0"
                        onChange={(e) =>
                          updateCommodity(index, {
                            width: parseFloat(e.target.value),
                          })
                        }
                      />
                    )}
                  />
                </td>

                <td className="p-2 text-center">
                  <Controller
                    name={`commodities.${index}.height`}
                    control={control}
                    defaultValue={commodity.height}
                    render={({ field }) => (
                      <input
                        type="number"
                        {...field}
                        className="rounded p-1 w-14"
                        placeholder="0"
                        onChange={(e) =>
                          updateCommodity(index, {
                            height: parseFloat(e.target.value),
                          })
                        }
                      />
                    )}
                  />
                </td>

                <td className="p-2 text-center">
                  <Controller
                    name={`commodities.${index}.pieces`}
                    control={control}
                    defaultValue={commodity.pieces}
                    render={({ field }) => (
                      <input
                        type="number"
                        {...field}
                        className="rounded p-1 w-14"
                        placeholder="0"
                        onChange={(e) =>
                          updateCommodity(index, {
                            pieces: parseInt(e.target.value, 10),
                          })
                        }
                      />
                    )}
                  />
                </td>

                <td className="p-2 text-center">
                  <Controller
                    name={`commodities.${index}.lf`}
                    control={control}
                    defaultValue={commodity.lf}
                    render={({ field }) => (
                      <input
                        type="number"
                        {...field}
                        className="rounded p-1 w-14"
                        placeholder="0"
                        onChange={(e) =>
                          updateCommodity(index, {
                            lf: parseFloat(e.target.value),
                          })
                        }
                      />
                    )}
                  />
                </td>

                <td className="p-2 text-center">
                  <Controller
                    name={`commodities.${index}.weight`}
                    control={control}
                    defaultValue={commodity.weight}
                    render={({ field }) => (
                      <input
                        type="number"
                        {...field}
                        className="rounded p-1 w-14"
                        placeholder="0"
                        onChange={(e) =>
                          updateCommodity(index, {
                            weight: parseFloat(e.target.value),
                          })
                        }
                      />
                    )}
                  />
                </td>

                {/* Class */}
                <td className="p-2 text-center">
                  <Controller
                    name={`commodities.${index}.class`}
                    control={control}
                    defaultValue={commodity.class ?? 'None'} // Use 'None' if class is not defined
                    render={({ field }) => (
                      <select
                        {...field}
                        className="rounded p-1 w-full"
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          field.onChange(selectedValue); // Sync with React Hook Form
                          updateCommodity(index, { class: selectedValue }); // Ensure to update class in your state management
                        }}
                      >
                        <option value="None">None</option>
                        <option value="Class 1">Class 1</option>
                        <option value="Class 2">Class 2</option>
                      </select>
                    )}
                  />
                </td>

                {/* Remove Button */}
                <td className="p-2">
                  <button
                    type="button"
                    className="text-red-600"
                    onClick={() => removeCommodity(index)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          type="button"
          className="text-blue-600 hover:text-blue-800 font-semibold"
          onClick={addCommodity}
        >
          + Add Commodity
        </button>
        <span>Total DIM: {totalDim}</span>
      </div>
    </div>
  );
};

export default CommodityComponent;
