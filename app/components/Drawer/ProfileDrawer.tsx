"use client";

import Link from "next/link";
import { X, User, CalendarDays, LogOut } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/lib";
import { selectUser, setUser } from "@/app/lib/slices/UserSlice";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const ProfileDrawer = ({ open, onClose }: Props) => {
  const { user } = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300
          ${open ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-80
        bg-slate-900/90 backdrop-blur-xl
        border-l border-white/10
        shadow-2xl
        transition-transform duration-300
        z-50
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">My Profile</h2>

          <button onClick={onClose} className="text-white hover:text-red-400">
            <X />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center mt-8">
          <div className="w-20 h-20 rounded-full bg-indigo-600 flex justify-center items-center">
            <User size={40} color="white" />
          </div>

          <h3 className="mt-4 text-white text-lg font-semibold">
            {user?.userName}
          </h3>

          <p className="text-sm text-gray-400">{user?.userName}</p>
        </div>

        {/* Options */}

        <div className="mt-10 flex flex-col">
          <DrawerItem
            // href="/Profile"
            icon={<User size={20} />}
            title="Profile"
            onClick={onClose}
          />

          <DrawerItem
            href="/Bookings"
            icon={<CalendarDays size={20} />}
            title="My Bookings"
            onClick={onClose}
          />

          <button
            className="flex items-center gap-4 px-6 py-4 hover:bg-red-500/20 transition text-red-400"
            onClick={() => {
              sessionStorage.removeItem("authToken");
              dispatch(setUser(undefined));
              onClose?.();
            }}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

function DrawerItem({
  href,
  icon,
  title,
  onClick,
}: {
  href?: string;
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href || ""}
      onClick={onClick}
      className="flex items-center gap-4 px-6 py-4
      hover:bg-white/10
      transition
      text-white"
    >
      {icon}
      {title}
    </Link>
  );
}
