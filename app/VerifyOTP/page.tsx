"use client";

import { useRef, useState } from "react";
import { useResendOTP, useVerifyOTP } from "../hooks";
import { selectUser } from "../lib/slices/UserSlice";
import { useAppSelector } from "../lib";
import { ToastType, VerifyEmailRequest, VerifyOTPRequest } from "../types";
import { showToast } from "../components";
import { Translations } from "../utils";

const OTP_LENGTH = 6;

const VerifyOTP = () => {
  const { mutate, isPending } = useVerifyOTP();
  const { signedUpUser: user } = useAppSelector(selectUser);
  const { mutate: resendOTP } = useResendOTP();

  const handleResendOTP = () => {
    if (!user?.id || !user?.userName || !user?.name) {
      return;
    }

    const req: VerifyEmailRequest = {
      userName: user?.userName,
      name: user?.name,
    };
    resendOTP(req, {
      onSuccess: () => {
        showToast(Translations.OTP_RESEND_SUCCESS, ToastType.SUCCESS);
      },
    });
  };

  const [otp, setOTP] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    // Take only the last digit typed
    const digit = value.slice(-1);

    const newOTP = [...otp];
    newOTP[index] = digit;

    setOTP(newOTP);

    // Move cursor to next box
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      // If current box is empty, move to previous box
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }

    // Optional: Arrow navigation
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pastedOTP = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pastedOTP) return;

    const newOTP = Array(OTP_LENGTH).fill("");

    pastedOTP.split("").forEach((digit, index) => {
      newOTP[index] = digit;
    });

    setOTP(newOTP);

    // Focus last filled box
    const lastIndex = Math.min(pastedOTP.length - 1, OTP_LENGTH - 1);

    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user?.id || !user?.userName) {
      return;
    }

    const OTP = otp.join("");

    if (OTP.length !== OTP_LENGTH) {
      showToast("Please enter the complete OTP", ToastType.ERROR);
      return;
    }

    const request: VerifyOTPRequest = {
      userId: user.id,
      userName: user.userName,
      OTP,
    };

    mutate(request, {
      onSuccess: () => {
        showToast(Translations.OTP_VERIFICATION_SUCCESS, ToastType.SUCCESS);
      },
      onError: (error) => {
        showToast(
          error?.message || Translations.INTERNAL_SERVER_ERROR,
          ToastType.ERROR,
        );
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-slate-100 via-white to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-white/10 border border-gray-200 dark:border-white/20 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Verify your email
          </h1>

          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
            We&apos;ve sent a 6-digit verification code to
          </p>

          <p className="mt-1 font-medium text-indigo-600 dark:text-indigo-300 break-all">
            {user?.userName}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* OTP Inputs */}
          <div className="flex justify-center gap-3 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="
                  w-12 h-14
                  sm:w-14 sm:h-16
                  text-center
                  text-2xl
                  font-semibold
                  rounded-xl
                  border
                  border-gray-300
                  dark:border-white/20
                  bg-white
                  dark:bg-white/10
                  text-gray-800
                  dark:text-white
                  outline-none
                  transition
                  focus:border-indigo-500
                  focus:ring-2
                  focus:ring-indigo-500/40
                "
              />
            ))}
          </div>

          {/* Verify button */}
          <button
            type="submit"
            disabled={isPending || otp.join("").length !== OTP_LENGTH}
            className="
              w-full
              py-3
              rounded-xl
              bg-indigo-600
              hover:bg-indigo-500
              disabled:bg-indigo-400
              disabled:cursor-not-allowed
              text-white
              font-semibold
              transition
            "
          >
            {isPending ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        {/* Resend */}
        <p className="text-center text-sm mt-6 text-gray-600 dark:text-gray-400">
          Didn&apos;t receive the code?
          <button
            type="button"
            className="ml-2 text-indigo-600 dark:text-indigo-300 font-medium hover:underline"
            onClick={handleResendOTP}
          >
            Resend OTP
          </button>
        </p>

        <p className="text-center text-xs mt-3 text-gray-500 dark:text-gray-500">
          OTP is valid for 10 minutes.
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;
