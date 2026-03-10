import { useState, useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Info, MoreHorizontal } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type RecurrenceType = "days" | "weeks" | "months" | "years";

const MONTHS_OF_YEAR = [
  { value: "january", label: "January" },
  { value: "february", label: "February" },
  { value: "march", label: "March" },
  { value: "april", label: "April" },
  { value: "may", label: "May" },
  { value: "june", label: "June" },
  { value: "july", label: "July" },
  { value: "august", label: "August" },
  { value: "september", label: "September" },
  { value: "october", label: "October" },
  { value: "november", label: "November" },
  { value: "december", label: "December" },
] as const;

const MONTH_INDEX_MAP: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const FULL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

const ORDINALS = [
  { value: "last", label: "Last" },
  { value: "1", label: "1st" },
  { value: "2", label: "2nd" },
  { value: "3", label: "3rd" },
  ...Array.from({ length: 28 }, (_, i) => ({
    value: String(i + 4),
    label: `${i + 4}th`,
  })),
];

const MONTH_DAY_TYPE = [
  { value: "day", label: "Day" },
  ...FULL_DAYS.map((d) => ({ value: d.toLowerCase(), label: d })),
];

interface ScheduleDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScheduleChange?: (summary: string) => void;
}

function getNextRuns(
  type: RecurrenceType,
  interval: number,
  weekDays: string[],
  monthOrdinal: string,
  monthDayType: string,
  yearMonth: string,
  count: number = 3,
): Date[] {
  const now = new Date();
  const results: Date[] = [];

  if (type === "days") {
    for (let i = 1; results.length < count; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + interval * i);
      d.setHours(9, 0, 0, 0);
      results.push(d);
    }
  } else if (type === "weeks") {
    const dayIndices = weekDays.map((d) => DAYS_OF_WEEK.indexOf(d as any));
    if (dayIndices.length === 0) dayIndices.push(0);
    let weekOffset = 0;
    while (results.length < count) {
      for (const dayIdx of dayIndices.sort((a, b) => a - b)) {
        const d = new Date(now);
        const currentDay = (d.getDay() + 6) % 7; // Mon=0
        const daysUntil = (dayIdx - currentDay + 7) % 7 + weekOffset * 7 * interval;
        if (daysUntil === 0 && weekOffset === 0) continue;
        d.setDate(d.getDate() + (daysUntil || 7 * interval));
        d.setHours(9, 0, 0, 0);
        if (d > now && results.length < count) results.push(d);
      }
      weekOffset++;
      if (weekOffset > 52) break;
    }
  } else if (type === "months") {
    for (let i = 1; results.length < count && i < 36; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + interval * i, 1, 9, 0, 0, 0);
      if (monthDayType === "day") {
        if (monthOrdinal === "last") {
          d.setMonth(d.getMonth() + 1, 0);
        } else {
          const dayNum = parseInt(monthOrdinal);
          const maxDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
          d.setDate(Math.min(dayNum, maxDay));
  } else if (type === "years") {
    const targetMonthIdx = MONTH_INDEX_MAP[yearMonth] ?? 0;
    for (let i = 0; results.length < count && i < 20; i++) {
      const year = now.getFullYear() + interval * (i + 1);
      const d = new Date(year, targetMonthIdx, 1, 9, 0, 0, 0);
      if (monthDayType === "day") {
        if (monthOrdinal === "last") {
          d.setMonth(d.getMonth() + 1, 0);
        } else {
          const dayNum = parseInt(monthOrdinal);
          const maxDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
          d.setDate(Math.min(dayNum, maxDay));
        }
      } else {
        const targetDayIdx = FULL_DAYS.findIndex((fd) => fd.toLowerCase() === monthDayType);
        if (monthOrdinal === "last") {
          const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
          const diff = (lastDay.getDay() - 1 - targetDayIdx + 7) % 7;
          lastDay.setDate(lastDay.getDate() - diff);
          d.setDate(lastDay.getDate());
        } else {
          const ord = parseInt(monthOrdinal);
          const firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
          const diff = (targetDayIdx - ((firstDay.getDay() + 6) % 7) + 7) % 7;
          d.setDate(1 + diff + (ord - 1) * 7);
        }
      }
      d.setHours(9, 0, 0, 0);
      if (d > now) results.push(d);
    }
  }
      } else {
        const targetDayIdx = FULL_DAYS.findIndex((fd) => fd.toLowerCase() === monthDayType);
        if (monthOrdinal === "last") {
          const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
          const diff = (lastDay.getDay() - 1 - targetDayIdx + 7) % 7;
          lastDay.setDate(lastDay.getDate() - diff);
          d.setDate(lastDay.getDate());
        } else {
          const ord = parseInt(monthOrdinal);
          const firstDay = new Date(d.getFullYear(), d.getMonth(), 1);
          const diff = (targetDayIdx - ((firstDay.getDay() + 6) % 7) + 7) % 7;
          d.setDate(1 + diff + (ord - 1) * 7);
        }
      }
      d.setHours(9, 0, 0, 0);
      if (d > now) results.push(d);
    }
  }

  return results.slice(0, count);
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function buildSummary(
  type: RecurrenceType,
  interval: number,
  weekDays: string[],
  monthOrdinal: string,
  monthDayType: string,
  yearMonth: string,
): string {
  if (type === "days") {
    return interval === 1 ? "Every day" : `Every ${interval} days`;
  }
  if (type === "weeks") {
    const days = weekDays.length > 0 ? weekDays.join(", ") : "Mon";
    return interval === 1 ? `Weekly on ${days}` : `Every ${interval} weeks on ${days}`;
  }
  const ordLabel = ORDINALS.find((o) => o.value === monthOrdinal)?.label || monthOrdinal;
  const dayLabel = MONTH_DAY_TYPE.find((m) => m.value === monthDayType)?.label || monthDayType;
  if (type === "years") {
    const monthLabel = MONTHS_OF_YEAR.find((m) => m.value === yearMonth)?.label || yearMonth;
    return interval === 1
      ? `Yearly on the ${ordLabel} ${dayLabel} of ${monthLabel}`
      : `Every ${interval} years on the ${ordLabel} ${dayLabel} of ${monthLabel}`;
  }
  return interval === 1
    ? `Monthly on the ${ordLabel} ${dayLabel}`
    : `Every ${interval} months on the ${ordLabel} ${dayLabel}`;
}

