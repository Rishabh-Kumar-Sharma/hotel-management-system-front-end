"use client";

import ReactDatePicker from "react-datepicker";

type Props = {
  label: string;
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  excludeDates?: Date[];
};

const CustomDatePicker = ({
  label,
  selectedDate,
  onChange,
  minDate,
  excludeDates,
}: Props) => {
  const now = new Date();

  const isToday =
    selectedDate && selectedDate.toDateString() === now.toDateString();

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-left text-sm text-gray-300 font-medium">
        {label}
      </label>

      <ReactDatePicker
        selected={selectedDate}
        onChange={(date: Date | null) => onChange(date)}
        minDate={minDate}
        excludeDates={excludeDates}
        showTimeSelect
        timeIntervals={30}
        dateFormat="PPP p"
        wrapperClassName="w-full"
        popperPlacement="bottom-start"
        /* Disable past time for today */
        minTime={isToday ? now : new Date(0, 0, 0, 0, 0)}
        maxTime={new Date(0, 0, 0, 23, 59)}
        // popperModifiers={[
        //   {
        //     name: "flip",
        //     enabled: false,
        //   },
        // ]}
        className="
          w-full
          rounded-2xl
          border
          border-white/10
          bg-slate-800/80
          px-4
          py-3
          text-white
          outline-none
          backdrop-blur-xl
          transition
          focus:border-indigo-400
          focus:ring-2
          focus:ring-indigo-500/40
        "
      />
    </div>
  );
};

export { CustomDatePicker as DatePicker };
