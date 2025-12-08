"use client"

import * as React from "react"
import { format, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, subMonths, startOfYear, endOfYear } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


interface DatePickerWithRangeProps {
  className?: string;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange({
  className,
  date,
  setDate,
}: DatePickerWithRangeProps) {

  const handlePresetChange = (value: string) => {
    const today = new Date();
    let from = today;
    let to = today;

    switch (value) {
      case "today":
        from = today;
        to = today;
        break;
      case "yesterday":
        from = subDays(today, 1);
        to = subDays(today, 1);
        break;
      case "last7":
        from = subDays(today, 6);
        to = today;
        break;
      case "last30":
        from = subDays(today, 29);
        to = today;
        break;
      case "thisWeek":
        from = startOfWeek(today, { weekStartsOn: 1 });
        to = endOfWeek(today, { weekStartsOn: 1 });
        break;
      case "lastWeek":
        const lastWeek = subDays(today, 7);
        from = startOfWeek(lastWeek, { weekStartsOn: 1 });
        to = endOfWeek(lastWeek, { weekStartsOn: 1 });
        break;
      case "thisMonth":
        from = startOfMonth(today);
        to = endOfMonth(today);
        break;
      case "lastMonth":
        const lastMonth = subMonths(today, 1);
        from = startOfMonth(lastMonth);
        to = endOfMonth(lastMonth);
        break;
      case "thisYear":
        from = startOfYear(today);
        to = endOfYear(today);
        break;
    }
    setDate({ from, to });
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="flex h-full">
            <div className="flex flex-col gap-1 p-2 border-r bg-muted/30 min-w-[160px]">
              <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Presets
              </div>
              <Button variant="ghost" size="sm" onClick={() => handlePresetChange("today")} className="justify-start font-normal h-8 px-2 text-sm">Today</Button>
              <Button variant="ghost" size="sm" onClick={() => handlePresetChange("yesterday")} className="justify-start font-normal h-8 px-2 text-sm">Yesterday</Button>
              <div className="my-1 border-t" />
              <Button variant="ghost" size="sm" onClick={() => handlePresetChange("thisWeek")} className="justify-start font-normal h-8 px-2 text-sm">This Week</Button>
              <Button variant="ghost" size="sm" onClick={() => handlePresetChange("lastWeek")} className="justify-start font-normal h-8 px-2 text-sm">Last Week</Button>
              <div className="my-1 border-t" />
              <Button variant="ghost" size="sm" onClick={() => handlePresetChange("thisMonth")} className="justify-start font-normal h-8 px-2 text-sm">This Month</Button>
              <Button variant="ghost" size="sm" onClick={() => handlePresetChange("lastMonth")} className="justify-start font-normal h-8 px-2 text-sm">Last Month</Button>
              <div className="my-1 border-t" />
              <Button variant="ghost" size="sm" onClick={() => handlePresetChange("last7")} className="justify-start font-normal h-8 px-2 text-sm">Last 7 Days</Button>
              <Button variant="ghost" size="sm" onClick={() => handlePresetChange("last30")} className="justify-start font-normal h-8 px-2 text-sm">Last 30 Days</Button>
            </div>
            <div className="p-2">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

