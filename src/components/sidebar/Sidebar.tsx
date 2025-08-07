import React from "react";
import {
  UserIcon,
  PaperAirplaneIcon,
  InboxArrowDownIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const pathname = usePathname();

  return (
    <aside className="hidden w-48 md:flex flex-col gap-4 justify-end text-right">
      <button
        onClick={() => setActiveTab("profile")}
        className={`flex  gap-2 text-sm ${
          pathname === "/profile"
            ? "text-teal-700 font-bold border rounded-md p-2 bg-gray-100"
            : "text-gray-600 hover:text-teal-600"
        }`}
      >
        <UserIcon className="w-5 h-5" />
        <Link href="/profile">
          <span>פרטים אישיים</span>
        </Link>
      </button>

      <button
        onClick={() => setActiveTab("myRequests")}
        className={`flex gap-2 text-sm ${
          pathname === "/profile/my-requests"
            ? "text-teal-700 font-bold border rounded-md p-2 bg-gray-100"
            : "text-gray-600 hover:text-teal-600"
        }`}
      >
        <PaperAirplaneIcon className="w-5 h-5" />
        <Link href="/profile/my-requests">
          <span>בקשות שנשלחו</span>
        </Link>
      </button>

      <button
        onClick={() => setActiveTab("requestsToMe")}
        className={`flex gap-2 text-sm ${
          pathname === "/profile/requests-to-me"
            ? "text-teal-700 font-bold border rounded-md p-2 bg-gray-100"
            : "text-gray-600 hover:text-teal-600"
        }`}
      >
        <InboxArrowDownIcon className="w-5 h-5" />
        <Link href="/profile/requests-to-me">
          <span>בקשות שהתקבלו</span>
        </Link>
      </button>

      <button
        onClick={() => setActiveTab("myItems")}
        className={`flex gap-2 text-sm ${
          pathname === "/profile/my-product"
            ? "text-teal-700 font-bold border rounded-md p-2 bg-gray-100"
            : "text-gray-600 hover:text-teal-600"
        }`}
      >
        <CubeIcon className="w-5 h-5" />
        <Link href="/profile/my-product">
          <span>המוצרים שלי</span>
        </Link>
      </button>

      <button
        onClick={() => setActiveTab("myItems")}
        className={`flex gap-2 text-sm ${
          pathname === "/profile/upload-product"
            ? "text-teal-700 font-bold border rounded-md p-2 bg-gray-100"
            : "text-gray-600 hover:text-teal-600"
        }`}
      >
        <CubeIcon className="w-5 h-5" />
        <Link href="/profile/upload-product">
          <span>פרסום מוצר</span>
        </Link>
      </button>
    </aside>
  );
};

export default Sidebar;
