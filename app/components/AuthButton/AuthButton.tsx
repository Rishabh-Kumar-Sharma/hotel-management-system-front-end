"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { useState } from "react";

import { useAppSelector } from "@/app/lib";
import { selectUser } from "@/app/lib/slices/UserSlice";
import { ProfileDrawer } from "../Drawer";

interface Props {
  onClick?: () => void;
}

export const AuthButton = ({ onClick }: Props) => {
  const { user } = useAppSelector(selectUser);

  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!user) {
    return (
      <Link
        href="/Login"
        onClick={onClick}
        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition"
      >
        Login / Signup
      </Link>
    );
  }

  return (
    <>
      <button
        onClick={() => {
          onClick?.();
          setDrawerOpen(true);
        }}
        className="w-10 h-10 rounded-full bg-indigo-600 flex justify-center items-center hover:bg-indigo-500 transition"
      >
        <User size={20} />
      </button>

      <ProfileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};
