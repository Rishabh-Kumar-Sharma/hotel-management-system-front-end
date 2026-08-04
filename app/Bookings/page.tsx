"use client";
import { useEffect, useRef, useState } from "react";
import { Loader, Popup, RazorpayCheckout, showToast } from "../components";
import { Booking, BookingStatus, ToastType } from "../types";
import { useRouter } from "next/navigation";
import { Translations } from "../utils";
import QRCode from "qrcode";
import { useFetchBookings } from "../hooks";
import { useAppDispatch } from "../lib";
import { setSelectedBooking } from "@/app/lib/slices/BookingSlice";
import { useCancelBooking } from "../hooks/useCancelBooking";

const Bookings = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hasExpiredBookingRef = useRef(false);
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<
    number | undefined
  >();
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showQRCodePopup, setShowQRCodePopup] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking>();
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const [showCheckoutPopup, setShowCheckoutPopup] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const { isError, data, isLoading, refetch } = useFetchBookings();
  const bookings = data?.bookings || [];

  const cancelBooking = useCancelBooking();

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
        `Check In: ${new Date(checkIn || "").toLocaleDateString("en-GB")}`,
        `Check Out: ${new Date(checkOut || "").toLocaleDateString("en-GB")}`,
        `Price/Night: ₹${pricePerNight}`,
        `Status: ${bookingStatus}`,
      ].join("\n");
    };
    if (canvasRef?.current) {
      QRCode.toCanvas(canvasRef.current, getQRCodeData(), (error) => {
        console.log("Error occured in QRCode: ", error);
      });
    }
  }, [showQRCodePopup, currentBooking]);

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

  return (
    <div className="min-h-screen pt-28 px-6 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto">
        {isLoading ? (
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
                    <h3 className="text-xl font-semibold mb-2 text-indigo-300">
                      Booking #{index + 1}
                    </h3>

                    <p className="text-gray-300 text-sm mb-1">
                      Room Number: {booking?.roomNumber}
                    </p>
                    <p className="text-gray-300 text-sm mb-1">
                      Type: {booking?.roomType}
                    </p>
                    <p className="text-gray-300 text-sm mb-1">
                      Check In:{" "}
                      {new Date(booking?.checkIn || "")?.toLocaleDateString(
                        "en-GB",
                      )}
                    </p>
                    <p className="text-gray-300 text-sm mb-1">
                      Check Out:{" "}
                      {new Date(booking?.checkOut || "")?.toLocaleDateString(
                        "en-GB",
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
