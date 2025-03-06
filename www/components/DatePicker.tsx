"use client";

import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format, isBefore, isToday } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface DatePickerProps {
  label?: string;
  selectedDate?: Date;
  onDateChange: (date: Date | undefined) => void;
  allowPastDates?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({ label, selectedDate, onDateChange, allowPastDates }) => {
  const today = new Date();

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full flex justify-between">
            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
            <CalendarIcon className="w-4 h-4 ml-2 text-gray-500" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date ) => {
              if (!date) return;
              if (!allowPastDates && isBefore(date, today) && !isToday(date)) return;
              onDateChange(date);
            }}
            modifiers={{
              disabled: (date) => !allowPastDates && isBefore(date, today) && !isToday(date),
            }}
            modifiersClassNames={{
              disabled: "text-gray-400 cursor-not-allowed",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePicker;