export default function ScheduleDrawer({ open, onOpenChange, onScheduleChange }: ScheduleDrawerProps) {
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>("weeks");
  const [interval, setInterval] = useState(1);
  const [weekDays, setWeekDays] = useState<string[]>(["Mon"]);
  const [monthOrdinal, setMonthOrdinal] = useState("1");
  const [monthDayType, setMonthDayType] = useState("day");
  const [yearMonth, setYearMonth] = useState("january");

  const summary = useMemo(
    () => buildSummary(recurrenceType, interval, weekDays, monthOrdinal, monthDayType, yearMonth),
    [recurrenceType, interval, weekDays, monthOrdinal, monthDayType, yearMonth],
  );

  const nextRuns = useMemo(
    () => getNextRuns(recurrenceType, interval, weekDays, monthOrdinal, monthDayType),
    [recurrenceType, interval, weekDays, monthOrdinal, monthDayType],
  );

  const handleOpenChange = (val: boolean) => {
    if (!val && onScheduleChange) onScheduleChange(summary);
    onOpenChange(val);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-[360px] sm:max-w-[360px] flex flex-col gap-0 p-0">
        <SheetHeader className="px-5 pt-5 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="rounded-md p-1.5 bg-success/10">
              <Clock className="h-4 w-4 text-success" />
            </div>
            <div>
              <SheetTitle className="text-sm">Schedule Configuration</SheetTitle>
              <SheetDescription className="text-xs">Set when this workflow runs automatically.</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {/* Recurrence type */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Repeat every</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                max={99}
                value={interval}
                onChange={(e) => setInterval(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 h-9 text-center text-sm"
              />
              <Select value={recurrenceType} onValueChange={(v) => setRecurrenceType(v as RecurrenceType)}>
                <SelectTrigger className="h-9 flex-1 text-sm">
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

          {/* Weekly: day picker */}
          {recurrenceType === "weeks" && (
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">On</Label>
              <ToggleGroup
                type="multiple"
                value={weekDays}
                onValueChange={(v) => setWeekDays(v.length > 0 ? v : weekDays)}
                className="flex flex-wrap gap-1"
              >
                {DAYS_OF_WEEK.map((day) => (
                  <ToggleGroupItem
                    key={day}
                    value={day}
                    className="h-8 w-10 text-[11px] font-medium rounded-md data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                  >
                    {day}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          )}

          {/* Monthly: ordinal + day type */}
          {recurrenceType === "months" && (
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">On the</Label>
              <div className="flex items-center gap-2">
                <Select value={monthOrdinal} onValueChange={setMonthOrdinal}>
                  <SelectTrigger className="h-9 w-24 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-52">
                    {ORDINALS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={monthDayType} onValueChange={setMonthDayType}>
                  <SelectTrigger className="h-9 flex-1 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTH_DAY_TYPE.map((m) => (
                      <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Summary</p>
            <p className="text-sm font-medium">{summary}</p>
          </div>

          {/* Next runs */}
          <div className="space-y-2">
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 cursor-help w-fit">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-help">
                    Next runs
                  </Label>
                  <Info className="h-3 w-3 text-muted-foreground/50" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs max-w-[220px]">
                Next scheduled execution dates. This repeats indefinitely.
              </TooltipContent>
            </Tooltip>
            {nextRuns.length > 0 ? (
              <div className="flex items-stretch gap-1.5">
                {nextRuns.map((d, i) => {
                  const now = new Date();
                  const showYear = d.getFullYear() !== now.getFullYear();
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-md bg-muted/40 border border-border/40 p-2 text-center"
                    >
                      <p className="text-[10px] text-muted-foreground/60 uppercase">
                        {d.toLocaleDateString("en-US", { weekday: "short" })}
                      </p>
                      <p className="text-sm font-semibold text-foreground/80">{d.getDate()}</p>
                      <p className="text-[10px] text-muted-foreground/60">
                        {d.toLocaleDateString("en-US", { month: "short" })}
                        {showYear && ` '${String(d.getFullYear()).slice(2)}`}
                      </p>
                    </div>
                  );
                })}
                <div className="flex items-center px-1">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground/20" />
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No upcoming runs found.</p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
