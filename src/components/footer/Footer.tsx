import Link from 'next/link';
import React from 'react';
import {
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';
import {
  GlobeAltIcon,
  ChatBubbleBottomCenterTextIcon,
  ShareIcon,
} from '@heroicons/react/24/solid';

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-slate-200 px-6 md:px-16 py-10 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h3 className="text-xl font-bold mb-3">Share&Ride</h3>
          <p className="text-sm text-slate-400">
            פלטפורמה שיתופית לנסיעות בטוחות, חסכוניות ונוחות. התחבר לקהילה.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">ניווט</h4>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-teal-400">דף הבית</Link></li>
            <li><Link href="/about" className="hover:text-teal-400">עלינו</Link></li>
            <li><Link href="/contact" className="hover:text-teal-400">צור קשר</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">צור קשר</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <EnvelopeIcon className="w-5 h-5" />
              <a href="mailto:info@shareandride.com" className="hover:text-teal-400">
                info@shareandride.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <PhoneIcon className="w-5 h-5" />
              <span>03-1234567</span>
            </li>
          </ul>

          <div className="flex gap-4 mt-4">
            <a href="#" aria-label="Facebook" className="hover:text-blue-400">
              <ShareIcon className="w-6 h-6" />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-pink-400">
              <ChatBubbleBottomCenterTextIcon className="w-6 h-6" />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-sky-400">
              <GlobeAltIcon className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-slate-700 pt-6 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} Share&Ride. כל הזכויות שמורות.
      </div>
    </footer>
  );
};

export default Footer;
