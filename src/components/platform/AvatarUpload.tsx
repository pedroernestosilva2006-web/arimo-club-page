import { Camera, LoaderCircle, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type AvatarUploadProps = {
  userId: string;
  value: string;
  name: string;
  onChange: (value: string) => void;
};

const bucket = "profile-avatars";
const maxFileSize = 5 * 1024 * 1024;
const acceptedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export function AvatarUpload({ userId, value, name, onChange }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const objectPath = `${userId}/avatar`;

  async function upload(file: File | undefined) {
    if (!file) return;
    setError(null);

    if (!acceptedTypes.has(file.type)) {
      setError("Use uma imagem JPG, PNG ou WebP.");
      return;
    }
    if (file.size > maxFileSize) {
      setError("A imagem deve ter no máximo 5 MB.");
      return;
    }

    setBusy(true);
    const result = await supabase.storage.from(bucket).upload(objectPath, file, {
      upsert: true,
      contentType: file.type,
      cacheControl: "3600",
    });

    if (result.error) {
      setError("Não foi possível enviar a foto. Tente novamente.");
      setBusy(false);
      return;
    }

    const publicUrl = supabase.storage.from(bucket).getPublicUrl(objectPath).data.publicUrl;
    onChange(`${publicUrl}?v=${Date.now()}`);
    setBusy(false);
  }

  async function remove() {
    setBusy(true);
    setError(null);
    const result = await supabase.storage.from(bucket).remove([objectPath]);
    if (result.error) {
      setError("Não foi possível remover a foto agora.");
    } else {
      onChange("");
    }
    setBusy(false);
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/[0.04] text-xl uppercase text-white/62">
          {value ? (
            <img
              src={value}
              alt={`Foto de ${name || "membro ARIMO"}`}
              className="h-full w-full object-cover"
            />
          ) : (
            name.trim().slice(0, 1) || <Camera className="h-5 w-5" strokeWidth={1.4} />
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="inline-flex h-10 items-center gap-2 border border-white/20 px-4 text-[0.625rem] uppercase tracking-[0.16em] text-white/62 hover:border-white/50 hover:text-white disabled:opacity-45"
          >
            {busy ? (
              <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Camera className="h-3.5 w-3.5" />
            )}
            {value ? "Trocar foto" : "Enviar foto"}
          </button>
          {value && (
            <button
              type="button"
              onClick={remove}
              disabled={busy}
              aria-label="Remover foto"
              className="flex h-10 w-10 items-center justify-center border border-white/12 text-white/38 hover:border-white/40 hover:text-white disabled:opacity-45"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(event) => {
          void upload(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
      <p className="mt-3 text-xs leading-relaxed text-white/35">JPG, PNG ou WebP · até 5 MB</p>
      {error && <p className="mt-2 text-xs text-white/65">{error}</p>}
    </div>
  );
}
