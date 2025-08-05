"use client";

import React, { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import Button from "@/components/button/Button";
import UpdateProductForm from "@/components/updateProductForm/UpdateProductForm";
import { useSession } from "next-auth/react";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading/Loading";

interface Product {
  id: number;
  title: string;
  model: string;
  description: string;
  pricePerDay: number;
  pricePerHour: number;
  hasHelmet: boolean
  images: string[];
  city?: string;
  street?: string;
  houseNumber?: number | string;
}

const ProductDetailsAndUpdate: React.FC = () => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editMode, setEditMode] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") {
      console.log("waiting for session...");
    }

    const fetchProduct = async () => {
      startTransition(async () => {
        try {
          const res = await fetch("/api/profile/product", {
            method: "GET",
          });
          const data = await res.json();
          if (res.ok) {
            setProduct(data);
          }
        } catch (err) {
          throw new Error("שגיאה בטעינת המוצר");
        }
      });
    };

    fetchProduct();
  }, [session, status]);

  const handleDelete = async () => {
    if (confirm("האם אתה בטוח שברצונך למחוק את המוצר?")) {
      startTransition(async () => {
        const res = await fetch("/api/profile/product", {
          method: "DELETE",
        });
        if (res.ok) {
          alert("המוצר נמחק בהצלחה");
          router.push("/profile/upload-product");
        } else {
          throw new Error('שגיעה בהעלאת המוצר נסה שנית מאוחר יותר');
        }
      });
    }
  };

  if (status !== "authenticated") return <Loading />;
  if (!product && pending) return <Loading />;
  if (!product)
    return <p className="text-center mt-10 text-gray-500">אין מוצרים להצגה.</p>;


  return (
    <section className="w-full max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold mb-6 text-right">פרטי המוצר</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="relative w-full h-64 rounded-xl overflow-hidden shadow">
            <Image
              src={product.images?.[0] || "/images/placeholder.jpg"}
              alt="תמונה של המוצר"
              fill
              className="object-fill"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {product.images?.slice(1).map((img, idx) => (
              <div
                key={idx}
                className="relative w-full h-24 rounded overflow-hidden"
              >
                <Image
                  src={img}
                  alt={`תמונה ${idx + 2}`}
                  fill
                  className="object-fill"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="text-right space-y-4">
          <p>
            <strong>שם המוצר:</strong> {product.title}
          </p>
          <p>
            <strong>תיאור:</strong> {product.description}
          </p>
          <p>
            <strong>דגם:</strong> {product.model}
          </p>
          <p>
            <strong>קסדה:</strong>{" "}
            {product.hasHelmet ? (
              <CheckIcon className="w-6 h-6 text-green-400 inline" />
            ) : (
              <XMarkIcon className="w-6 h-6 text-red-400 inline" />
            )}
          </p>
          <p>
            <strong>מחיר ליום:</strong> {product.pricePerDay} ₪
          </p>
          <p>
            <strong>מחיר לשעה:</strong> {product.pricePerHour} ₪
          </p>
          <p>
            <strong>עיר:</strong> {product.city}
          </p>
          <p>
            <strong>רחוב:</strong> {product.street}
          </p>
          <p>
            <strong>מספר:</strong> {product.houseNumber}
          </p>
          <div className="flex gap-4">
            <Button text="עדכן פרטים" onClick={() => setEditMode(true)} />
            <Button
              text={pending ? <Loading /> : "מחק מוצר"}
              variant="secondary"
              onClick={handleDelete}
            />
          </div>
        </div>
      </div>
      {product && editMode && (
        <UpdateProductForm
          productId={product.id}
          onCancel={() => setEditMode(false)}
        />
      )}
    </section>
  );
};

export default ProductDetailsAndUpdate;
