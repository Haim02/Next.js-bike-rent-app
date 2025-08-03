// "use client";

import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "מוצרים",
  description: "מוצרים להשכרה",
  robots: {
    index: true,
    follow: true
  }
};

const ProfileLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // const [activeTab, setActiveTab] = useState("profile");

  return (
    <main className="flex flex-col w-full md:px-12 mt-24 gap-3">
      <div className="">
        <Suspense fallback={<h1>loading...</h1>}>{children}</Suspense>
      </div>
    </main>
  );
};

export default ProfileLayout;
