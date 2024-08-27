'use client';

import { useState } from 'react';
import HorizontalFormBlockWrapper from '@/app/shared/account-settings/horiozontal-block';
import {
  Button,
  Text,
  Switch
} from 'rizzui';

const generalOptions = [
  {
    title: 'Order Spot Quoted',
  },
  {
    title: 'Order Chat',
  },
  {
    title: 'Tender Offer',
  },
  {
    title: 'Manifest Dispatched',
  },
  {
    title: 'Manifest Chat',
  },
  {
    title: 'Problem in Leg',
  },
  {
    title: 'Task Assignment',
  }
];

export default function NotificationSettingsView() {
  const [values, setValues] = useState<string[]>([]);
  const [value, setValue] = useState('');

  return (
    <div className="@container">
      <HorizontalFormBlockWrapper
        title="Invoices"
      >
        <div className="col-span-2">
          <Switch
            label="CC me on invoices."
            variant="flat"
            labelClassName="font-medium text-sm text-gray-900"
            switchClassName='peer-checked/switch:bg-[#a5a234] peer-checked/switch:border-[#a5a234]'
          />
        </div>
      </HorizontalFormBlockWrapper>

      <HorizontalFormBlockWrapper
        childrenWrapperClassName="gap-0 @lg:gap-0"
        title="Notifications"
        titleClassName="text-xl font-semibold"
        description="Select when and how you will be notified."
      >
        <div className="col-span-2">
          {generalOptions.map((opt, index) => (
            <div
              key={`generalopt-${index}`}
              className="flex items-center justify-between border-b border-muted py-6 last:border-none last:pb-0"
            >
              <Text className="text-sm font-medium text-gray-900">
                {opt.title}
              </Text>
              <ButtonGroup
                onChange={(option) => console.log(opt.title, option)}
              />
            </div>
          ))}
        </div>
      </HorizontalFormBlockWrapper>
    </div>
  );
}

const options = ['None', 'In-app', 'Email'];

function ButtonGroup({ onChange }: { onChange: (option: string) => void }) {
  const [selected, setSelected] = useState<string>();
  function handleOnClick(option: string) {
    setSelected(option);
    onChange && onChange(option);
  }

  return (
    <div className="inline-flex gap-1">
      {options.map((option) => (
        <Button
          key={option}
          variant={selected === option ? 'solid' : 'outline'}
          onClick={() => handleOnClick(option)}
          style={{
            backgroundColor: selected === option ? '#a5a234' : 'transparent',
            color: selected === option ? 'white' : 'inherit',
            borderColor: selected === option ? '#a5a234' : 'inherit',
          }}
        >
          {option}
        </Button>
      ))}
    </div>
  );
}
