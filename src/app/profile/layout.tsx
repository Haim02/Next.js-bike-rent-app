'use client';

import Sidebar from '@/components/sidebar/Sidebar';
import { Metadata } from 'next';
import React, { useState } from 'react';

export const metadata: Metadata = {
  title: "פרופיל",
  description: "אזור אישי",
  robots: {
    index: true,
    follow: true,
  },
};

const ProfileLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="flex w-full  md:px-12 mt-15 gap-8">
       <div className="border-l border-gray-200 pl-5">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default ProfileLayout;
