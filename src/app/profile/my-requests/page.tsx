"use client";

import React, { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import bike from "../../../../public/images/bike.png";
import Loading from "@/components/loading/Loading";
import Link from "next/link";

interface Message {
  id: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  date: string;
  hours: string[];
  content: String;
  fromUserId: String;
  toUserId: String;
  productId: String;
  createdAt: Date;
}

const statusColors = {
  PENDING: "bg-gray-100 text-gray-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

const statusMessage = (status: string) => {
  if (status === "PENDING") {
    return "ממתין";
  } else {
    if (status === "APPROVED") {
      return "אושר";
    } else {
      if (status === "REJECTED") {
        return "נדחה";
      }
    }
  }
};

const productType = (type: string) => {
  if (type === "BICYCLE") {
    return "אופניים";
  } else {
    return "קורקינט";
  }
};

export default function MyRequestsPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const getMessages = () => {
      startTransition(async () => {
        await fetch("/api/message")
          .then((res) => res.json())
          .then((data: Message[]) => {
            setMessages(data);
          })
          .catch((err) => {
            throw new Error("שגיעה בטעינת ההודעות");
          });
      });
    };
    getMessages();
  }, []);

  const toggleRow = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filtered = messages.filter((r) =>
    filterStatus ? r.status === filterStatus : true
  );
  const sorted = filtered.sort((a, b) => {
    if (sortOrder === "date-desc") return b.date.localeCompare(a.date);
    if (sortOrder === "date-asc") return a.date.localeCompare(b.date);
    return 0;
  });

  if (pending) return <Loading />;
  if (messages.length === 0)
    return <p className="text-center mt-10 text-gray-500">אין בקשות להצגה.</p>;

  return (
    <section className="max-w-5xl mx-auto py-10 px-6 mt-24">
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4 text-right">
        <h1 className="text-2xl font-bold">בקשות ששלחתי</h1>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border px-4 py-2 rounded"
          >
            <option value="">הצג הכל</option>
            <option value="PENDING">ממתין</option>
            <option value="APPROVED">אושרו</option>
            <option value="REJECTED">נדחו</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border px-4 py-2 rounded"
          >
            <option value="">מיין לפי</option>
            <option value="date-desc">תאריך – מהחדש לישן</option>
            <option value="date-asc">תאריך – מהישן לחדש</option>
          </select>
        </div>
      </div>

      <table className="w-full text-right border border-gray-200 rounded-xl overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">מוצר</th>
            <th className="p-3">סטטוס</th>
            <th className="p-3">תאריך</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((req) => (
            <React.Fragment key={req.id}>
              <tr
                onClick={() => toggleRow(req.id)}
                className={`cursor-pointer border-b ${
                  statusColors[req.status]
                }`}
              >
                <td className="p-3 text-sm">{productType(req.product.type)}</td>
                <td className="p-3 text-sm"> {statusMessage(req.status)}</td>
                <td className="p-3 text-sm">{req.date}</td>
              </tr>
              {expandedId === req.id && (
                <tr className="bg-gray-50">
                  <td colSpan={3} className="p-4">
                    <div className="flex flex-col md:flex-row items-start gap-4">
                      <div className="w-full md:w-40 h-28 relative">
                        <Link href={`/product/${req.product.id}`}>
                          <Image
                            src={req.product.images[0] || bike}
                            alt={req.product.title}
                            fill
                            className="object-cover rounded-md"
                          />
                        </Link>
                      </div>
                      <div className="flex-1 space-y-2 text-sm text-gray-700">
                        <p>
                          <strong>הודעה:</strong> {req.content}
                        </p>
                        <p>
                          <strong>תאריך בקשה:</strong> {req.date}
                        </p>
                        <p>
                          <strong>שעות:</strong> {req.hours.join(", ")}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </section>
  );
}
