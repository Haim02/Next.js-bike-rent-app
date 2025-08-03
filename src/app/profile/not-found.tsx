"use client";

import React, { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

type propsType = {
  error: Error & { Digest?: String };
  reset: () => void;
};

const error = ({ error, reset }: propsType) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center text-center px-6 py-20">
      <XMarkIcon className="w-16 h-16 text-red-500 mb-6" />
      <h1 className="text-3xl font-bold text-gray-800 mb-4">404 דף לא נמצא</h1>
      <p className="text-gray-600 mb-6">{error.message}</p>
    </section>
  );
};

export default error;
