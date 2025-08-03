"use client";

import React, { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import bike from "../../../../public/images/bike.png";
import Loading from "@/components/loading/Loading";

interface Product {
  id: string;
  title: string;
  type: string;
  images: string[];
}

interface Message {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  date: string;
  hours: string[];
  content: string;
  fromUserId: string;
  product: Product;
  createdAt: string;
}

const statusColors = {
  PENDING: "bg-gray-100 text-gray-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default function MyProductRequestsPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/message/received");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        throw new Error("שגיאה בשליפת בקשות שהתקבלו");
      }
    });
  }, []);

  const toggleRow = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleStatusChange = async (
    id: string,
    newStatus: "APPROVED" | "REJECTED"
  ) => {
    try {
      startTransition(async () => {
        await fetch(`/api/message/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        });
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
      );
    } catch (err) {
      throw new Error("שגיאה בעדכון סטטוס:");
    }
  };

  if (pending) return <Loading />;
  if (!messages.length)
    return (
      <p className="text-center mt-10 text-gray-500">
        אין בקשות למוצרים שלך כרגע.
      </p>
    );

  return (
    <section className="max-w-5xl mx-auto py-10 px-6 mt-24">
      <h1 className="text-2xl font-bold mb-6 text-right">בקשות שהתקבלו</h1>
      <table className="w-full text-right border border-gray-200 rounded-xl overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">מוצר</th>
            <th className="p-3">סטטוס</th>
            <th className="p-3">תאריך</th>
            <th className="p-3">פעולה</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((req) => (
            <React.Fragment key={req.id}>
              <tr
                onClick={() => toggleRow(req.id)}
                className={`cursor-pointer border-b ${
                  statusColors[req.status]
                }`}
              >
                <td className="p-3 font-medium">
                  {req.product.type === "BICYCLE" ? "אופניים" : "קורקינט"}
                </td>
                <td className="p-3 text-sm">
                  {req.status === "PENDING"
                    ? "ממתין"
                    : req.status === "APPROVED"
                    ? "אושר"
                    : "נדחה"}
                </td>
                <td className="p-3 text-sm">{req.date}</td>
                <td className="p-3 text-sm space-x-2 space-x-reverse">
                  {req.status === "PENDING" && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(req.id, "APPROVED");
                        }}
                        className="bg-green-600 text-white px-3 py-1 ml-2 cursor-pointer rounded"
                      >
                        {pending ? <Loading /> : "אשר"}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(req.id, "REJECTED");
                        }}
                        className="bg-red-600 text-white px-3 py-1 cursor-pointer rounded"
                      >
                        {pending ? <Loading /> : "דחה"}
                      </button>
                    </>
                  )}
                  {req.status !== "PENDING" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(req.id, "PENDING");
                      }}
                      className="bg-gray-300 cursor-pointer text-gray-900 px-3 py-1 rounded"
                    >
                      {pending ? <Loading /> : "עדכן"}
                    </button>
                  )}
                </td>
              </tr>
              {expandedId === req.id && (
                <tr className="bg-gray-50">
                  <td colSpan={4} className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-start">
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
                      <div className="flex-1 text-sm text-gray-700 space-y-2">
                        <p>
                          <strong>הודעה מהמשתמש:</strong> {req.content}
                        </p>
                        <p>
                          <strong>תאריך:</strong> {req.date}
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
