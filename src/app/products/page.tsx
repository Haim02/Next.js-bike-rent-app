"use client";
import React, { useState } from "react";
import ProductList from "@/components/products/ProductList";
import FilterAndSort from "./../../components/products/FilterAndSort";

const ProductsPage = () => {
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");

  return (
    <section className="px-6 md:px-10 py-12">
      <h1 className="text-2xl font-bold text-right mb-6">כל המוצרים</h1>
      <FilterAndSort onFilterChange={setFilter} onSortChange={setSort} />
      <ProductList filter={filter} sort={sort} />
    </section>
  );
};

export default ProductsPage;
