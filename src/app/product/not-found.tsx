import React from "react";
import Link from "next/link";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const NotFound: React.FC = () => {
  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center text-center px-6 py-20">
      <ExclamationTriangleIcon className="w-16 h-16 text-yellow-500 mb-6" />
      <h1 className="text-3xl font-bold text-gray-800 mb-4">מוצר לא נמצא</h1>
      <p className="text-gray-600 mb-6">
        נראה שהמוצר שהזנת לא קיים או שהדף הועבר למיקום אחר.
      </p>
      <Link href="/">
        <span className="text-teal-600 hover:underline">חזור לדף הבית</span>
      </Link>
    </section>
  );
};

export default NotFound;
