export const CART_KEY = 'isomorphic-cart';
export const POS_CART_KEY = 'isomorphic-pos-cart';
export const DUMMY_ID = 'FC6723757651DB74';
export const CHECKOUT = 'isomorphic-checkout';
export const CURRENCY_CODE = 'USD';
export const LOCALE = 'en';
export const CURRENCY_OPTIONS = {
  formation: 'en-US',
  fractions: 2,
};

export const ROW_PER_PAGE_OPTIONS = [
  {
    value: 5,
    name: '5',
  },
  {
    value: 10,
    name: '10',
  },
  {
    value: 15,
    name: '15',
  },
  {
    value: 20,
    name: '20',
  },
];

export const ROLES = {
  Administrator: 'Administrator',
  Manager: 'Manager',
  Sales: 'Sales',
  Support: 'Support',
  Developer: 'Developer',
  HRD: 'HR Department',
  RestrictedUser: 'Restricted User',
  Customer: 'Customer',
} as const;

export const ServiceConnectionEnum = {
  DEFAULT: 'default app',
  YRC: 'yrc',
  CONWAY: 'conway',
  FEDEX: 'fedex',
  FREIGHTCOM: 'freightcom',
  DAYROSS: 'day & ross',
  MANITOULIN: 'manitoulin',
  SAIA: 'saia',
  ABF: 'abf',
  DAYTON: 'dayton',
  R_AND_L: 'r and l',
  FR8NEX: 'fr8nex',
  RATE_CARD: 'rate card',
  FREIGHT_RATER: 'freight rater',
  CARRIER_CONNECTOR: 'carrier connector',
  PROJECT44: 'project 44',
  GREEN_SCREENS: 'green screend',
};

export const CustomerTypesEnum = {
  SHIPPER: 'shipper',
  BROKER: 'broker',
  CARRIER: 'carrier',
  OTHER: 'other',
};

export const BillingOptionsEnum = {
  SHIPPER: 'shipper',
  CONSIGNEE: 'consignee',
  THIRD_PARTY: 'third party',
};

export const LiveLocationEnum = {
  NO: 'Do not share',
  EXACT: 'Share exact live location & ETA',
  APPROXIMATE: 'Share approximate live location & ETA',
};

export const CustomerServiceTypeEnum = {
  LTL: 'LTL',
  TL: 'Truckload',
  CUBE: 'Cube',
};

export interface IAddress {
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postal?: string | null;
  country?: string | null;
  latitude: number;
  longitude: number;
}

export interface IBusinessHours {
  open: Date;
  close: Date;
}

export const TariffTypes = {
  PALLETS: 'pallets',
  CWT: 'Cube weight (CWT)',
  MILE: 'Per mile by weight range',
};
