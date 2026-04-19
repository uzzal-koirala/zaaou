import { useRef } from "react";
import { Bold, Italic, Heading2, Link2, List, ListOrdered, Quote, Image as ImageIcon, Code } from "lucide-react";
import { toast } from "sonner";

type Props = {
  value: string;
  onChange: (next: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
};

/**
 * Lightweight markdown editor toolbar. Wraps or inserts markdown syntax
 * around the current selection inside the linked textarea. Supports
 * inserting images mid-article so writers can place visuals between
 * paragraphs without learning markdown.
 */
export function MarkdownToolbar({ value, onChange, textareaRef }: Props) {
  function withSelection(
    transform: (selected: string, before: string, after: string) => { next: string; cursor: number },
  ) {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const before = value.slice(0, start);
    const after = value.slice(end);
    const selected = value.slice(start, end);
    const { next, cursor } = transform(selected, before, after);
    onChange(next);
    // restore focus + caret after React updates the value
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(cursor, cursor);
    });
  }

  function wrap(prefix: string, suffix = prefix, placeholder = "") {
    withSelection((sel, before, after) => {
      const text = sel || placeholder;
      const next = `${before}${prefix}${text}${suffix}${after}`;
      const cursor = before.length + prefix.length + text.length + suffix.length;
      return { next, cursor };
    });
  }

  function linePrefix(prefix: string) {
    withSelection((sel, before, after) => {
      const block = sel || "text";
      const lines = block.split("\n").map((l) => `${prefix}${l}`).join("\n");
      // ensure a blank line before if needed
      const sep = before.length === 0 || before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n";
      const next = `${before}${sep}${lines}${after}`;
      const cursor = before.length + sep.length + lines.length;
      return { next, cursor };
    });
  }

  function insertBlock(block: string, cursorOffset?: number) {
    withSelection((_sel, before, after) => {
      const sep = before.length === 0 || before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n";
      const trail = after.startsWith("\n") ? "" : "\n\n";
      const next = `${before}${sep}${block}${trail}${after}`;
      const cursor = before.length + sep.length + (cursorOffset ?? block.length);
      return { next, cursor };
    });
  }

  function insertImage() {
    const url = window.prompt("Image URL (paste a link to your image)");
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) {
      toast.error("Please enter a full URL starting with http(s)://");
      return;
    }
    const alt = window.prompt("Image caption / alt text (optional)") ?? "";
    const md = `![${alt}](${url})`;
    insertBlock(md);
    toast.success("Image inserted");
  }

  function insertLink() {
    const url = window.prompt("Link URL");
    if (!url) return;
    withSelection((sel, before, after) => {
      const text = sel || "link text";
      const md = `[${text}](${url})`;
      const next = `${before}${md}${after}`;
      const cursor = before.length + md.length;
      return { next, cursor };
    });
  }

  const Btn = ({
    onClick,
    label,
    children,
  }: {
    onClick: () => void;
    label: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="h-8 w-8 grid place-items-center rounded-lg text-foreground/70 hover:bg-muted hover:text-primary transition-colors"
    >
      {children}
    </button>
  );

  return (
    <div className="flex items-center gap-0.5 flex-wrap rounded-t-xl border border-input border-b-0 bg-muted/40 px-2 py-1.5">
      <Btn onClick={() => wrap("**", "**", "bold text")} label="Bold (Ctrl+B)">
        <Bold className="h-4 w-4" />
      </Btn>
      <Btn onClick={() => wrap("*", "*", "italic text")} label="Italic (Ctrl+I)">
        <Italic className="h-4 w-4" />
      </Btn>
      <Btn onClick={() => linePrefix("## ")} label="Heading 2">
        <Heading2 className="h-4 w-4" />
      </Btn>
      <div className="h-5 w-px bg-border mx-1" />
      <Btn onClick={insertLink} label="Insert link">
        <Link2 className="h-4 w-4" />
      </Btn>
      <Btn onClick={insertImage} label="Insert image">
        <ImageIcon className="h-4 w-4" />
      </Btn>
      <div className="h-5 w-px bg-border mx-1" />
      <Btn onClick={() => linePrefix("- ")} label="Bulleted list">
        <List className="h-4 w-4" />
      </Btn>
      <Btn onClick={() => linePrefix("1. ")} label="Numbered list">
        <ListOrdered className="h-4 w-4" />
      </Btn>
      <Btn onClick={() => linePrefix("> ")} label="Quote">
        <Quote className="h-4 w-4" />
      </Btn>
      <Btn onClick={() => wrap("`", "`", "code")} label="Inline code">
        <Code className="h-4 w-4" />
      </Btn>
      <span className="ml-auto text-[11px] text-muted-foreground pr-1 hidden sm:inline">
        Markdown supported · Tip: use <kbd className="rounded bg-background px-1 py-0.5 border border-border">![alt](url)</kbd> for images
      </span>
    </div>
  );
}

/**
 * Convenience hook that returns a textarea ref and a key handler that
 * adds Ctrl/Cmd+B and Ctrl/Cmd+I shortcuts.
 */
export function useMarkdownShortcuts(
  value: string,
  onChange: (next: string) => void,
  ref: React.RefObject<HTMLTextAreaElement | null>,
) {
  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const meta = e.metaKey || e.ctrlKey;
    if (!meta) return;
    const wrap = (chars: string) => {
      e.preventDefault();
      const ta = ref.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const sel = value.slice(start, end) || "text";
      const next = `${value.slice(0, start)}${chars}${sel}${chars}${value.slice(end)}`;
      onChange(next);
      requestAnimationFrame(() => {
        ta.focus();
        ta.setSelectionRange(start + chars.length, start + chars.length + sel.length);
      });
    };
    if (e.key.toLowerCase() === "b") wrap("**");
    if (e.key.toLowerCase() === "i") wrap("*");
  }
  return { onKeyDown };
}

// avoid unused-import lint when consumers only use the hook
useRef;
