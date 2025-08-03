'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import favican from '@/app/favicon.ico'
import bikeSvg from '../../../public/images/bike-svg.svg'
import {UserIcon} from "@heroicons/react/24/outline";
import Image from 'next/image';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname()
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const links = [
    {
        id: 1,
        path: '/',
        name: 'בית'
    },
    {
        id: 2,
        path: '/products',
        name: 'מוצרים'
    },
  ];

  const userLinks = [
    {
      id: 1,
      path: "/profile/my-requests",
      name: "בקשות ששלחתי",
    },
    {
      id: 2,
      path: "/profile/requests-to-me",
      name: "בקשות אליי",
    },
    {
      id: 3,
      path: "/profile/my-product",
      name: "המוצר שלי",
    },
    {
      id: 4,
      path: "/profile/upload-product",
      name: "העלאת מוצר",
    },
  ];

  const handleLogout = () => {
    document.cookie = '__Secure-next-auth.session-token=; Max-Age=0; path=/';
    document.cookie = "next-auth.session-token=; Max-Age=0; path=/";

    signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="shadow-md w-full z-30 fixed top-0 left-0">
      <div className="md:px-10 py-5 px-7 flex flex-row-reverse justify-between items-center bg-gradient-to-r from-teal-300 to-emerald-200">
        <Link href="/">
          <span className="text-xl font-bold">
            <Image
              src={bikeSvg}
              alt="bike"
              width={40}
              height={30}
              priority
              className="object-cover"
            />
          </span>
        </Link>

        <div
          className="md:hidden cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <Bars3Icon className="w-7 h-7 text-gray-800" />
        </div>

        <ul className="hidden md:flex md:items-center">
          {links.map((link) => (
            <li key={link.id} className="font-semibold ml-7">
              <Link
                className={`text-gray-500 hover:text-gray-700 duration-200  ${
                  pathname === link.path ? "text-gray-900" : ""
                }`}
                href={link.path}
              >
                {link.name}
              </Link>
            </li>
          ))}

          {session && (
            <li className="font-semibold ml-7">
              <Link
                className={`text-gray-500 hover:text-gray-700 duration-200  ${
                  pathname === "/profile" ? "text-gray-900" : ""
                }`}
                href="/profile"
              >
                <UserIcon className="w-5 h-5" />
              </Link>
            </li>
          )}

          <li className="font-semibold ml-7">
            {!session ? (
              <Link
                className={`text-gray-500 hover:text-gray-700 duration-200  ${
                  pathname === "/login" ? "text-gray-900" : ""
                }`}
                href="/login"
              >
                התחבר
              </Link>
            ) : (
              <button
                className="text-gray-500 hover:text-gray-700 duration-200"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                התנתק
              </button>
            )}
          </li>
        </ul>
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gradient-to-r from-teal-300 to-emerald-200 shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <span className="text-xl font-bold">תפריט</span>
          <button onClick={() => setIsOpen(false)}>
            <XMarkIcon className="w-6 h-6 text-gray-800 cursor-pointer" />
          </button>
        </div>
        <ul className="flex flex-col p-4 space-y-4 justify">
          {session && (
            <li className="font-semibold ml-7">
              <Link
                className={`text-gray-500 hover:text-gray-700 duration-200  ${
                  pathname === "/profile" ? "text-gray-900" : ""
                }`}
                href="/profile"
              >
                <UserIcon className="w-5 h-5" />
              </Link>
            </li>
          )}

          {links.map((link) => (
            <li key={link.id}>
              <Link
                className={`text-gray-500 hover:text-gray-700 font-semibold ${
                  pathname === link.path ? "text-gray-900" : ""
                }`}
                href={link.path}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}

          {session &&
            userLinks.map((link) => (
              <li key={link.id}>
                <Link
                  className={`text-gray-500 hover:text-gray-700 font-semibold ${
                    pathname === link.path ? "text-gray-900" : ""
                  }`}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}

          <li className="font-semibold ml-7">
            {!session ? (
              <Link
                className={`text-gray-500 hover:text-gray-700 duration-200  ${
                  pathname === "/login" ? "text-gray-900" : ""
                }`}
                href="/login"
              >
                התחבר
              </Link>
            ) : (
              <button
                className="text-gray-500 hover:text-gray-700 duration-200"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                התנתק
              </button>
            )}
          </li>
        </ul>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-opacity-0 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
