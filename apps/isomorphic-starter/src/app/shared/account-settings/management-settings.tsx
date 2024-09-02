'use client';

import { useState } from 'react';
import { ActionIcon, Button, Title } from 'rizzui';
import { useModal } from '@/app/shared/modal-views/use-modal';
import HorizontalFormBlockWrapper from '@/app/shared/account-settings/horiozontal-block';
import {
  PiArrowRightBold,
  PiDownloadSimpleBold,
  PiPlusBold,
  PiXBold
} from 'react-icons/pi';
import { SubmitHandler } from 'react-hook-form';
import axios from 'axios';
// @ts-ignore
import Cookies from 'js-cookie';
import { TagFormInput } from '@/validators/create-tag.schema';


export default function ManagementSettingsView() {
  const onSubmit: SubmitHandler<TagFormInput> = async (data) => {
    try {
      
    } catch (error) {
      console.error("Error logging in: ", error);
    }
  };

  return (
    <>
      <div className='flex flex-row justify-between py-10 px-10'>
        <h4 className='text-base font-medium'>Tags</h4>
        <div>
          <Button type="submit" variant="solid" className='bg-[#a5a234]'>
            Manage Tags
          </Button>
        </div>
      </div>
    </>
  );
}

