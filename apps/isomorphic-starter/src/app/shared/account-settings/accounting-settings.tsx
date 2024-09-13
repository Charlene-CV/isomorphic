import { SubmitHandler } from "react-hook-form";
import Link from 'next/link';
import axios from "axios";
// @ts-ignore
import Cookies from "js-cookie";
import { TagFormInput } from "@/validators/create-tag.schema";
import { routes } from "@/config/routes";
import { Button } from "rizzui";

export default function AccountingSettingsView() {
  const onSubmit: SubmitHandler<TagFormInput> = async (data) => {
    try {
    } catch (error) {
      console.error("Error logging in: ", error);
    }
  };

  return (
    <>
      <div className="flex flex-row justify-between py-10 px-10 border-b border-dashed border-muted">
        <h4 className="text-base font-medium">Taxes</h4>
        <div>
          <Link href={routes.taxes}>
            <Button type="submit" variant="solid" className="bg-[#a5a234]">
              Manage
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
