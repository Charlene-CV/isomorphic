import { useState } from 'react';
import TypeCard from './type-card';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi'; // Importing icons from React Icons

interface TypeListProps {
  types: any[];
  fetchTypes: any;
  fetchServices: any;
}

export default function TypeList({
  types,
  fetchTypes,
  fetchServices,
}: TypeListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxVisibleRows = 2; // Define the maximum number of visible rows
  const visibleTypes = isExpanded ? types : types.slice(0, maxVisibleRows * 3); // Calculate visible types based on the state

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visibleTypes &&
          visibleTypes.length &&
          visibleTypes.map((type: any) => (
            <div key={type.uuid} className="px-5">
              <TypeCard
                fetchServices={fetchServices}
                fetchTypes={fetchTypes}
                name={type?.name}
                uuid={type.uuid}
              />
            </div>
          ))}
      </div>

      {/* Show the expand/collapse button only if there are more types than visible */}
      {types.length > maxVisibleRows * 3 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={toggleExpand}
            className="flex items-center text-blue-500 hover:underline"
          >
            {isExpanded ? (
              <>
                <HiChevronUp className="mr-1" /> Collapse All
              </>
            ) : (
              <>
                <HiChevronDown className="mr-1" /> Expand All
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
