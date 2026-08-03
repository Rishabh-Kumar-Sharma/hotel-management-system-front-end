"use client";
import Link from "next/link";
import { useState } from "react";
import { useLogin } from "../hooks";
import { showToast } from "../components";
import { ToastType } from "../types";
import { Translations } from "../utils";

const Page = () => {
  const loginMutation = useLogin();

  const [personDetails, setPersonDetails] = useState({
    email: "",
    password: "",
  });

  const clearPersonDetails = () => {
    setPersonDetails({
      email: "",
      password: "",
    });
  };
  const handleSubmitBtnClick = async (e) => {
    e.preventDefault();
    clearPersonDetails();
    loginMutation.mutate(personDetails, {
      onSuccess: (data) => {
        if (data?.error) {
          showToast(data?.error, ToastType.ERROR);
          return;
        }
        showToast(Translations.CUSTOMER_LOGIN_SUCCESS, ToastType.SUCCESS);
      },
      onError: () => {
        showToast(Translations.INTERNAL_SERVER_ERROR, ToastType.ERROR);
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 via-white to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 px-4">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/80 dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-3xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Welcome Back
        </h2>

        <form className="space-y-5">
          <div>
            <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
              Email
            </label>
            <input
              onChange={(e) =>
                setPersonDetails({ ...personDetails, email: e?.target?.value })
              }
              value={personDetails.email}
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-xl bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
              Password
            </label>
            <input
              onChange={(e) =>
                setPersonDetails({
                  ...personDetails,
                  password: e?.target?.value,
                })
              }
              value={personDetails.password}
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-xl bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-white"
            />
          </div>

          <button
            onClick={handleSubmitBtnClick}
            disabled={loginMutation.isPending}
            type="submit"
            className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?
          <Link
            href="/Signup"
            className="ml-2 text-indigo-600 dark:text-indigo-300 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Page;
