"use client";
import React, { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import {
  TagIcon,
  XMarkIcon,
  CheckIcon,
  CpuChipIcon,
  Battery50Icon,
} from "@heroicons/react/24/outline";
import { notFound } from "next/navigation";
import imageNotFound from "../../../public/images/imageNotFound.jpg";
import Loading from "@/components/loading/Loading";
import SchedulePicker from "@/components/ScheduleForm/SchedulePicker";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  pricePerDay: number;
  pricePerHour: number;
  model: string;
  hasHelmet: boolean;
  batteryWatts: number;
  ownerId: number;
  images: string[] | any[];
}

const ProductDetails = (productId: any) => {
  const id = productId.productId;
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [pending, startTransition] = useTransition();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const getProduct = async () => {
      startTransition(async () => {
        const res = await fetch(`http://localhost:3000/api/product/${id}`);
        if (res.status === 404) {
          return notFound();
        }
        if (!res.ok) {
          throw new Error("השרת לא נמצא");
        }
        const data = await res.json();
        setProduct(data);
      });
    };
    getProduct();
  }, [id]);

  if (!product) return <Loading />;

  return (
    <section className="w-full px-6 md:px-12 py-10 mt-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          {pending && <Loading />}
          <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow">
            <Image
              src={product.images[0] || imageNotFound}
              alt={product.title || "image"}
              fill
              className="object-fill"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {product.images.slice(1).map((img, i) => (
              <div
                key={i}
                className="relative w-full h-24 rounded overflow-hidden"
              >
                <Image
                  src={img || imageNotFound}
                  alt={`תמונה ${i + 2}`}
                  fill
                  className="object-fill"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="text-right">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {product.title}
          </h1>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            {product.description}
          </p>

          <ul className="text-gray-700 mb-8 space-y-3 text-sm text-right">
            <li className="flex items-center gap-2 justify-end flex-row-reverse">
              <TagIcon className="w-5 h-5 text-teal-600" />
              <span>
                <strong>מחיר ליום:</strong> {product.pricePerDay} ₪
              </span>
            </li>
            <li className="flex items-center gap-2 justify-end flex-row-reverse">
              <TagIcon className="w-5 h-5 text-teal-600" />
              <span>
                <strong>מחיר לשעה:</strong> {product.pricePerHour} ₪
              </span>
            </li>
            <li className="flex items-center gap-2 justify-end flex-row-reverse">
              <CpuChipIcon className="w-5 h-5 text-teal-600" />
              <span>
                <strong>דגם:</strong> {product.model}
              </span>
            </li>
            <li className="flex items-center gap-2 justify-end flex-row-reverse">
              {product.hasHelmet ? (
                <CheckIcon className="text-green-400 w-5 h-5" />
              ) : (
                <XMarkIcon className="text-red-600 w-5 h-5" />
              )}
              <span>
                <strong>קסדה:</strong>{" "}
              </span>
            </li>
            <li className="flex items-center gap-2 justify-end flex-row-reverse">
              <Battery50Icon className="w-5 h-5 text-teal-600" />
              <span>
                <strong>ווט סוללה:</strong> {product.batteryWatts}W
              </span>
            </li>
            <p>
              <strong>עיר:</strong> {product.city}
            </p>
            <p>
              <strong>רחוב:</strong> {product.street}
            </p>
            <p>
              <strong>מספר:</strong> {product.houseNumber}
            </p>
          </ul>

          {!showRequestForm && (
            <div className="mt-4">
              <SchedulePicker productId={id} product={product} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
