"use client";

import { useState } from "react";
import { Check, X, Clock, ChevronRight, CalendarDays } from "lucide-react";
import { RoomAvailabilityEnum, ToastType } from "@/app/types/enums";
import { TimeSlot } from "@/app/types/responses";
import { useAppSelector } from "@/app/lib";
import { selectRoom } from "@/app/lib/slices/RoomSlice";
import { Popup } from "../Popup";
import { Translations } from "@/app/utils";
import { useUpdateBooking } from "@/app/hooks";
import { UpdateBookingDetailsRequest } from "@/app/types";
import { selectBooking } from "@/app/lib/slices/BookingSlice";
import { showToast } from "../Toast";
import { getBusinessTimeZone } from "@/app/utils";

export interface RoomAvailabilityProps {
  onClose?: () => void;
}

export const RoomAvailability = ({ onClose }: RoomAvailabilityProps) => {
  const [showAll, setShowAll] = useState(false);

  const { selectedBooking } = useAppSelector(selectBooking);
  const { roomAvailabilityResponse } = useAppSelector(selectRoom);
  const { status: availability, availableSlots } =
    roomAvailabilityResponse || {};
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const updateBooking = useUpdateBooking();
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | undefined>();

  const formatDate = (date: string | Date) =>
    new Date(date).toLocaleString("en-IN", {
      timeZone: getBusinessTimeZone(),
      day: "2-digit",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    });

  const handleConfirmButtonClick = () => {
    setShowPopup(false);

    if (
      !selectedSlot?.checkIn ||
      !selectedSlot?.checkOut ||
      !selectedBooking?.bookingId
    )
      return;

    const req: UpdateBookingDetailsRequest = {
      checkIn: selectedSlot.checkIn,
      checkOut: selectedSlot.checkOut,
      bookingId: selectedBooking?.bookingId,
    };
    updateBooking.mutate(req, {
      onSuccess: (data) => {
        if (data?.error) {
          showToast(data?.error, ToastType.ERROR);
          return;
        }
        onClose?.();
        showToast(Translations.BOOKING_UPDATE_SUCCESS, ToastType.SUCCESS);
      },
      onError: () => {
        showToast(Translations.INTERNAL_SERVER_ERROR, ToastType.ERROR);
      },
    });
  };

  if (availability === RoomAvailabilityEnum.NOT_AVAILABLE) {
    return (
      <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4">
        <div className="flex items-center gap-2 text-red-300">
          <X size={18} />
          <span className="font-medium">Not Available</span>
        </div>

        <p className="mt-1 text-sm text-gray-400">
          This room is already booked for the selected dates.
        </p>
      </div>
    );
  }

  const visibleSlots = availableSlots?.slice(0, 2);
  const remainingSlots = Math.max((availableSlots?.length || 0) - 2, 0);

  return (
    <>
      {showPopup && (
        <Popup
          content={<label>{Translations.SURE_TO_CONFIRM}</label>}
          onPositiveButtonClick={handleConfirmButtonClick}
          positiveButtonContent={Translations.YES}
          negativeButtonContent={Translations.CANCEL}
          onNegativeButtonClick={() => setShowPopup(false)}
        />
      )}
      <div
        className={`rounded-2xl border border-${availability === RoomAvailabilityEnum.PARTIALLY_AVAILABLE ? "amber-400/20" : "emerald-400/20"} 
        bg-${availability === RoomAvailabilityEnum.PARTIALLY_AVAILABLE ? "amber-500/10" : "emerald-500/10"} p-4`}
      >
        <div className="flex items-center justify-between">
          {availability === RoomAvailabilityEnum.PARTIALLY_AVAILABLE ? (
            <div className="flex items-center gap-2 text-amber-300">
              <Clock size={18} />
              <span className="font-medium">Partially Available</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-300">
              <Check size={18} />
              <span className="font-medium">Available</span>
            </div>
          )}

          {(availableSlots?.length || 0) > 2 && (
            <button
              onClick={() => setShowAll(true)}
              className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/5 py-2 text-xs font-medium text-gray-400 transition-all hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-blue-300"
            >
              View {remainingSlots} more available{" "}
              {remainingSlots === 1 ? "slot" : "slots"}
              <ChevronRight size={14} />
            </button>
          )}
        </div>

        {availability === RoomAvailabilityEnum.PARTIALLY_AVAILABLE ? (
          <p className="mt-1 text-sm text-gray-400">
            {`This room is available only during the following period${(visibleSlots?.length || 0) > 1 ? "s" : ""}.`}
          </p>
        ) : (
          <p className="mt-1 text-sm text-gray-400">
            This room is available for your selected dates.
          </p>
        )}

        <div className="mt-4 space-y-2">
          {visibleSlots?.map((slot, index) => (
            <button
              key={index}
              onClick={() => {
                setShowPopup(true);
                setSelectedSlot(slot);
              }}
              className="group flex w-full cursor-pointer items-center rounded-xl border border-blue-400/20 bg-blue-500/10 p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-400/50 hover:bg-blue-500/15 hover:shadow-lg hover:shadow-blue-500/10"
            >
              {/* Calendar icon */}
              <div className="mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-blue-300 ring-1 ring-blue-400/20 transition group-hover:bg-blue-500/25 group-hover:text-blue-200">
                <CalendarDays size={18} />
              </div>

              {/* Dates */}
              <div className="flex min-w-0 flex-1 flex-col items-center">
                {/* Check-in */}
                <p className="text-sm font-medium text-white">
                  {formatDate(slot.checkIn)}
                </p>

                {/* To divider */}
                <div className="my-1.5 flex w-full max-w-[180px] items-center gap-2">
                  <div className="h-px flex-1 bg-blue-400/25" />

                  <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-300/80">
                    To
                  </span>

                  <div className="h-px flex-1 bg-blue-400/25" />
                </div>

                {/* Check-out */}
                <p className="text-sm font-medium text-white">
                  {formatDate(slot.checkOut)}
                </p>
              </div>

              {/* Right arrow */}
              <ChevronRight
                size={18}
                className="ml-3 shrink-0 text-blue-300 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-200"
              />
            </button>
          ))}
        </div>

        {remainingSlots > 0 && (
          <button
            onClick={() => setShowAll(true)}
            className="mt-3 text-xs text-gray-400 hover:text-white transition"
          >
            + {remainingSlots} more available{" "}
            {remainingSlots === 1 ? "slot" : "slots"}
          </button>
        )}
      </div>

      {/* Availability Drawer / Modal */}
      {showAll && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={() => setShowAll(false)}
        >
          <div
            className="w-full max-w-md max-h-[80vh] overflow-hidden rounded-3xl border border-white/20 bg-slate-900/95 shadow-2xl backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Room Availability
                </h3>

                <p className="text-xs text-gray-400">
                  {availableSlots?.length} available{" "}
                  {availableSlots?.length === 1 ? "slot" : "slots"}
                </p>
              </div>

              <button
                onClick={() => setShowAll(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Slots */}
            <div className="max-h-[60vh] overflow-y-auto p-6 space-y-3">
              {availableSlots?.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setShowAll(false);
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left hover:border-indigo-400/40 hover:bg-white/10 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />

                    <div>
                      <p className="text-sm font-medium text-white">
                        {formatDate(slot.checkIn)}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        → {formatDate(slot.checkOut)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 px-6 py-4">
              <button
                onClick={() => setShowAll(false)}
                className="w-full rounded-xl bg-white/10 py-2.5 text-sm font-medium text-white hover:bg-white/20 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
