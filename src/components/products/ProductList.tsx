"use client";

import React, { useState, useEffect, useTransition } from "react";
import Button from "@/components/button/Button";
import Image from "next/image";
import Link from "next/link";
import {CldImage} from 'next-cloudinary'
import Loading from "../loading/Loading";

type Product = {
  id: number;
  title: string;
  image: string;
  price: number;
  type: string;
};

type Props = {
  filter: string;
  sort: string;
};

const ProductList = ({ filter, sort }: Props) => {
  const [pending, startTransition] = useTransition();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const imageLoader = (config) => {
            const urlStart = config.src.split
            return config.src
          }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      startTransition(async () => {
          const res = await fetch('api/product',
            {
              method: "GET",
            });
          let all = await res.json();

          let filtered = [...all];
          if (filter) filtered = filtered.filter((p) => p.type === filter);
          if (sort === "price-asc") filtered.sort((a, b) => a.pricePerDay - b.pricePerDay);
          if (sort === "price-desc") filtered.sort((a, b) => b.pricePerDay - a.pricePerDay);

          setProducts(filtered);
          setCurrentPage(1);
          setLoading(false);
        })
    };

    fetchData();
  }, [filter, sort]);

  const paginated = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(products.length / itemsPerPage);

  if (pending) return <Loading/>
  if (!products.length)
    return <p className="text-center mt-10">לא נמצאו מוצרים</p>;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {paginated.map((product) => (
          <div key={product.id} className="bg-white rounded shadow">
            <div className="relative w-full h-48">
              <CldImage
                loader={imageLoader}
                src={product.images[0]}
                alt={product.title}
                fill
                className="object-cover"
                quality={50}
              />
            </div>
            <div className="p-4 text-center">
              <h3>{product.title}</h3>
              <p>{product.pricePerHour} ₪</p>
              <Link href={`/product/${product.id}`}>
                <Button text="לפרטים" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 border rounded ${
              currentPage === i + 1
                ? "bg-teal-500 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </>
  );
};

export default ProductList;
