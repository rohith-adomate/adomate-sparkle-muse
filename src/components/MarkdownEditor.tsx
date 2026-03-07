import { useEffect, useRef, useCallback } from "react";
import { Editor, rootCtx, defaultValueCtx } from "@milkdown/kit/core";
import { commonmark, toggleStrongCommand, toggleEmphasisCommand, wrapInHeadingCommand, wrapInBulletListCommand, wrapInOrderedListCommand, turnIntoTextCommand } from "@milkdown/kit/preset/commonmark";
import { history, undoCommand, redoCommand } from "@milkdown/kit/plugin/history";
import { Milkdown, MilkdownProvider, useEditor, useInstance } from "@milkdown/react";
import { callCommand } from "@milkdown/kit/utils";
import { listener, listenerCtx } from "@milkdown/kit/plugin/listener";
import {
  Bold, Italic, Heading1, Heading2, Heading3, Heading4,
  List, ListOrdered, Undo2, Redo2, Code2
} from "lucide-react";

interface ToolbarProps {
  className?: string;
}

function Toolbar({ className }: ToolbarProps) {
  const [loading, getInstance] = useInstance();

  const call = useCallback(
    <T,>(command: any, payload?: T) => {
      if (loading) return;
      getInstance()?.action(callCommand(command, payload));
    },
    [loading, getInstance]
  );

  const buttons = [
    { icon: Bold, action: () => call(toggleStrongCommand.key), title: "Bold" },
    { icon: Italic, action: () => call(toggleEmphasisCommand.key), title: "Italic" },
    { type: "separator" as const },
    { icon: Heading1, action: () => call(wrapInHeadingCommand.key, 1), title: "Heading 1" },
    { icon: Heading2, action: () => call(wrapInHeadingCommand.key, 2), title: "Heading 2" },
    { icon: Heading3, action: () => call(wrapInHeadingCommand.key, 3), title: "Heading 3" },
    { icon: Heading4, action: () => call(wrapInHeadingCommand.key, 4), title: "Heading 4" },
    { type: "separator" as const },
    { icon: List, action: () => call(wrapInBulletListCommand.key), title: "Bullet List" },
    { icon: ListOrdered, action: () => call(wrapInOrderedListCommand.key), title: "Ordered List" },
    { type: "separator" as const },
    { icon: Undo2, action: () => call(undoCommand.key), title: "Undo" },
    { icon: Redo2, action: () => call(redoCommand.key), title: "Redo" },
    { type: "separator" as const },
    { icon: Code2, action: () => call(turnIntoTextCommand.key), title: "Code Block" },
  ];

  return (
    <div className={`flex items-center gap-0.5 px-2 py-1.5 border-b border-border bg-muted/30 rounded-t-md ${className || ""}`}>
      {buttons.map((btn, i) => {
        if ("type" in btn && btn.type === "separator") {
          return <div key={i} className="w-px h-5 bg-border mx-1" />;
        }
        const Icon = (btn as any).icon;
        return (
          <button
            key={i}
            type="button"
            onClick={(btn as any).action}
            title={(btn as any).title}
            className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        );
      })}
    </div>
  );
}

interface EditorInnerProps {
  defaultValue: string;
  onChange?: (markdown: string) => void;
}

function EditorInner({ defaultValue, onChange }: EditorInnerProps) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEditor((root) => {
    return Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, defaultValue);
        ctx.get(listenerCtx).markdownUpdated((_ctx, markdown) => {
          onChangeRef.current?.(markdown);
        });
      })
      .use(commonmark)
      .use(history)
      .use(listener);
  }, [defaultValue]);

  return <Milkdown />;
}

interface MarkdownEditorProps {
  value: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function MarkdownEditor({ value, onChange, className }: MarkdownEditorProps) {
  return (
    <div className={`border border-input rounded-md overflow-hidden ${className || ""}`}>
      <MilkdownProvider>
        <Toolbar />
        <div className="milkdown-editor-wrapper px-3 py-2 min-h-[120px] prose prose-sm max-w-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 rounded-b-md">
          <EditorInner defaultValue={value} onChange={onChange} />
        </div>
      </MilkdownProvider>
    </div>
  );
}
