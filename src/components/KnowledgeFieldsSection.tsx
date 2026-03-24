import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { Plus, Pencil, Trash2 } from "lucide-react";

export interface KnowledgeField {
  id: string;
  title: string;
  value: string;
}

interface KnowledgeFieldsSectionProps {
  fields: KnowledgeField[];
  onFieldsChange: (fields: KnowledgeField[]) => void;
  onFieldChange?: () => void;
}

export function KnowledgeFieldsSection({ fields, onFieldsChange, onFieldChange }: KnowledgeFieldsSectionProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFieldTitle, setNewFieldTitle] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");
  const [deletingField, setDeletingField] = useState<string | null>(null);

  const openEditTitle = (id: string) => {
    const f = fields.find(x => x.id === id);
    if (f) { setEditTitle(f.title); setEditingField(id); }
  };

  const saveEditTitle = () => {
    if (editingField && editTitle.trim()) {
      onFieldsChange(fields.map(f => f.id === editingField ? { ...f, title: editTitle.trim() } : f));
      setEditingField(null);
      onFieldChange?.();
    }
  };

  const updateFieldValue = (id: string, value: string) => {
    onFieldsChange(fields.map(f => f.id === id ? { ...f, value } : f));
  };

  const addNewField = () => {
    if (newFieldTitle.trim()) {
      onFieldsChange([...fields, { id: `custom-${Date.now()}`, title: newFieldTitle.trim(), value: newFieldValue }]);
      setNewFieldTitle("");
      setNewFieldValue("");
      setShowAddModal(false);
      onFieldChange?.();
    }
  };

  const deleteField = (fieldId: string) => {
    onFieldsChange(fields.filter(f => f.id !== fieldId));
    setDeletingField(null);
    onFieldChange?.();
  };

  return (
    <>
      <div className="space-y-6">
        {fields.map((field) => (
          <div key={field.id} className="group/field relative flex gap-2">
            <div className="flex-1 space-y-1.5 min-w-0">
              <div className="flex items-center gap-1.5 group">
                <Label>{field.title}</Label>
                <button onClick={() => openEditTitle(field.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-accent">
                  <Pencil className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
              <MarkdownEditor value={field.value} onChange={(val) => { updateFieldValue(field.id, val); onFieldChange?.(); }} />
            </div>
            <div className="w-8 shrink-0 flex items-center justify-center">
              <button onClick={() => setDeletingField(field.id)} className="opacity-0 group-hover/field:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-destructive/10">
                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
              </button>
            </div>
          </div>
        ))}
        <div className="flex justify-center pt-2">
          <Tooltip delayDuration={1000}>
            <TooltipTrigger asChild>
              <button onClick={() => setShowAddModal(true)} className="h-8 w-8 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center hover:border-primary hover:text-primary transition-colors text-muted-foreground">
                <Plus className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              Add new knowledge field
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Edit Title Dialog */}
      <Dialog open={!!editingField} onOpenChange={(open) => !open && setEditingField(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Edit Field Title</DialogTitle><DialogDescription>Change the title of this knowledge field.</DialogDescription></DialogHeader>
          <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveEditTitle()} autoFocus />
          <DialogFooter><Button variant="outline" onClick={() => setEditingField(null)}>Cancel</Button><Button onClick={saveEditTitle} disabled={!editTitle.trim()}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Field Dialog */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Add Knowledge Field</DialogTitle><DialogDescription>Create a new knowledge field for this product.</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Field Title</Label>
              <Input value={newFieldTitle} onChange={(e) => setNewFieldTitle(e.target.value)} placeholder="e.g. Target Audience, USP" autoFocus />
            </div>
            <div className="space-y-1.5">
              <Label>Content</Label>
              <div className="min-h-[200px] [&_.milkdown]:min-h-[180px]">
                <MarkdownEditor value={newFieldValue} onChange={(val) => setNewFieldValue(val)} />
              </div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button><Button onClick={addNewField} disabled={!newFieldTitle.trim()}>Add Field</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deletingField} onOpenChange={(open) => !open && setDeletingField(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Delete Field</DialogTitle><DialogDescription>Are you sure you want to delete "{fields.find(f => f.id === deletingField)?.title}"? This cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setDeletingField(null)}>Cancel</Button><Button variant="destructive" onClick={() => deletingField && deleteField(deletingField)}>Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
