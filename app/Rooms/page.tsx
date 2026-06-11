"use client";

import { useEffect, useState } from "react";
import { Translations } from "../utils";
import {
  ApiErrorCodesEnum,
  CreateBookingRequest,
  CreateBookingResponse,
  FetchAvailableRoomsRequest,
  FetchAvailableRoomsResponse,
  Room,
  ToastType,
} from "../types";
import { Popup, Loader, showToast, DatePicker } from "../components";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export default function RoomsPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);

  const fetchRooms = async () => {
    try {
      const availableRoomReq: FetchAvailableRoomsRequest = {
        checkIn: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"), // current date and time
        checkOut: format(
          new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          "yyyy-MM-dd'T'HH:mm:ss",
        ), // +2 days,
      };
      const res = await fetch("/api/room/fetchAvailableRooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(availableRoomReq),
      });
      const data: FetchAvailableRoomsResponse = await res?.json();
      if (data?.error) {
        showToast(data.error, ToastType.ERROR);
      } else {
        setRooms(data?.rooms || []);
      }
    } catch (err) {
      console.error("Failed to fetch rooms", err);
      showToast(Translations.INTERNAL_SERVER_ERROR, ToastType.ERROR);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRooms();
  }, []);

  const handleBookRoom = (room: Room) => {
    setSelectedRoom(room);
    setShowDatePicker(true);
  };

  const handleSubmitButtonClick = () => {
    if (checkIn === null || checkOut === null) {
      return;
    }
    setShowDatePicker(false);
    setLoading(true);
    const bookRoomReq: CreateBookingRequest = {
      roomId: selectedRoom?.id || 1,
      checkIn: format(checkIn, "yyyy-MM-dd'T'HH:mm:ss"),
      checkOut: format(checkOut, "yyyy-MM-dd'T'HH:mm:ss"),
    };
    const bookRoom = async () => {
      try {
        const res = await fetch("/api/booking/bookRoom", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authToken: `${sessionStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(bookRoomReq),
        });
        const data: CreateBookingResponse = await res?.json();
        if (data?.error) {
          if (
            data.errorCode === ApiErrorCodesEnum.UNAUTHORIZED_ACCESS ||
            data.errorCode === ApiErrorCodesEnum.SESSION_TIMEOUT
          ) {
            router.push("/Login");
          }
          showToast(
            data?.error || Translations.INTERNAL_SERVER_ERROR,
            ToastType.ERROR,
          );
        } else {
          showToast(Translations.BOOKING_SUCCESS, ToastType.SUCCESS);
          router.push("/Bookings");
        }
      } catch (error) {
        console.error("Error booking room", error);
        showToast(Translations.INTERNAL_SERVER_ERROR, ToastType.ERROR);
      } finally {
        setLoading(false);
      }
    };

    bookRoom();
  };
  const handleCancelButtonClick = () => {
    setShowDatePicker(false);
  };

  const renderDatePickerPopup = () => {
    return (
      <div className="flex flex-col gap-5">
        <DatePicker
          label={Translations.CHECK_IN}
          selectedDate={checkIn}
          onChange={setCheckIn}
          minDate={new Date()}
          excludeDates={checkOut && new Date() > checkOut ? [checkOut] : []}
        />

        <DatePicker
          label={Translations.CHECK_OUT}
          selectedDate={checkOut}
          onChange={setCheckOut}
          minDate={checkIn || new Date()}
          excludeDates={checkIn ? [checkIn] : []}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-28 px-6 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <Loader />
        ) : (
          <>
            {showDatePicker && (
              <Popup
                content={renderDatePickerPopup()}
                positiveButtonContent={Translations.YES}
                negativeButtonContent={Translations.NO}
                onPositiveButtonClick={handleSubmitButtonClick}
                onNegativeButtonClick={handleCancelButtonClick}
                isPositiveButtonDisabled={checkIn === null || checkOut === null}
              />
            )}
            <h1 className="text-3xl md:text-4xl font-bold mb-10">
              Available Rooms
            </h1>
            {rooms?.length === 0 ? (
              <p className="text-gray-400">No rooms available.</p>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {rooms?.map((room) => (
                  <div
                    key={room.id}
                    className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg hover:scale-105 transition"
                  >
                    <h3 className="text-xl font-semibold mb-2 text-indigo-300">
                      Room #{room.roomNumber}
                    </h3>

                    <p className="text-gray-300 text-sm mb-1">
                      Type: {room.roomType}
                    </p>
                    <p className="text-gray-300 text-sm mb-1">
                      Capacity: {room.capacity} Guests
                    </p>
                    <p className="text-gray-300 text-sm mb-4">
                      ₹{room.pricePerNight} / night
                    </p>

                    <button
                      disabled={loading}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 py-2 rounded-lg font-medium transition"
                      onClick={() => handleBookRoom(room)}
                    >
                      Book Room
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
