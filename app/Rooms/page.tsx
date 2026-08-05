"use client";

import { useEffect, useState } from "react";
import { Translations } from "../utils";
import { CreateBookingRequest, Room, ToastType } from "../types";
import {
  Popup,
  Loader,
  showToast,
  DatePicker,
  RazorpayCheckout,
  Filter,
} from "../components";
import { useBookRoom, useFetchAvailableRooms } from "../hooks";
import { useAppDispatch, useAppSelector } from "../lib";
import { setSelectedBooking } from "../lib/slices/BookingSlice";
import Image from "next/image";
import { selectRoom, setRoomFilter } from "../lib/slices/RoomSlice";

export default function RoomsPage() {
  const roomsMutation = useFetchAvailableRooms();
  const bookRoomMuation = useBookRoom();
  const dispatch = useAppDispatch();

  const { roomFilter } = useAppSelector(selectRoom);
  // const filterIcon = roomFilter
  //   ? "/filter-reset-svgrepo-com.svg"
  //   : "/filter-svgrepo-com.svg";
  const filterIcon='/filter-svgrepo-com.svg'

  const [showFilterPopup, setShowFilterPopup] = useState<boolean>(false);

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [checkIn, setCheckIn] = useState<Date>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const [checkOut, setCheckOut] = useState<Date>(() => {
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    return dayAfterTomorrow;
  });
  const [tomorrow] = useState<Date>(() => {
    const day = new Date();
    day.setDate(day.getDate() + 1);
    return day;
  });
  const [showRazorpayPopup, setShowRazorpayPopup] = useState(false);

  const fetchRooms = async () => {
    const checkoutDate = new Date(tomorrow);
    checkoutDate.setDate(checkoutDate.getDate() + 2);
    roomsMutation.mutate(
      {
        checkIn: roomFilter?.checkIn || tomorrow.toISOString(),
        checkOut: roomFilter?.checkOut || checkoutDate.toISOString(),
      },
      {
        onSuccess: (data) => {
          if (data?.error) {
            showToast(data.error, ToastType.ERROR);
          } else {
            setRooms(data?.rooms || []);
          }
        },
        onError: () => {
          showToast(Translations.INTERNAL_SERVER_ERROR, ToastType.ERROR);
        },
        onSettled: () => {
          setLoading(false);
        },
      },
    );
  };

  useEffect(() => {
    fetchRooms();
  }, [roomFilter]);

  useEffect(() => {
    dispatch?.(
      setRoomFilter?.({
        checkIn: new Date().toISOString(),
        checkOut: new Date(
          new Date().setDate(new Date().getDate() + 2),
        ).toISOString(),
      }),
    );
    fetchRooms();
  }, []);

  const handleBookRoom = (room: Room) => {
    setSelectedRoom(room);
    setShowDatePicker(true);
  };

  const handleSubmitButtonClick = () => {
    if (!selectedRoom?.id) {
      return;
    }

    setShowDatePicker(false);
    setLoading(true);
    const bookRoomReq: CreateBookingRequest = {
      roomId: selectedRoom.id,
      checkIn: checkIn?.toISOString(),
      checkOut: checkOut?.toISOString(),
    };

    bookRoomMuation.mutate(bookRoomReq, {
      onSuccess: (data) => {
        if (data?.error) {
          showToast(
            data?.error || Translations.INTERNAL_SERVER_ERROR,
            ToastType.ERROR,
          );
          return;
        }
        dispatch(setSelectedBooking(data));
        showToast(Translations.BOOKING_SUCCESS, ToastType.SUCCESS);
        setShowRazorpayPopup(true);
        fetchRooms();
      },
      onError: () => {
        showToast(Translations.INTERNAL_SERVER_ERROR, ToastType.ERROR);
      },
      onSettled: () => {
        setLoading(false);
      },
    });
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
          onChange={(date) => {
            if (date) {
              setCheckIn(date);
              if (checkOut <= date) {
                const nextDay = new Date(date);
                nextDay.setDate(nextDay.getDate() + 1);
                setCheckOut(nextDay);
              }
            }
          }}
          minDate={tomorrow}
          excludeDates={checkOut && tomorrow > checkOut ? [checkOut] : []}
        />

        <DatePicker
          label={Translations.CHECK_OUT}
          selectedDate={checkOut}
          onChange={(date) => {
            if (date) {
              setCheckOut(date);
            }
          }}
          minDate={checkIn}
          excludeDates={[checkIn]}
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
                positiveButtonContent={Translations.OK}
                negativeButtonContent={Translations.CLOSE}
                onPositiveButtonClick={handleSubmitButtonClick}
                onNegativeButtonClick={handleCancelButtonClick}
                isPositiveButtonDisabled={checkOut < checkIn}
              />
            )}

            {showRazorpayPopup && (
              <RazorpayCheckout
                onClose={() => setShowRazorpayPopup(false)}
                refreshData={fetchRooms}
              />
            )}

            {showFilterPopup && (
              <Filter onClose={() => setShowFilterPopup(false)} />
            )}

            <div className="mb-10 flex justify-between items-center">
              <h1 className="text-3xl md:text-4xl font-bold">
                Available Rooms
              </h1>
              <Image
                className="cursor-pointer"
                src={filterIcon}
                alt="filter"
                width={30}
                height={30}
                onClick={() => {
                  setShowFilterPopup(true);
                }}
              />
            </div>
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
