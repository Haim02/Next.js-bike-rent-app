"use client";

import React, { useState, useTransition } from "react";
import * as z from "zod";
import Button from "@/components/button/Button";
import { useRouter } from "next/navigation";
import Loading from "../loading/Loading";

const SigupSchema = z
  .object({
    name: z.string().min(1, "שדה זה הוא חובה").max(50),
    email: z.string().min(1, "שדה זה הוא חובה").email("אימייל לא חוקי"),
    phone: z.string().max(10, 'יותר מידיי מספרים'),
    password: z
      .string()
      .min(1, "שדה זה הוא חובה")
      .min(8, "סיסמה חייבת להיות לפחות 8 תווים"),
    confirmPassword: z
      .string()
      .min(1, "שדה זה הוא חובה")
      .min(8, "אימות סיסמה חייב לפחות 8 תווים"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "סיסמות לא תואמות",
    path: ["confirmPassword"],
  });

export type SigupData = z.infer<typeof SigupSchema>;

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [pending, startTransition] = useTransition();

  const handleSubmit = async (formDate: SigupData) => {
    const { name, email, phone,  password, confirmPassword } =
    Object.fromEntries(formDate);
    const result = SigupSchema.safeParse({
      name,
      email,
      phone,
      password,
      confirmPassword,
    });

    if (result.error) {
      const errors = result.error?.flatten().fieldErrors;
      setErrors(errors);
      return errors;
    } else {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
        }),
      });

      if (res.ok) {
        startTransition(() => {
          router.push("/login");
        });
      } else {
        throw new Error('משהו השתבש נסה שוב')
      }
    }
  };

  return (
    <section className="w-full max-w-md mx-auto mt-28 p-8 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold mb-6 text-center">הרשמה</h1>
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            שם מלא
          </label>
          <input
            type="text"
            required
            name="name"
            placeholder="שם"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          {errors?.name &&
            errors?.name.map((err) => (
              <small className="text-red-500 block">{err}</small>
            ))}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            אימייל
          </label>
          <input
            type="email"
            required
            name="email"
            placeholder="אימייל"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          {errors?.email &&
            errors?.email.map((err) => (
              <small className="text-red-500 block">{err}</small>
            ))}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            מספר פלאפון
          </label>
          <input
            type="text"
            required
            name="phone"
            placeholder="מספר פלאפון"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          {errors?.phone &&
            errors?.phone.map((err) => (
              <small className="text-red-500 block">{err}</small>
            ))}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            סיסמה
          </label>
          <input
            type="password"
            required
            name="password"
            placeholder="סיסמה"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          {errors?.password &&
            errors?.password.map((err) => (
              <small className="text-red-500 block">{err}</small>
            ))}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            אימות סיסמה
          </label>
          <input
            type="password"
            required
            name="confirmPassword"
            placeholder="אימות סיסמה"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          {errors?.confirmPassword &&
            errors?.confirmPassword.map((err) => (
              <small className="text-red-500 block">{err}</small>
            ))}
        </div>

        <Button text={pending ? <Loading /> : "הרשמה"} className="w-full" />
      </form>
    </section>
  );
};

export default RegisterForm;
