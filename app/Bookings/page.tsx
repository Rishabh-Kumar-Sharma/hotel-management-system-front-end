"use client";
import { useEffect, useRef, useState } from "react";
import {
  DatePicker,
  Loader,
  Popup,
  RazorpayCheckout,
  RoomAvailability,
  showToast,
} from "../components";
import {
  Booking,
  BookingStatus,
  GetRoomAvailabilityRequest,
  ToastType,
} from "../types";
import { Translations } from "../utils";
import QRCode from "qrcode";
import { useCheckAvailability, useFetchBookings } from "../hooks";
import { useAppDispatch, useAppSelector } from "../lib";
import {
  selectBooking,
  setSelectedBooking,
} from "@/app/lib/slices/BookingSlice";
import { useCancelBooking } from "../hooks/useCancelBooking";
import { Pencil } from "lucide-react";
import { getBusinessTimeZone, getCountryLocale } from "../utils";

const Bookings = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hasExpiredBookingRef = useRef(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<
    number | undefined
  >();
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showQRCodePopup, setShowQRCodePopup] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking>();
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const [showCheckoutPopup, setShowCheckoutPopup] = useState<boolean>(false);

  const { selectedBooking } = useAppSelector(selectBooking);

  const [editCheckIn, setEditCheckIn] = useState<Date>(
    new Date(selectedBooking?.checkIn || new Date()),
  );
  const [editCheckOut, setEditCheckOut] = useState<Date>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return new Date(selectedBooking?.checkOut || tomorrow);
  });
  const [tomorrow] = useState<Date>(() => {
    const day = new Date();
    day.setDate(day.getDate() + 1);
    return day;
  });

  const [editBooking, setEditBooking] = useState<Booking | undefined>();

  const dispatch = useAppDispatch();

  const locale = getCountryLocale();
  const businessTimeZone = getBusinessTimeZone();

  const { isError, data, isLoading, refetch } = useFetchBookings();
  const bookings = data?.bookings || [];

  const cancelBooking = useCancelBooking();
  const { isPending } = cancelBooking || {};

  const checkAvailabilityMutation = useCheckAvailability();
  const { isPending: isRoomAvailabilityPending } =
    checkAvailabilityMutation || {};

  useEffect(() => {
    if (data?.error) {
      showToast(data?.error, ToastType.ERROR);
      return;
    } else if (isError) {
      showToast(Translations.INTERNAL_SERVER_ERROR, ToastType.ERROR);
    }
  }, [data, isError]);

  useEffect(() => {
    const getQRCodeData = () => {
      const {
        checkIn,
        checkOut,
        pricePerNight,
        roomNumber,
        roomType,
        bookingStatus,
      } = currentBooking || {};
      return [
        "Booking Details:",
        `Room Number: ${roomNumber}`,
        `Room Type: ${roomType}`,
        `Check In: ${new Date(checkIn || "").toLocaleDateString(locale, { timeZone: businessTimeZone })}`,
        `Check Out: ${new Date(checkOut || "").toLocaleDateString(locale, { timeZone: businessTimeZone })}`,
        `Price/Night: ₹${pricePerNight}`,
        `Status: ${bookingStatus}`,
      ].join("\n");
    };
    if (canvasRef?.current) {
      QRCode.toCanvas(canvasRef.current, getQRCodeData(), (error) => {
        console.log("Error occured in QRCode: ", error);
      });
    }
  }, [showQRCodePopup, currentBooking, locale]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const hasExpiredBooking = bookings?.some(
      (booking) =>
        booking?.bookingStatus === BookingStatus.CREATED &&
        booking?.expiresAt &&
        new Date(booking?.expiresAt).getTime() <= currentTime,
    );
    if (hasExpiredBooking && !hasExpiredBookingRef.current) {
      hasExpiredBookingRef.current = true;
      refetch();
    }
    if (!hasExpiredBooking) {
      hasExpiredBookingRef.current = false;
    }
  }, [bookings, currentTime, refetch]);

  const [showEditPopup, setShowEditPopup] = useState<boolean>(false);
  const [showRoomAvailability, setShowRoomAvailability] =
    useState<boolean>(false);

  const getRemainingTime = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - currentTime;
    if (diff <= 0) {
      return "Expired";
    }
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const handleConfirmSubmitButtonClick = () => {
    dispatch?.(setSelectedBooking(currentBooking));
    setShowPopup(false);
    setShowCheckoutPopup(true);
  };

  const handleCancelSubmitButtonClick = () => {
    setShowCancelPopup(false);
    if (!selectedBookingId) return;

    cancelBooking.mutate(selectedBookingId, {
      onSuccess: async (data) => {
        if (data?.error) {
          showToast(
            data?.error || Translations.INTERNAL_SERVER_ERROR,
            ToastType.ERROR,
          );
        } else {
          await refetch();
          showToast(Translations.BOOKING_CANCELLED, ToastType.SUCCESS);
        }
      },
    });
  };

  const handleRefresh = async () => {
    await refetch();
  };

  const renderEditPopup = () => {
    return (
      <div className="flex flex-col gap-5">
        <DatePicker
          label={Translations.CHECK_IN}
          selectedDate={editCheckIn}
          onChange={(date) => {
            if (date) {
              setEditCheckIn(date);
              if (editCheckOut <= date) {
                const nextDay = new Date(date);
                nextDay.setDate(nextDay.getDate() + 1);
                setEditCheckOut(nextDay);
              }
            }
          }}
          minDate={tomorrow}
          excludeDates={
            editCheckOut && tomorrow > editCheckOut ? [editCheckOut] : []
          }
        />

        <DatePicker
          label={Translations.CHECK_OUT}
          selectedDate={editCheckOut}
          onChange={(date) => {
            if (date) {
              setEditCheckOut(date);
            }
          }}
          minDate={editCheckIn}
          excludeDates={[editCheckIn]}
        />
      </div>
    );
  };

  const handleCheckRoomAvailability = () => {
    if (!editBooking?.roomNumber || !editBooking?.bookingId) return;

    const request: GetRoomAvailabilityRequest = {
      roomNumber: editBooking?.roomNumber,
      checkIn: editCheckIn.toISOString(),
      checkOut: editCheckOut.toISOString(),
      bookingId: editBooking?.bookingId,
    };
    checkAvailabilityMutation.mutate(request, {
      onError: (error) => {
        showToast(
          error?.message || Translations.INTERNAL_SERVER_ERROR,
          ToastType.ERROR,
        );
        setShowRoomAvailability(false);
      },
      onSettled: () => {
        setShowEditPopup(false);
      },
      onSuccess: () => {
        setShowRoomAvailability(true);
      },
    });
  };

  const renderAvailabilityPopup = () => {
    return (
      <div>
        <RoomAvailability onClose={() => setShowRoomAvailability(false)} />
      </div>
    );
  };

  const isBookingStarted = (booking: Booking): boolean => {
    return booking?.checkIn
      ? new Date(booking?.checkIn).getTime() <= currentTime
      : false;
  };

  return (
    <div className="min-h-screen pt-28 px-6 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto">
        {isLoading || isPending ? (
          <Loader />
        ) : (
          <>
            {showQRCodePopup && (
              <Popup
                content={
                  <div className="flex flex-col items-center gap-4">
                    <label>{Translations.SCAN_QR_AT_RECEPTION}</label>
                    <canvas ref={canvasRef} />
                  </div>
                }
                positiveButtonContent={Translations.CLOSE}
                onPositiveButtonClick={() => setShowQRCodePopup(false)}
              />
            )}

            {showPopup && (
              <Popup
                content={<label>{Translations.SURE_TO_CONFIRM}</label>}
                positiveButtonContent={Translations.YES}
                negativeButtonContent={Translations.NO}
                onPositiveButtonClick={handleConfirmSubmitButtonClick}
                onNegativeButtonClick={() => setShowPopup(false)}
              />
            )}

            {showCancelPopup && (
              <Popup
                content={<label>{Translations.SURE_TO_CANCEL}</label>}
                positiveButtonContent={Translations.YES}
                negativeButtonContent={Translations.NO}
                onPositiveButtonClick={handleCancelSubmitButtonClick}
                onNegativeButtonClick={() => setShowCancelPopup(false)}
              />
            )}

            {showCheckoutPopup && (
              <RazorpayCheckout
                onClose={() => setShowCheckoutPopup(false)}
                refreshData={handleRefresh}
              />
            )}

            {showEditPopup && (
              <Popup
                content={renderEditPopup()}
                onPositiveButtonClick={handleCheckRoomAvailability}
                positiveButtonContent={Translations.CHECK_AVAILABILITY}
                isPositiveButtonDisabled={isRoomAvailabilityPending}
                onNegativeButtonClick={() => setShowEditPopup(false)}
                negativeButtonContent={Translations.CLOSE}
              />
            )}

            {showRoomAvailability && (
              <Popup
                content={renderAvailabilityPopup()}
                onPositiveButtonClick={() => setShowRoomAvailability(false)}
                positiveButtonContent={Translations.CLOSE}
              />
            )}

            <h1 className="text-3xl md:text-4xl font-bold mb-10">
              My Bookings
            </h1>
            {bookings?.length === 0 ? (
              <p className="text-gray-400">No Bookings found.</p>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {bookings?.map((booking, index) => (
                  <div
                    key={index}
                    className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-lg hover:scale-105 transition"
                    onClick={() => {
                      if (booking?.bookingStatus !== BookingStatus.CONFIRMED) {
                        return;
                      }
                      setCurrentBooking(booking);
                      setShowQRCodePopup(true);
                    }}
                  >
                    {isBookingStarted(booking) &&
                      booking?.bookingStatus === BookingStatus.CONFIRMED && (
                        <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">
                          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />

                          <span className="text-sm font-medium text-emerald-300">
                            Your stay has started
                          </span>
                        </div>
                      )}
                    <div className="flex justify-between items-center mb-2 ">
                      <h3 className="text-xl font-semibold text-indigo-300">
                        Booking #{index + 1}
                      </h3>
                      {!isBookingStarted(booking) && (
                        <Pencil
                          size={20}
                          className="text-gray-400 hover:text-indigo-400 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowEditPopup(true);
                            setEditBooking(booking);
                            dispatch?.(setSelectedBooking(booking));
                          }}
                        />
                      )}
                    </div>

                    <p className="text-gray-300 text-sm mb-1">
                      Room Number: {booking?.roomNumber}
                    </p>
                    <p className="text-gray-300 text-sm mb-1">
                      Type: {booking?.roomType}
                    </p>
                    <p className="text-gray-300 text-sm mb-1">
                      Check In:{" "}
                      {new Date(booking?.checkIn || "")?.toLocaleDateString(
                        locale,
                        { timeZone: businessTimeZone },
                      )}
                    </p>
                    <p className="text-gray-300 text-sm mb-1">
                      Check Out:{" "}
                      {new Date(booking?.checkOut || "")?.toLocaleDateString(
                        locale,
                        { timeZone: businessTimeZone },
                      )}
                    </p>
                    {booking?.bookingStatus === BookingStatus.CREATED &&
                      booking?.expiresAt && (
                        <div className="mt-3">
                          <p className="text-yellow-400 text-sm font-medium">
                            Confirm within:
                          </p>

                          <div className="mt-1 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2">
                            <span className="text-yellow-300 font-bold tracking-wide">
                              {getRemainingTime(booking.expiresAt)}
                            </span>
                          </div>
                        </div>
                      )}
                    {isBookingStarted(booking) &&
                      booking?.bookingStatus === BookingStatus.CONFIRMED && (
                        <div className="mt-4 flex items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 py-2">
                          <span className="text-sm font-semibold text-emerald-300">
                            ✓ Stay in Progress
                          </span>
                        </div>
                      )}
                    <div
                      className={`flex mt-2 gap-4 ${booking?.bookingStatus === BookingStatus.CONFIRMED ? "justify-center" : "justify-between"}`}
                    >
                      {booking?.bookingStatus !== BookingStatus.CONFIRMED && (
                        <button
                          disabled={isLoading}
                          className="w-[50%] bg-indigo-600 hover:bg-indigo-500 py-2 rounded-lg font-medium transition cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBookingId(booking?.bookingId);
                            setShowPopup(true);
                            setCurrentBooking(booking);
                          }}
                        >
                          Confirm Booking
                        </button>
                      )}
                      {!isBookingStarted(booking) && (
                        <button
                          disabled={isLoading}
                          className={`w-[50%] bg-indigo-600 hover:bg-indigo-500 py-2 rounded-lg font-medium transition cursor-pointer`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBookingId(booking?.bookingId);
                            setShowCancelPopup(true);
                          }}
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Bookings;
