"use client";
import React from "react";

type Props = {
  onFilterChange: (type: string) => void;
  onSortChange: (sort: string) => void;
};

const FilterAndSort = ({ onFilterChange, onSortChange }: Props) => {
  return (
    <div className="flex gap-4 mb-6">
      <select
        onChange={(e) => onFilterChange(e.target.value)}
        className="border px-4 py-2 rounded"
      >
        <option value="">הצג הכל</option>
        <option value="SCOOTER">קורקינט</option>
        <option value="BICYCLE">אופניים</option>
      </select>
      <select
        onChange={(e) => onSortChange(e.target.value)}
        className="border px-4 py-2 rounded"
      >
        <option value="">ללא מיון</option>
        <option value="price-asc">מחיר עולה</option>
        <option value="price-desc">מחיר יורד</option>
      </select>
    </div>
  );
};

export default FilterAndSort;
