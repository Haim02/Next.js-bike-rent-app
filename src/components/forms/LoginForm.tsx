"use client";

import React, { useState, useTransition } from "react";
import Button from "@/components/button/Button";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Loading from "../loading/Loading";

const LoginSchema = z.object({
  email: z.string().min(1, "שדה זה חובה").email("אימייל לא תקין"),
  password: z
    .string()
    .min(1, "שדה זה חובה")
    .min(8, "סיסמה חייבת להיות לפחות 8 תווים"),
});


const LoginForm: React.FC = () => {
  const router = useRouter();
  const [error, setError] = useState<String>();
  const [pending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    const email = formData.get('email')
    const password = formData.get("password");
    if(!email || !password) {
      setError("אימייל או סיסמה חסרים");
      return
    }

    startTransition(async () => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

      if (res?.ok) {
        router.push("/");
      } else {
        setError("אימייל או סיסמה שגויים");
      }
    })
  };

  return (
    <section className="w-full max-w-md mx-auto mt-5
     p-8 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold mb-6 text-center">התחברות</h1>
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            אימייל
          </label>
          <input
            type="email"
            name="email"
            placeholder="אימייל"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            סיסמה
          </label>
          <input
            type="password"
            name="password"
            placeholder="סיסמה"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

        </div>
        <small className="text-red-500 block">{error}</small>
        <Button text={pending ? <Loading /> : "התחברות"} className="w-full" />

        <div className="flex justify-between text-sm mt-2">
          <a href="/register" className="text-teal-600 hover:underline">
            אין לך חשבון? הרשמה
          </a>
          <a href="/forgot-password" className="text-teal-600 hover:underline">
            שכחת סיסמה?
          </a>
        </div>
      </form>
    </section>
  );
};

export default LoginForm;
