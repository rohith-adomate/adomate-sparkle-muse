import { useState, useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, CalendarDays, Repeat } from "lucide-react";
import { format, addDays, addWeeks, addMonths, setDate as setDayOfMonth, lastDayOfMonth, nextDay } from "date-fns";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

/* ── Types ── */

type FrequencyType = "days" | "weeks" | "months";
type DayOfWeek = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";

const DAYS_OF_WEEK: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_ABBREV: Record<DayOfWeek, string> = {
  Monday: "Mon", Tuesday: "Tue", Wednesday: "Wed", Thursday: "Thu",
  Friday: "Fri", Saturday: "Sat", Sunday: "Sun",
};
const DAY_INDEX: Record<DayOfWeek, 0 | 1 | 2 | 3 | 4 | 5 | 6> = {
  Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6,
};

const MONTH_DAY_OPTIONS = [
  { value: "last", label: "Last" },
  ...Array.from({ length: 31 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1}${ordinalSuffix(i + 1)}`,
  })),
];

const MONTH_DAY_TYPE_OPTIONS = [
  { value: "day", label: "Day" },
  ...DAYS_OF_WEEK.map((d) => ({ value: d, label: d })),
];

function ordinalSuffix(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

/* ── Next runs calculation ── */

function getNextRuns(
  freq: FrequencyType,
  interval: number,
  weekDay: DayOfWeek,
  monthDayNum: string,
  monthDayType: string,
  count: number = 3
): Date[] {
  const now = new Date();
  const runs: Date[] = [];
  let cursor = new Date(now);

  // Move cursor to next occurrence based on frequency
  for (let attempt = 0; attempt < 365 && runs.length < count; attempt++) {
    cursor = getNextOccurrence(cursor, freq, interval, weekDay, monthDayNum, monthDayType, attempt === 0);
    if (cursor > now) {
      runs.push(new Date(cursor));
    }
  }

  return runs;
}

function getNextOccurrence(
  from: Date,
  freq: FrequencyType,
  interval: number,
  weekDay: DayOfWeek,
  monthDayNum: string,
  monthDayType: string,
  isFirst: boolean
): Date {
  if (freq === "days") {
    return addDays(from, isFirst ? 1 : interval);
  }

  if (freq === "weeks") {
    if (isFirst) {
      // Find the next occurrence of weekDay
      const targetIdx = DAY_INDEX[weekDay];
      const currentIdx = from.getDay();
      const daysUntil = (targetIdx - currentIdx + 7) % 7 || 7;
      return addDays(from, daysUntil);
    }
    return addWeeks(from, interval);
  }

  if (freq === "months") {
    const baseDate = isFirst ? from : addMonths(from, interval);
    
    if (monthDayType === "day") {
      // Specific day number of month
      if (monthDayNum === "last") {
        return lastDayOfMonth(baseDate);
      }
      const dayNum = parseInt(monthDayNum);
      const maxDay = lastDayOfMonth(baseDate).getDate();
      const targetDay = Math.min(dayNum, maxDay);
      const result = setDayOfMonth(baseDate, targetDay);
      if (isFirst && result <= from) {
        return getNextOccurrence(addMonths(from, 1), freq, interval, weekDay, monthDayNum, monthDayType, true);
      }
      return result;
    } else {
      // Specific day of week - find first occurrence in that month
      const targetDayIdx = DAY_INDEX[monthDayType as DayOfWeek];
      if (monthDayNum === "last") {
        // Last [weekday] of month
        const end = lastDayOfMonth(baseDate);
        let d = new Date(end);
        while (d.getDay() !== targetDayIdx) {
          d = addDays(d, -1);
        }
        if (isFirst && d <= from) {
          return getNextOccurrence(addMonths(from, 1), freq, interval, weekDay, monthDayNum, monthDayType, true);
        }
        return d;
      }
      // Nth [weekday] of month
      const nth = parseInt(monthDayNum);
      const firstOfMonth = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
      let d = new Date(firstOfMonth);
      while (d.getDay() !== targetDayIdx) {
        d = addDays(d, 1);
      }
      d = addDays(d, (nth - 1) * 7);
      if (d.getMonth() !== baseDate.getMonth()) {
        // Overflows, fall back to last occurrence
        d = addDays(d, -7);
      }
      if (isFirst && d <= from) {
        return getNextOccurrence(addMonths(from, 1), freq, interval, weekDay, monthDayNum, monthDayType, true);
      }
      return d;
    }
  }

  return addDays(from, 1);
}

/* ── Component ── */

interface ScheduleDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDescriptionChange?: (desc: string) => void;
}

export default function ScheduleDrawer({ open, onOpenChange, onDescriptionChange }: ScheduleDrawerProps) {
  const [frequency, setFrequency] = useState<FrequencyType>("weeks");
  const [interval, setInterval] = useState(1);
  const [weekDay, setWeekDay] = useState<DayOfWeek>("Monday");
  const [monthDayNum, setMonthDayNum] = useState("1");
  const [monthDayType, setMonthDayType] = useState("day");
  const [startTime, setStartTime] = useState("09:00");

  const nextRuns = useMemo(
    () => getNextRuns(frequency, interval, weekDay, monthDayNum, monthDayType),
    [frequency, interval, weekDay, monthDayNum, monthDayType]
  );

  // Build description string
  const description = useMemo(() => {
    const parts: string[] = [];
    if (frequency === "days") {
      parts.push(`Every ${interval === 1 ? "day" : `${interval} days`}`);
    } else if (frequency === "weeks") {
      parts.push(`Every ${interval === 1 ? "week" : `${interval} weeks`} on ${weekDay}`);
    } else {
      const dayLabel = monthDayNum === "last" ? "last" : `${monthDayNum}${ordinalSuffix(parseInt(monthDayNum) || 1)}`;
      const typeLabel = monthDayType === "day" ? "day" : monthDayType;
      parts.push(`Every ${interval === 1 ? "month" : `${interval} months`} on the ${dayLabel} ${typeLabel}`);
    }
    parts.push(`at ${startTime}`);
    return parts.join(" ");
  }, [frequency, interval, weekDay, monthDayNum, monthDayType, startTime]);

  // Notify parent of description changes
  useMemo(() => {
    onDescriptionChange?.(description);
  }, [description, onDescriptionChange]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[380px] sm:w-[420px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2">
            <div className="rounded-md p-1.5 bg-emerald-500/10">
              <Clock className="h-4 w-4 text-emerald-500" />
            </div>
            Schedule Configuration
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* ── Frequency ── */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Repeat every</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                max={99}
                value={interval}
                onChange={(e) => setInterval(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 h-9 text-center"
              />
              <Select value={frequency} onValueChange={(v) => setFrequency(v as FrequencyType)}>
                <SelectTrigger className="h-9 flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="days">Day(s)</SelectItem>
                  <SelectItem value="weeks">Week(s)</SelectItem>
                  <SelectItem value="months">Month(s)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ── Weekly: Day selector ── */}
          {frequency === "weeks" && (
            <div className="space-y-3">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">On</Label>
              <ToggleGroup
                type="single"
                value={weekDay}
                onValueChange={(v) => v && setWeekDay(v as DayOfWeek)}
                className="flex flex-wrap gap-1"
              >
                {DAYS_OF_WEEK.map((day) => (
                  <ToggleGroupItem
                    key={day}
                    value={day}
                    className="h-9 px-3 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                  >
                    {DAY_ABBREV[day]}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          )}

          {/* ── Monthly: Day of month selector ── */}
          {frequency === "months" && (
            <div className="space-y-3">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">On the</Label>
              <div className="flex items-center gap-2">
                <Select value={monthDayNum} onValueChange={setMonthDayNum}>
                  <SelectTrigger className="h-9 flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {MONTH_DAY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={monthDayType} onValueChange={setMonthDayType}>
                  <SelectTrigger className="h-9 flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTH_DAY_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* ── Time ── */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">At time</Label>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="h-9 w-32"
            />
          </div>

          <Separator />

          {/* ── Summary ── */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Repeat className="h-3.5 w-3.5" />
              Summary
            </Label>
            <div className="rounded-lg bg-muted/50 border border-border px-3 py-2.5">
              <p className="text-sm font-medium">{description}</p>
            </div>
          </div>

          <Separator />

          {/* ── Next runs preview ── */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              Next scheduled runs
            </Label>
            <div className="space-y-2">
              {nextRuns.map((date, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                    <span className="text-xs font-bold">{i + 1}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">
                      {format(date, "EEEE, MMMM d, yyyy")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {startTime ? `at ${startTime}` : ""}
                    </p>
                  </div>
                  <Badge variant="secondary" className="ml-auto text-[10px] shrink-0">
                    {format(date, "MMM d")}
                  </Badge>
                </div>
              ))}
              {nextRuns.length === 0 && (
                <p className="text-xs text-muted-foreground italic">Unable to calculate next runs</p>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
