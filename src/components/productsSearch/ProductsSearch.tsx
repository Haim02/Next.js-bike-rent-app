import React, { useState } from 'react'

const ProductsSearch = () => {
    const [sortBy, setSortBy] = useState<string>('');
    const [filter, setFilter] = useState<string>('');

  return (
       <div className="border-1 bg-white rounded-xl py-4 px-3 md:flex-row justify-between shadow-lg overflow-hiddenitems-center mb-8 gap-4">
       <div className="flex gap-4 w-full md:w-auto">
         <select
           value={filter}
           onChange={(e) => setFilter(e.target.value)}
           className="border border-gray-300 rounded-md px-4 py-2"
         >
           <option value="">סנן לפי</option>
           <option value="bike">אופניים</option>
           <option value="scooter">קורקינטים</option>
         </select>

         <select
           value={sortBy}
           onChange={(e) => setSortBy(e.target.value)}
           className="border border-gray-300 rounded-md px-4 py-2"
         >
           <option value="">מיין לפי</option>
           <option value="price-asc">מחיר מהנמוך לגבוה</option>
           <option value="price-desc">מחיר מהגבוה לנמוך</option>
         </select>
       </div>
     </div>
  )
}

export default ProductsSearch
