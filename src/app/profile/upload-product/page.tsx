"use client";

import React, { useState, useTransition } from "react";
import Button from "@/components/button/Button";
import * as z from "zod";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { deleteImage, getImageUrl } from "@/utils/imageUrl";
import { useSession } from "next-auth/react";
import Loading from "@/components/loading/Loading";
import CityAndStreet from "@/components/updateProductForm/CityAndStreet";

interface PropsData {
  city: string;
  street: string;
  houseNumber: number;
}

type Session = {
  user: {
    name: string;
    email: string;
    image?: undefined;
    id: string;
  };
};

const ProductSchema = z.object({
  type: z.enum(["SCOOTER", "BICYCLE"]),
  title: z.string().min(1, "יש להזין כותרת"),
  description: z.string(),
  pricePerDay: z.coerce.number().min(1, "מחיר ליום נדרש"),
  pricePerHour: z.coerce.number().min(1, "מחיר לשעה נדרש"),
});

export type ProductData = z.infer<typeof ProductSchema | any>;

const UploadItemForm: React.FC = () => {
  const router = useRouter();
  const [errors, setErrors] = useState<any>({});
  const [isChecked, setIsChecked] = useState(false);
  const [pending, startTransition] = useTransition();
  const [images, setimages] = useState<string[]>([]);
  const [address, setAddress] = useState<PropsData>();
  const [previewUrls, setPreviewUrls] = useState<string[] | any[]>([]);
  const { data: userSession, status } = useSession();

  let session: Session | any = userSession;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (images.length >= 4) return;

    if (e.target.files) {
      const newFiles = Array.from(e.target.files).slice(0, 4 - images.length);

      const newUrls = await Promise.all(
        newFiles.map(async (file) => {
          const imgUrl = await getImageUrl(file);
          return imgUrl;
        })
      );

      setimages((prev) => [...prev, ...newUrls]);
      setPreviewUrls((prev) => [...prev, ...newUrls]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const image = previewUrls[index];
    deleteImage(image);
    const updatedImages = [...images];
    const updatedUrls = [...previewUrls];
    updatedImages.splice(index, 1);
    updatedUrls.splice(index, 1);
    setimages(updatedImages);
    setPreviewUrls(updatedUrls);
  };

  const handleChecboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleChildProps = (address: PropsData) => {
    setAddress(address);
  };

  const handleSubmit = async (formDate: ProductData) => {
    const data = Object.fromEntries(formDate);
    const result = ProductSchema.safeParse(data);

    data.hasHelmet = isChecked;
    data.images = images;
    data.city = address?.city;
    data.street = address?.street;
    data.houseNumber = address?.houseNumber;
    data.pricePerDay = parseInt(data.pricePerDay);
    data.pricePerHour = parseInt(data.pricePerHour);
    data.batteryWatts = parseInt(data.batteryWatts);
    data.authorId = session.user.id;

    if (result.error) {
      const errorsList = result.error?.flatten().fieldErrors;
      setErrors(errorsList);
      return errors;
    } else {
      startTransition(async () => {
        const res = await fetch("/api/product", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          router.push("/profile/my-product");
        } else {
          errors.failed = "שגיעה בהעלאת המוצר נסה שנית מאוחר יותר";
        }
      });
    }
  };

  return (
    <section className="max-w-2xl mx-auto py-10 px-6 mt-24">
      <h1 className="text-2xl font-bold mb-6 text-right">העלה מוצר חדש</h1>
      <form action={handleSubmit} className="space-y-6 text-right">
        <div>
          <label className="block mb-1 text-sm">סוג</label>
          <select
            defaultChecked
            defaultValue="BICYCLE"
            name="type"
            className="w-full border rounded p-2"
          >
            <option value="SCOOTER">קורקינט</option>
            <option value="BICYCLE">אופניים</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm">כותרת</label>
          <input
            name="title"
            placeholder="כותרת"
            className="w-full border rounded p-2"
          />
          {errors?.title && (
            <small className="text-red-500 block">{errors?.title[0]}</small>
          )}
        </div>
        <div>
          <label className="block mb-1 text-sm">תיאור</label>
          <textarea
            name="description"
            placeholder="תיאור..."
            className="w-full border rounded p-2 h-24"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">דגם</label>
          <input
            name="model"
            placeholder="דגם"
            className="w-full border rounded p-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm">מחיר ליום</label>
            <input
              type="number"
              name="pricePerDay"
              placeholder="מחיר ליום"
              className="w-full border rounded p-2"
            />
            {errors?.pricePerDay && (
              <small className="text-red-500 block">
                {errors?.pricePerDay[0]}
              </small>
            )}
          </div>
          <div>
            <label className="block mb-1 text-sm">מחיר לשעה</label>
            <input
              type="number"
              name="pricePerHour"
              placeholder="מחיר לשעה"
              className="w-full border rounded p-2"
            />
            {errors?.pricePerHour && (
              <small className="text-red-500 block">
                {errors?.pricePerHour[0]}
              </small>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            defaultValue={"false"}
            name="hasHelmet"
            onChange={handleChecboxChange}
          />
          <label>כולל קסדה</label>
        </div>
        <div>
          <label className="block mb-1 text-sm">ווט סוללה</label>
          <input
            type="number"
            name="batteryWatts"
            placeholder="ווט סוללה"
            className="w-full border rounded p-2"
          />
        </div>
        <CityAndStreet onInputsChange={handleChildProps} />
        <div>
          <label className="block mb-1 text-sm">תמונות (עד 4)</label>
          <div className="relative w-full">
            <input
              type="file"
              multiple
              name="images"
              accept="image/*"
              onChange={handleImageUpload}
              className="pl-10 pr-4 py-2 border rounded-md w-full"
            />
            <PlusIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            {previewUrls.map((url, index) => (
              <div
                key={index}
                className="relative w-full h-24 rounded overflow-hidden"
              >
                <img
                  src={url}
                  alt={`preview-${index}`}
                  className="object-cover w-full h-full rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        <Button
          text={pending ? <Loading /> : "העלה מוצר"}
          type="submit"
          className="w-full"
        />
        {errors?.failed && (
          <small className="text-red-500 block">{errors?.failed}</small>
        )}
      </form>
    </section>
  );
};

export default UploadItemForm;
