'use client';

import {
  MultiSelectOption,
  Select,
  SelectOption,
  SelectProps,
  Text,
} from 'rizzui';
import { socialMediaOptions } from '@/data/social-media-dashboard-data';
import { PiCheck, PiX } from 'react-icons/pi';

export function SocialMediaFilter({
  value,
  onChange,
  ...props
}: Omit<SelectProps<SelectOption>, 'options'>) {
  return (
    <Select
      value={value}
      className="w-36"
      onChange={onChange}
      selectClassName="ring-0 h-9"
      options={socialMediaOptions}
      displayValue={(op: SelectOption) => renderCustomSocialOption(op)}
      getOptionDisplayValue={(op) => renderCustomSocialOption(op)}
      {...props}
    />
  );
}

export function renderCustomSocialOption(op: SelectOption) {
  const Icon = op.icon;
  return (
    <span className="flex items-center gap-2">
      <Icon className="size-4 shrink-0" />
      <Text>{op.label}</Text>
    </span>
  );
}

export function renderCustomSocialMultiOption(
  op: SelectOption,
  selected: boolean
) {
  const Icon = op.icon;
  return (
    <span className="flex w-full items-center gap-2">
      <Icon className="size-4 shrink-0" />
      <Text>{op.label}</Text>
      {selected && <PiCheck className="ms-auto size-4 shrink-0" />}
    </span>
  );
}

export function renderDisplayValue(
  option: MultiSelectOption,
  handleClearItem?: (value: string) => void
) {
  const Icon = option.icon;
  return (
    <div className="flex items-center gap-2 rounded-md border border-muted p-0.5 ps-1">
      <Icon className="size-4 shrink-0" />
      <Text>{option.label}</Text>
      <span
        className="cursor-pointer rounded-full p-1 hover:bg-muted"
        onClick={(e) => {
          e.stopPropagation();
          handleClearItem?.(option.value);
        }}
      >
        <PiX strokeWidth={3} className="size-3" />
      </span>
    </div>
  );
}

export function GetSocialOption({ platform }: { platform: string }) {
  const selected = socialMediaOptions.find(
    (op) => op.value.toLowerCase() === platform.toLowerCase()
  );

  return renderCustomSocialOption(selected!);
}
