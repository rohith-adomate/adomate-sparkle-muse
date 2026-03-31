import { useState, useEffect, useRef } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function FeedbackPopover() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isEditable = tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable;
      if (e.key === "f" && !e.metaKey && !e.ctrlKey && !e.altKey && !isEditable) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => textareaRef.current?.focus(), 50);
  }, [open]);

  const handleSend = () => {
    if (!message.trim()) return;
    toast.success("Thanks for your feedback!");
    setMessage("");
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
          Feedback
          <kbd className="pointer-events-none h-5 min-w-5 px-1 rounded bg-muted text-[11px] font-medium text-muted-foreground flex items-center justify-center border">
            F
          </kbd>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-[380px] p-4">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Have an idea to improve this page? Tell the Adomate team"
          className="w-full h-28 resize-none rounded-lg bg-muted/50 border p-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-muted-foreground">
            Need help?{" "}
            <a
              href="https://calendly.com/lucas-adomate/meet-with-lucas-from-adomate"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Contact us
            </a>
          </p>
          <Button size="sm" onClick={handleSend} disabled={!message.trim()} className="gap-1.5">
            Send
            <kbd className="pointer-events-none flex items-center gap-0.5 rounded bg-primary-foreground/20 px-1 py-0.5 text-[10px] font-medium text-primary-foreground">
              ⌘ ↵
            </kbd>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
