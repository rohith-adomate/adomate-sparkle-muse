import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ChevronsRight, Sparkles, Trash2 } from "lucide-react";
import type { DatasetColumn, DatasetRow } from "./types";
import { getColumnStats } from "./mockData";

const AI_STYLED_COLS = new Set(["col-alignment"]);

interface Props {
  column: DatasetColumn;
  rows: DatasetRow[];
  onClose: () => void;
  onUpdateColumn: (col: DatasetColumn) => void;
  onDeleteColumn: (id: string) => void;
}

export default function ColumnInspectorPanel({ column, rows, onClose, onUpdateColumn, onDeleteColumn }: Props) {
  const stats = getColumnStats(column.templateId || column.id, rows);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const isAiStyled = column.type === "ai" || AI_STYLED_COLS.has(column.id);

  return (
    <div className="w-72 shrink-0 border-l border-border bg-card flex flex-col overflow-y-auto animate-slide-in-right">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="text-sm font-semibold truncate">{column.name}</h3>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={onClose}><ChevronsRight className="h-4 w-4" /></Button>
      </div>
      <div className="flex-1 p-4 space-y-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">Prompt</p>
          <Textarea value={column.aiPrompt || ""} onChange={(e) => onUpdateColumn({ ...column, aiPrompt: e.target.value })} placeholder="Describe what the AI should analyze or extract..." className="text-xs min-h-[80px] resize-none" />
        </div>
        {stats && (
          <>
            <Separator />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">{stats.label}</p>
              <div className="space-y-1.5">
                {stats.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {isAiStyled && (
          <>
            <Separator />
            <Button variant="ghost" size="sm" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 text-xs gap-1.5" onClick={() => setConfirmOpen(true)}>
              <Trash2 className="h-3.5 w-3.5" /> Delete Column
            </Button>
          </>
        )}
      </div>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete column</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{column.name}"? This action cannot be undone and all generated data in this column will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => onDeleteColumn(column.id)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
