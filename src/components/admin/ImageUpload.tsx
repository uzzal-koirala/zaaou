import { useRef, useState } from "react";
import { Upload, X, Loader2, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const BUCKET = "public-images";
const MAX_MB = 5;

type Props = {
  value: string;
  onChange: (url: string) => void;
  /** Subfolder inside the bucket (e.g. "restaurants", "authors") */
  folder?: string;
  /** Visual aspect — "cover" wide rectangle, "avatar" round, "square" 1:1 */
  variant?: "cover" | "avatar" | "square";
  label?: string;
};

export function ImageUpload({
  value,
  onChange,
  folder = "uploads",
  variant = "cover",
  label,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  async function uploadFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`Image must be smaller than ${MAX_MB}MB`);
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const path = `${folder}/${safeName}`;

      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (upErr) throw upErr;

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      onChange(data.publicUrl);
      toast.success("Image uploaded");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      toast.error(msg);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function onSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void uploadFile(file);
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void uploadFile(file);
  }

  function clear() {
    onChange("");
  }

  const aspectCls =
    variant === "avatar"
      ? "aspect-square rounded-full"
      : variant === "square"
        ? "aspect-square rounded-lg"
        : "aspect-video rounded-lg";

  const sizeCls =
    variant === "avatar"
      ? "max-w-[96px]"
      : variant === "square"
        ? "max-w-[140px]"
        : "w-full max-w-md";

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wide text-foreground/80">
          {label}
        </label>
      )}

      {value ? (
        <div className={`relative ${sizeCls}`}>
          <div className={`overflow-hidden bg-muted ${aspectCls}`}>
            <img src={value} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="absolute top-2 right-2 flex gap-1.5">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="h-8 px-2.5 rounded-md bg-card/95 backdrop-blur text-xs font-semibold border border-border shadow-sm hover:bg-card disabled:opacity-50"
              title="Replace image"
            >
              {uploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                "Replace"
              )}
            </button>
            <button
              type="button"
              onClick={clear}
              disabled={uploading}
              className="h-8 w-8 grid place-items-center rounded-md bg-card/95 backdrop-blur border border-border shadow-sm hover:bg-destructive hover:text-destructive-foreground hover:border-destructive disabled:opacity-50"
              title="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={[
            "relative cursor-pointer flex flex-col items-center justify-center text-center",
            "border-2 border-dashed transition-colors",
            aspectCls,
            sizeCls,
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border bg-muted/40 hover:border-primary/50 hover:bg-muted",
            uploading && "pointer-events-none opacity-70",
          ].join(" ")}
        >
          {uploading ? (
            <>
              <Loader2 className="h-7 w-7 text-primary animate-spin" />
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                Uploading…
              </p>
            </>
          ) : (
            <>
              <div className="h-12 w-12 rounded-full bg-primary/10 grid place-items-center">
                {variant === "avatar" ? (
                  <ImagePlus className="h-5 w-5 text-primary" />
                ) : (
                  <Upload className="h-5 w-5 text-primary" />
                )}
              </div>
              <p className="mt-2 text-sm font-semibold text-foreground">
                Click or drop image
              </p>
              <p className="text-[11px] text-muted-foreground">
                PNG, JPG, WEBP — max {MAX_MB}MB
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onSelect}
      />
    </div>
  );
}
