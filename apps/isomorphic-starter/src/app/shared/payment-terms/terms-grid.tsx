'use client';

import React, { useEffect, useState } from 'react';
import cn from '@utils/class-names';
import axios from 'axios';
// @ts-ignore
import Cookies from 'js-cookie';
import { baseUrl } from '@/config/url';
import TermCard from './terms-card';
import { TermFormInput } from '@/validators/create-terms.schema';

interface TermGridProps {
  className?: string;
  gridClassName?: string;
}

export default function TermGrid({ className, gridClassName }: TermGridProps) {
  const [data, setData] = useState<TermFormInput[]>([]);

  async function getTerms() {
    const user: any = JSON.parse(Cookies.get('user'));
    const token = user.token;

    const response = await axios.get(`${baseUrl}/api/v1/payment-terms/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setData(response?.data?.data);
  }

  useEffect(() => {
    getTerms();
  }, []);

  return (
    <div className={cn('@container', className)}>
      <div
        className={cn(
          'grid grid-cols-1 gap-x-20 gap-y-12 @[36.65rem]:grid-cols-3 @[56rem]:grid-cols-4 @[78.5rem]:grid-cols-5 @[100rem]:grid-cols-5',
          gridClassName
        )}
      >
        {data.map((term, index) => (
          <React.Fragment key={index}>
            <TermCard fetchTerms={getTerms} {...term} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
