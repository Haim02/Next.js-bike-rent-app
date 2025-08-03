"use client";

import React, { useEffect, useState, useTransition } from "react";
import Button from "@/components/button/Button";
import CityAndStreet from "./CityAndStreet";
import { deleteImage, getImageUrl } from "@/utils/imageUrl";
import Loading from "../loading/Loading";
import { PlusIcon } from "@heroicons/react/24/solid";

interface PropsData {
  city: string;
  street: string;
  houseNumber: number;
}

const UpdateProductForm = ({
  productId,
  onCancel,
}: {
  productId: number;
  onCancel: () => void;
}) => {
  const [pending, startTransition] = useTransition();
  const [product, setProduct] = useState<any>(null);
  const [isChecked, setIsChecked] = useState(product?.hasHelmet);
  const [address, setAddress] = useState<PropsData>();
  const [images, setimages] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[] | any[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch("/api/profile/product/");
      const data = await res.json();
      setProduct(data);
      setimages(data.images);
      setPreviewUrls(data.images);
      setIsChecked(data.hasHelmet);
    };
    fetchProduct();
  }, [productId]);

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

  const handleChildProps = (address: PropsData) => {
    setAddress(address);
  };

  const handleChecboxChange = () => {
    setIsChecked(!isChecked);
    product.hasHelmet = !product.hasHelmet;
  };

  const handleSubmit = async (formData: FormData) => {
    const body = Object.fromEntries(formData);

    if (address?.city === undefined) {
      body.city = product.city;
    } else {
      body.city = address.city;
    }

    if (address?.street === undefined) {
      body.street = product.street;
    } else {
      body.street = address.street;
    }

    if (address?.houseNumber === undefined) {
      body.houseNumber = product.houseNumber;
    } else {
      body.houseNumber = address.houseNumber;
    }

    body.hasHelmet = isChecked;
    body.images = images;
    body.pricePerDay = parseInt(body.pricePerDay);
    body.pricePerHour = parseInt(body.pricePerHour);
    body.batteryWatts = parseInt(body.batteryWatts);

    startTransition(async () => {
      await fetch("http://localhost:3000/api/profile/product", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }).catch((err) => {
      });
    });

    onCancel();
  };

  if (!product) return <p>טוען...</p>;

  return (
    <form action={handleSubmit} className="mt-10 border-t pt-6 space-y-4">
      <h2 className="text-xl font-semibold mb-4 text-right">
        עדכון פרטי המוצר
      </h2>

      <div>
        <label className="block text-sm font-medium text-right">כותרת</label>
        <input
          name="title"
          defaultValue={product.title}
          className="w-full border rounded-lg px-4 py-2 text-right"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-right">תיאור</label>
        <textarea
          name="description"
          defaultValue={product.description}
          className="w-full border rounded-lg px-4 py-2 text-right h-24"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-right">
            מחיר ליום
          </label>
          <input
            name="pricePerDay"
            type="number"
            defaultValue={product.pricePerDay}
            className="w-full border rounded-lg px-4 py-2 text-right"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-right">
            מחיר לשעה
          </label>
          <input
            name="pricePerHour"
            type="number"
            defaultValue={product.pricePerHour}
            className="w-full border rounded-lg px-4 py-2 text-right"
          />
        </div>
      </div>
      <CityAndStreet onInputsChange={handleChildProps} />
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          defaultValue={product.hasHelmet}
          checked={isChecked}
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
          defaultValue={product.batteryWatts}
          className="w-full border rounded p-2"
        />
      </div>
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
      <div className="flex justify-end gap-4">
        <Button text="ביטול" variant="secondary" onClick={onCancel} />
        <Button
          text={pending ? <Loading /> : "שמור"}
          type="submit"
          className="w-full"
        />
      </div>
    </form>
  );
};

export default UpdateProductForm;
