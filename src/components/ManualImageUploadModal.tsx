import { useState, useCallback, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Upload, Play } from "lucide-react";

interface ManualImageUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (files: File[]) => void;
}

export default function ManualImageUploadModal({ open, onOpenChange, onConfirm }: ManualImageUploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const imageFiles = Array.from(newFiles).filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...imageFiles]);
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const handleConfirm = () => {
    onConfirm(files);
    setFiles([]);
  };

  const handleOpenChange = (v: boolean) => {
    if (!v) setFiles([]);
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <div className="rounded-lg p-1.5" style={{ background: "hsl(35 90% 55% / 0.12)" }}>
              <ImagePlus className="h-4 w-4" style={{ color: "hsl(35 90% 55%)" }} />
            </div>
            Upload Images to Run
          </DialogTitle>
        </DialogHeader>

        <p className="text-xs text-muted-foreground -mt-1">
          This workflow requires manual image input. Upload one or more images to start the run.
        </p>

        {/* Drop zone */}
        <div
          className={`relative rounded-xl border-2 border-dashed transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 py-8 ${
            dragOver ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/40"
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-6 w-6 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Drag & drop images or <span className="text-primary font-medium">browse</span>
          </p>
          <p className="text-[10px] text-muted-foreground/60">PNG, JPG, WEBP supported</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }}
          />
        </div>

        {/* Thumbnails */}
        {files.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {files.length} image{files.length !== 1 ? "s" : ""} selected
            </p>
            <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
              {files.map((file, i) => (
                <div key={i} className="relative group aspect-square rounded-lg border border-border overflow-hidden bg-muted">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                    className="absolute top-0.5 right-0.5 h-5 w-5 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="gap-1.5 bg-success hover:bg-success/90 text-success-foreground"
            disabled={files.length === 0}
            onClick={handleConfirm}
          >
            <Play className="h-3.5 w-3.5" />
            Run Workflow
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
