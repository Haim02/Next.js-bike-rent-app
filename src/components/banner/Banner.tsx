import Image from 'next/image';
import React from 'react';
import scooter from '../../../public/images/banner-scooter.png';
import Button from '@/components/button/Button';
import Link from 'next/link';

const Banner = () => {
  return (
    <section className="w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-10 md:py-16 bg-gradient-to-r from-teal-300 to-emerald-200 rounded-xl shadow-lg overflow-hidden">
      <div className="w-full md:w-1/2 text-center md:text-right">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
          Share&Ride
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8">
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-end">
          <Link href="/login">
            <Button text="כניסה" />
          </Link>
          <Link href="/register">
            <Button text="הרשמה" variant="secondary" />
          </Link>
        </div>
      </div>

      <div className="hidden md:block w-1/2 relative h-[300px]">
        <Image
          src={scooter}
          fill
          priority
          alt="Scooter Banner Image"
          className="object-contain animate-fade-in"
        />
      </div>
    </section>
  );
};

export default Banner;