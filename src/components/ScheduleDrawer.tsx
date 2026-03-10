import { useState, useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Clock, CalendarDays } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { format, addDays, addWeeks, addMonths, setDay, lastDayOfMonth, setDate } from "date-fns";

type Frequency = "daily" | "weekly" | "monthly";

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const ORDINALS = ["Last", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th", "13th", "14th", "15th", "16th", "17th", "18th", "19th", "20th", "21st", "22nd", "23rd", "24th", "25th", "26th", "27th", "28th", "29th", "30th", "31st"];
const MONTHLY_DAY_OPTIONS = ["Day", ...DAYS_OF_WEEK];

interface ScheduleDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScheduleChange?: (description: string) => void;
}

export default function ScheduleDrawer({ open, onOpenChange, onScheduleChange }: ScheduleDrawerProps) {
  const [frequency, setFrequency] = useState<Frequency>("weekly");
  const [interval, setInterval] = useState(1);
  const [weeklyDays, setWeeklyDays] = useState<string[]>(["1"]); // Monday
  const [monthlyOrdinal, setMonthlyOrdinal] = useState("1st");
  const [monthlyDayType, setMonthlyDayType] = useState("Day");

  const summary = useMemo(() => {
    if (frequency === "daily") {
      return interval === 1 ? "Every day" : `Every ${interval} days`;
    }
    if (frequency === "weekly") {
      const dayNames = weeklyDays.sort().map((d) => DAYS_OF_WEEK[parseInt(d)]);
      const daysStr = dayNames.length > 0 ? dayNames.join(", ") : "no days";
      return interval === 1 ? `Weekly on ${daysStr}` : `Every ${interval} weeks on ${daysStr}`;
    }
    if (frequency === "monthly") {
      const monthStr = interval === 1 ? "Every month" : `Every ${interval} months`;
      return `${monthStr} on the ${monthlyOrdinal} ${monthlyDayType}`;
    }
    return "";
  }, [frequency, interval, weeklyDays, monthlyOrdinal, monthlyDayType]);

  const nextRuns = useMemo(() => {
    const now = new Date();
    const runs: Date[] = [];

    if (frequency === "daily") {
      for (let i = 1; runs.length < 3; i++) {
        runs.push(addDays(now, i * interval));
      }
    } else if (frequency === "weekly") {
      if (weeklyDays.length === 0) return [];
      const dayNums = weeklyDays.map(Number).sort((a, b) => a - b);
      let current = new Date(now);
      let safety = 0;
      while (runs.length < 3 && safety < 200) {
        current = addDays(current, 1);
        const dow = current.getDay();
        if (dayNums.includes(dow)) {
          // Check if we're within the right week interval
          const diffWeeks = Math.floor((current.getTime() - now.getTime()) / (7 * 24 * 60 * 60 * 1000));
          if (interval === 1 || diffWeeks % interval === 0 || runs.length > 0) {
            runs.push(new Date(current));
          }
        }
        safety++;
      }
    } else if (frequency === "monthly") {
      for (let i = 1; runs.length < 3; i++) {
        const targetMonth = addMonths(now, i * interval);
        let date: Date;

        if (monthlyDayType === "Day") {
          // Specific day number
          if (monthlyOrdinal === "Last") {
            date = lastDayOfMonth(targetMonth);
          } else {
            const dayNum = parseInt(monthlyOrdinal);
            const lastDay = lastDayOfMonth(targetMonth).getDate();
            date = setDate(targetMonth, Math.min(dayNum, lastDay));
          }
        } else {
          // Specific weekday
          const targetDow = DAYS_OF_WEEK.indexOf(monthlyDayType);
          if (monthlyOrdinal === "Last") {
            const last = lastDayOfMonth(targetMonth);
            let d = new Date(last);
            while (d.getDay() !== targetDow) d = addDays(d, -1);
            date = d;
          } else {
            const nth = parseInt(monthlyOrdinal);
            const firstOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
            let d = new Date(firstOfMonth);
            while (d.getDay() !== targetDow) d = addDays(d, 1);
            d = addDays(d, (nth - 1) * 7);
            date = d;
          }
        }
        runs.push(date);
      }
    }
    return runs;
  }, [frequency, interval, weeklyDays, monthlyOrdinal, monthlyDayType]);

  // Notify parent of schedule change
  useMemo(() => {
    onScheduleChange?.(summary);
  }, [summary, onScheduleChange]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[380px] sm:max-w-[380px] flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Schedule Configuration
          </SheetTitle>
          <SheetDescription>Define when this workflow should run automatically.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-6 mt-4 overflow-y-auto">
          {/* Frequency */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Frequency</Label>
            <Select value={frequency} onValueChange={(v) => setFrequency(v as Frequency)}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Interval */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Every
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                max={99}
                value={interval}
                onChange={(e) => setInterval(Math.max(1, parseInt(e.target.value) || 1))}
                className="h-9 w-20"
              />
              <span className="text-sm text-muted-foreground">
                {frequency === "daily" ? (interval === 1 ? "day" : "days") : frequency === "weekly" ? (interval === 1 ? "week" : "weeks") : (interval === 1 ? "month" : "months")}
              </span>
            </div>
          </div>

          {/* Weekly: day selector */}
          {frequency === "weekly" && (
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">On days</Label>
              <ToggleGroup
                type="multiple"
                value={weeklyDays}
                onValueChange={setWeeklyDays}
                className="flex flex-wrap gap-1"
              >
                {DAYS_OF_WEEK.map((day, i) => (
                  <ToggleGroupItem
                    key={i}
                    value={String(i)}
                    className="h-8 w-10 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                  >
                    {day.slice(0, 2)}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          )}

          {/* Monthly: ordinal + day type */}
          {frequency === "monthly" && (
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">On the</Label>
              <div className="flex items-center gap-2">
                <Select value={monthlyOrdinal} onValueChange={setMonthlyOrdinal}>
                  <SelectTrigger className="h-9 w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {ORDINALS.map((o) => (
                      <SelectItem key={o} value={o}>{o}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={monthlyDayType} onValueChange={setMonthlyDayType}>
                  <SelectTrigger className="h-9 flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHLY_DAY_OPTIONS.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <Separator />

          {/* Summary */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Summary</Label>
            <div className="rounded-lg bg-muted/50 border border-border px-3 py-2.5">
              <p className="text-sm font-medium">{summary}</p>
            </div>
          </div>

          {/* Next 3 runs */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Next scheduled runs</Label>
            <div className="space-y-1.5">
              {nextRuns.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Select at least one day</p>
              ) : (
                nextRuns.map((date, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-md bg-muted/30 border border-border px-3 py-2">
                    <CalendarDays className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-sm">{format(date, "EEEE, MMMM d, yyyy")}</span>
                    {i === 0 && (
                      <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0">Next</Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
