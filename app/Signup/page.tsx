"use client";
import Link from "next/link";
import { useState } from "react";
import { showToast } from "../components";
import { ToastType } from "../types";
import { Translations } from "../utils";
import { useRouter } from "next/navigation";

export default function Signup() {

  const router = useRouter();

  const [personDetails, setPersonDetails] = useState({
    emailId: "",
    contactNo: "",
    name: "",
  });
  const resetPersonDetails = () => {
    setPersonDetails({
      emailId: "",
      contactNo: "",
      name: "",
    });
  };
  const handleSubmitBtnClick = async (e) => {
    e.preventDefault();
    resetPersonDetails();
    try {
      const data = await fetch("/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: personDetails.name,
          userName: personDetails.emailId,
          password: personDetails.contactNo,
        }),
      });
      const parsedData = await data?.json();
      if (parsedData?.error) {
        showToast(parsedData?.error, ToastType.ERROR);
      } else {
        showToast(Translations.CUSTOMER_REGISTERED_SUCCESS, ToastType.SUCCESS);
        router.push("/Login");
      }
    } catch (error) {
      showToast(Translations.INTERNAL_SERVER_ERROR, ToastType.ERROR);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 via-white to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 px-4">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/80 dark:bg-white/10 border border-gray-200 dark:border-white/20 rounded-3xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Create Account
        </h2>

        <form className="space-y-5">
          <div>
            <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
              Full Name
            </label>
            <input
              onChange={(e) =>
                setPersonDetails({ ...personDetails, name: e?.target?.value })
              }
              value={personDetails.name}
              type="text"
              placeholder="Type your Name here"
              className="w-full px-4 py-2 rounded-xl bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
              Email
            </label>
            <input
              value={personDetails.emailId}
              onChange={(e) =>
                setPersonDetails({
                  ...personDetails,
                  emailId: e?.target?.value,
                })
              }
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-xl bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-600 dark:text-gray-300">
              Contact Number
            </label>
            <input
              value={personDetails.contactNo}
              onChange={(e) =>
                setPersonDetails({
                  ...personDetails,
                  contactNo: e?.target?.value,
                })
              }
              type="tel"
              placeholder="2334234"
              className="w-full px-4 py-2 rounded-xl bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-white"
            />
          </div>

          <button
            onClick={handleSubmitBtnClick}
            type="submit"
            className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-600 dark:text-gray-400">
          Already have an account?
          <Link
            href="/Login"
            className="ml-2 text-indigo-600 dark:text-indigo-300 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
