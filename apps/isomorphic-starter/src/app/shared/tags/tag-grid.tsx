"use client";

import React, { useEffect, useState } from 'react';
import TagCard from '@/app/shared/tags/tag-card';
import cn from '@utils/class-names';
import axios from 'axios';
// @ts-ignore
import Cookies from "js-cookie";
import { TagFormInput } from '@/validators/create-tag.schema';

interface RolesGridProps {
  className?: string;
  gridClassName?: string;
}

export default function TagsGrid({
  className,
  gridClassName,
}: RolesGridProps) {
  const [data, setData] = useState<TagFormInput[]>([]);

  async function getTags() {
    const user: any = JSON.parse(Cookies.get("user"));
    const token = user.token;
    const response = await axios.get(
      `${baseUrl}/api/v1/tags/all`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    setData(response?.data?.data);
  };

  useEffect(() => {
    getTags();
  }, []);

  console.log("data", data)

  return (
    <div className={cn('@container', className)}>
      <div
        className={cn(
          'grid grid-cols-1 gap-x-20 gap-y-12 @[36.65rem]:grid-cols-3 @[56rem]:grid-cols-4 @[78.5rem]:grid-cols-5 @[100rem]:grid-cols-5',
          gridClassName
        )}
      >
        {data.map((tag, index) => (
          <React.Fragment key={index}>  
            <TagCard {...tag} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
