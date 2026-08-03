"use client";

import Link from "next/link";
import { AuthButton } from "../AuthButton";
import { selectUser } from "@/app/lib/slices/UserSlice";
import { useAppSelector } from "@/app/lib";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ open, onClose }: Props) => {
  const { user: userData } = useAppSelector(selectUser);

  if (!open) return null;

  return (
    <div className="md:hidden bg-black/40 backdrop-blur-xl px-6 pb-5 pt-2 flex flex-col gap-4">
      {userData && <AuthButton />}
      <Link href="/Rooms" onClick={onClose}>
        Rooms
      </Link>

      <Link href="/Bookings" onClick={onClose}>
        Bookings
      </Link>

      {!userData && <AuthButton />}
    </div>
  );
};
