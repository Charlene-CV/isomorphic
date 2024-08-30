"use client";

import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { SubmitHandler, Controller, useForm } from "react-hook-form";
import { PiClock, PiEnvelopeSimple } from "react-icons/pi";
import { Form } from "@ui/form";
import { Loader, Text, Input } from "rizzui";
import FormGroup from "@/app/shared/form-group";
import FormFooter from "@components/form-footer";
import UploadZone from "@ui/file-upload/upload-zone";
import { countries, roles, timezones } from "@/data/forms/my-details";
import AvatarUpload from "@ui/file-upload/avatar-upload";
import {
  PersonalInfoFormTypes,
  personalInfoFormSchema,
  defaultValues,
} from "@/validators/personal-info.schema";
import { useEffect } from "react";
import axios from "axios";
// @ts-ignore
import Cookies from "js-cookie";

const Select = dynamic(() => import("rizzui").then((mod) => mod.Select), {
  ssr: false,
  loading: () => (
    <div className="grid h-10 place-content-center">
      <Loader variant="spinner" />
    </div>
  ),
});

const QuillEditor = dynamic(() => import("@ui/quill-editor"), {
  ssr: false,
});

export default function PersonalInfoView() {
  const onSubmit: SubmitHandler<PersonalInfoFormTypes> = (data) => {
    toast.success(<Text as="b">Successfully added!</Text>);
    console.log("Profile settings data ->", {
      ...data,
    });
  };
  const {
    control,
    handleSubmit,
    reset,
    register,
    setValue,
    getValues,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm<PersonalInfoFormTypes>({
    mode: "onChange",
    defaultValues,
  });
  ``;

  useEffect(() => {
    async function fetchExistingData() {
      try {
        const user = JSON.parse(Cookies.get("user"));
        const uuid = user.id;
        console.log(user);
        const token = user.token;
        const response = await axios.get(
          `http://localhost:3000/api/v1/users/find-one/${uuid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const responseData = response?.data?.data;
        if (responseData) {
          const fields: (keyof PersonalInfoFormTypes)[] = [
            "firstName",
            "lastName",
            "email",
            "phone",
          ];
          const defaults = {
            firstName: "First",
            lastName: "Last Name",
            email: "example@123.com",
            phone: "XXX-XXX-XXXX",
          };
          fields.forEach((field) =>
            setValue(field, responseData[field] || defaults[field])
          );
        }
      } catch (error) {
        console.error("Failed to fetch existing data:", error);
      }
    }
    fetchExistingData();
  }, [setValue]); //session

  return (
    <Form<PersonalInfoFormTypes>
      validationSchema={personalInfoFormSchema}
      // resetValues={reset}
      onSubmit={onSubmit}
      className="@container"
      useFormProps={{
        mode: "onChange",
        defaultValues,
      }}
    >
      {({ register, control, setValue, getValues, formState: { errors } }) => {
        return (
          <>
            <FormGroup
              title="Personal Info"
              description="Update your personal details here"
              className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
            />

            <div className="mb-10 grid gap-7 divide-y divide-dashed divide-gray-200 @2xl:gap-9 @3xl:gap-11">
              <FormGroup
                title="Name"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Input
                  {...register("firstName")}
                  error={errors.firstName?.message}
                  className="flex-grow"
                />
                <Input
                  {...register("lastName")}
                  error={errors.lastName?.message}
                  className="flex-grow"
                />
              </FormGroup>

              <FormGroup
                title="Email Address"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Input
                  className="col-span-full"
                  prefix={
                    <PiEnvelopeSimple className="h-6 w-6 text-gray-500" />
                  }
                  type="email"
                  {...register("email")}
                  error={errors.email?.message}
                />
              </FormGroup>

              <FormGroup
                title="Phone Number"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Input
                  {...register("phone")}
                  error={errors.firstName?.message}
                  className="flex-grow"
                />
              </FormGroup>

              {/* <FormGroup
                title="Your Photo"
                description="This will be displayed on your profile."
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <div className="flex flex-col gap-6 @container @3xl:col-span-2">
                  <AvatarUpload
                    name="avatar"
                    setValue={setValue}
                    getValues={getValues}
                    error={errors?.avatar?.message as string}
                  />
                </div>
              </FormGroup> */}

              {/* <FormGroup
                title="Role"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Controller
                  control={control}
                  name="role"
                  render={({ field: { value, onChange } }) => (
                    <Select
                      dropdownClassName="!z-10 h-auto"
                      inPortal={false}
                      placeholder="Select Role"
                      options={roles}
                      onChange={onChange}
                      value={value}
                      className="col-span-full"
                      getOptionValue={(option) => option.value}
                      displayValue={(selected) =>
                        roles?.find((r) => r.value === selected)?.label ?? ''
                      }
                      error={errors?.role?.message as string}
                    />
                  )}
                />
              </FormGroup> */}
              {/* 
              <FormGroup
                title="Country"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Controller
                  control={control}
                  name="country"
                  render={({ field: { onChange, value } }) => (
                    <Select
                      dropdownClassName="!z-10 h-auto"
                      inPortal={false}
                      placeholder="Select Country"
                      options={countries}
                      onChange={onChange}
                      value={value}
                      className="col-span-full"
                      getOptionValue={(option) => option.value}
                      displayValue={(selected) =>
                        countries?.find((con) => con.value === selected)
                          ?.label ?? ''
                      }
                      error={errors?.country?.message as string}
                    />
                  )}
                />
              </FormGroup> */}

              {/* <FormGroup
                title="Timezone"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Controller
                  control={control}
                  name="timezone"
                  render={({ field: { onChange, value } }) => (
                    <Select
                      dropdownClassName="!z-10 h-auto"
                      inPortal={false}
                      prefix={<PiClock className="h-6 w-6 text-gray-500" />}
                      placeholder="Select Timezone"
                      options={timezones}
                      onChange={onChange}
                      value={value}
                      className="col-span-full"
                      getOptionValue={(option) => option.value}
                      displayValue={(selected) =>
                        timezones?.find((tmz) => tmz.value === selected)
                          ?.label ?? ''
                      }
                      error={errors?.timezone?.message as string}
                    />
                  )}
                />
              </FormGroup> */}

              {/* <FormGroup
                title="Bio"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <Controller
                  control={control}
                  name="bio"
                  render={({ field: { onChange, value } }) => (
                    <QuillEditor
                      value={value}
                      onChange={onChange}
                      className="@3xl:col-span-2 [&>.ql-container_.ql-editor]:min-h-[100px]"
                      labelClassName="font-medium text-gray-700 dark:text-gray-600 mb-1.5"
                    />
                  )}
                />
              </FormGroup>

              <FormGroup
                title="Portfolio Projects"
                description="Share a few snippets of your work"
                className="pt-7 @2xl:pt-9 @3xl:grid-cols-12 @3xl:pt-11"
              >
                <div className="mb-5 @3xl:col-span-2">
                  <UploadZone
                    name="portfolios"
                    getValues={getValues}
                    setValue={setValue}
                    error={errors?.portfolios?.message as string}
                  />
                </div>
              </FormGroup> */}
            </div>

            <FormFooter
              // isLoading={isLoading}
              altBtnText="Cancel"
              submitBtnText="Save"
            />
          </>
        );
      }}
    </Form>
  );
}
