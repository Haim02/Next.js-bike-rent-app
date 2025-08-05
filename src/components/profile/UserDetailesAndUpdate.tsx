"use client";

import React, { useEffect, useState, useTransition } from "react";
import Button from "@/components/button/Button";
import { useSession } from "next-auth/react";
import Loading from "./../loading/Loading";

type Session = {
  user: {
    name: string;
    email: string;
    image?: undefined;
    id: string;
  };
};

const UserDetailesAndUpdate: React.FC = () => {
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState<any>();
  const [pending, startTransition] = useTransition();
  const { data: userSession, status } = useSession();
  let session: Session | any = userSession;


  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchUser = async () => {
      startTransition(async () => {
        try {
          const res = await fetch(
            `/api/profile/${session.user.id}`,
            {
              method: "GET",
            }
          );
          const data = await res.json();
          if (res.ok) {
            setUser(data);
          }
        } catch (err) {
          throw new Error("שגיאה בטעינת המוצר");
        }
      });
    };
    fetchUser();
  }, [status, session]);

  const handleSubmit = (formData: FormData) => {
    const body: any = Object.fromEntries(formData);

    setEditMode(false);

    body.name = user.name;
    body.email = user.email;
    body.phone = user.phone;
    body.updateAt = new Date();

    startTransition(async () => {
      await fetch(`/api/profile/${session.user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
      .catch((err) => {
        throw new Error("שגיאה בטעינת המוצר");
      });
    });
  };


  if (pending) {
    return <Loading />
  }
  if (!user) {
    return <Loading />
  }

    return (
      <section className="w-full max-w-3xl mx-auto py-10 mt-24 px-6">
        <h1 className="text-2xl font-bold mb-6 text-right">פרופיל משתמש</h1>

        {!editMode ? (
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-right mb-2">
              <strong>שם:</strong> {user.name}
            </p>
            <p className="text-right mb-4">
              <strong>אימייל:</strong> {user.email}
            </p>
            <p className="text-right mb-4">
              <strong>פלאפון:</strong> {user.phone}
            </p>
            <Button text="עדכן פרטים" onClick={() => setEditMode(true)} />
          </div>
        ) : (
          <form
            action={handleSubmit}
            className="bg-white shadow rounded-lg p-6 space-y-4"
          >
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 text-right">
                שם
              </label>
              <input
                type="text"
                defaultValue={user.name}
                className="w-full border rounded-lg px-4 py-2 text-right"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 text-right">
                אימייל
              </label>
              <input
                type="email"
                defaultValue={user.email}
                className="w-full border rounded-lg px-4 py-2 text-right"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 text-right">
                פלאפון
              </label>
              <input
                type="phone"
                defaultValue={user.phone}
                className="w-full border rounded-lg px-4 py-2 text-right"
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button
                text="ביטול"
                variant="secondary"
                onClick={() => setEditMode(false)}
              />
              <Button text={pending ? <Loading /> : "שמור"} type="submit" />
            </div>
          </form>
        )}
      </section>
    );
};

export default UserDetailesAndUpdate;
