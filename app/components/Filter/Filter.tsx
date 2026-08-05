"use client";
import { Translations } from "@/app/utils";
import { DatePicker } from "../DatePicker";
import { useState } from "react";
import { Popup } from "../Popup";
import { useAppDispatch, useAppSelector } from "@/app/lib";
import { selectRoom, setRoomFilter } from "@/app/lib/slices/RoomSlice";

export const Filter = ({ onClose }: { onClose?: () => void }) => {
  const dispatch = useAppDispatch();
  const { roomFilter } = useAppSelector(selectRoom);

  const [checkIn, setCheckIn] = useState<Date>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return roomFilter?.checkIn ? new Date(roomFilter.checkIn) : tomorrow;
  });
  const [checkOut, setCheckOut] = useState<Date>(() => {
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    return roomFilter?.checkOut
      ? new Date(roomFilter.checkOut)
      : dayAfterTomorrow;
  });
  const [tomorrow] = useState<Date>(() => {
    const day = new Date();
    day.setDate(day.getDate() + 1);
    return day;
  });

  const handleSubmitButtonClick = () => {
    const filter = {
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
    };
    dispatch(setRoomFilter(filter));
    onClose?.();
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
    <Popup
      content={
        <div className="flex flex-col">
          <div
            className="flex justify-between items-center"
            style={{ marginBottom: "16px" }}
          >
            <h1
              style={{
                textAlign: "start",
                fontWeight: "bold",
                fontSize: "1.5rem",
              }}
            >
              Filter
            </h1>
            <span className="cursor-pointer" onClick={onClose}>
              X
            </span>
          </div>
          {renderDatePickerPopup()}
        </div>
      }
      positiveButtonContent={Translations.APPLY_FILTERS}
      onPositiveButtonClick={handleSubmitButtonClick}
    />
  );
};
