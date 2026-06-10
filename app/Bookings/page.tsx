"use client";
import { useEffect, useRef, useState } from "react";
import { Loader, Popup, showToast } from "../components";
import {
  ApiErrorCodesEnum,
  BookingStatus,
  GetBookingsResponse,
  ToastType,
} from "../types";
import { useRouter } from "next/navigation";
import { Translations } from "../utils";
import QRCode from "qrcode";

const Bookings = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hasExpiredBookingRef = useRef(false);
  const router = useRouter();
  const [bookings, setBookings] = useState<GetBookingsResponse["bookings"]>([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<
    number | undefined
  >();
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showQRCodePopup, setShowQRCodePopup] = useState(false);
  const [selectedBooking, setSelectedBooking] =
    useState<GetBookingsResponse["bookings"][0]>();
  const [currentTime, setCurrentTime] = useState(Date.now());

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/booking/fetchBookings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authToken: `${sessionStorage.getItem("authToken")}`,
        },
      });
      const data: GetBookingsResponse = await response.json();
      console.log("Bookings data:", data);
      if (data?.error) {
        if (data?.errorCode === ApiErrorCodesEnum.UNAUTHORIZED_ACCESS) {
          router.push("/Login");
        }
        showToast(data?.error, ToastType.ERROR);
      } else {
        setBookings(data?.bookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch bookings data here if needed
    fetchBookings();
  }, []);

  useEffect(() => {
    const getQRCodeData = () => {
      const {
        checkIn,
        checkOut,
        pricePerNight,
        roomNumber,
        roomType,
        bookingStatus,
      } = selectedBooking || {};
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
        if (error) console.error("Error generating QR code:", error);
      });
    }
  }, [showQRCodePopup]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const hasExpiredBooking = bookings?.some((booking) => {
      if (
        booking?.bookingStatus === BookingStatus.CREATED &&
        booking?.expiresAt
      ) {
        return new Date(booking.expiresAt).getTime() - currentTime <= 0;
      }
    });
    if (hasExpiredBooking && !hasExpiredBookingRef.current) {
      hasExpiredBookingRef.current = true;
      fetchBookings();
    } else {
      hasExpiredBookingRef.current = false;
    }
  }, [bookings, currentTime]);

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
    setShowPopup(false);
    setLoading(true);
    const bookRoomConfirm = async () => {
      try {
        const res = await fetch("/api/booking/bookRoomConfirm", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authToken: `${sessionStorage.getItem("authToken")}`,
            bookingId: `${selectedBookingId}`,
          },
        });
        const data = await res?.json();
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
          fetchBookings(); // Refresh bookings after confirming
          showToast(Translations.BOOKING_CONFIRMED, ToastType.SUCCESS);
        }
      } catch (error) {
        console.error("Error booking room", error);
        showToast(Translations.INTERNAL_SERVER_ERROR, ToastType.ERROR);
      } finally {
        setLoading(false);
      }
    };

    bookRoomConfirm();
  };

  const handleCancelSubmitButtonClick = () => {
    setShowCancelPopup(false);
    setLoading(true);
    const bookRoomCancel = async () => {
      try {
        const res = await fetch("/api/booking/cancelBooking", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authToken: `${sessionStorage.getItem("authToken")}`,
            bookingId: `${selectedBookingId}`,
          },
        });
        const data = await res?.json();
        if (data?.error) {
          if (data.errorCode === ApiErrorCodesEnum.UNAUTHORIZED_ACCESS) {
            router.push("/Login");
          }
          showToast(
            data?.error || Translations.INTERNAL_SERVER_ERROR,
            ToastType.ERROR,
          );
        } else {
          fetchBookings(); // Refresh bookings after confirming
          showToast(Translations.BOOKING_CANCELLED, ToastType.SUCCESS);
        }
      } catch (error) {
        console.error("Error booking room", error);
        showToast(Translations.INTERNAL_SERVER_ERROR, ToastType.ERROR);
      } finally {
        setLoading(false);
      }
    };

    bookRoomCancel();
  };

  return (
    <div className="min-h-screen pt-28 px-6 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto">
        {loading ? (
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
                      setSelectedBooking(booking);
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
                      {new Date(booking?.checkIn)?.toLocaleDateString("en-GB")}
                    </p>
                    <p className="text-gray-300 text-sm mb-1">
                      Check Out:{" "}
                      {new Date(booking?.checkOut)?.toLocaleDateString("en-GB")}
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
                    {booking?.bookingStatus !== BookingStatus.CONFIRMED && (
                      <div className="flex mt-2 justify-between gap-4">
                        <button
                          disabled={loading}
                          className="w-[50%] bg-indigo-600 hover:bg-indigo-500 py-2 rounded-lg font-medium transition"
                          onClick={() => {
                            setSelectedBookingId(booking?.bookingId);
                            setShowPopup(true);
                          }}
                        >
                          Confirm Booking
                        </button>
                        <button
                          disabled={loading}
                          className="w-[50%] bg-indigo-600 hover:bg-indigo-500 py-2 rounded-lg font-medium transition"
                          onClick={() => {
                            setSelectedBookingId(booking?.bookingId);
                            setShowCancelPopup(true);
                          }}
                        >
                          Cancel Booking
                        </button>
                      </div>
                    )}
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
