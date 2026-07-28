"use client";

import { useState } from "react";

type Props = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  onUpload: (file: File) => Promise<string | void>;
  onStatus?: (message: string) => void;
};

export default function ImageField({ label, value, onChange, onUpload, onStatus }: Props) {
  const [busy, setBusy] = useState(false);

  const pickFile = async (file: File) => {
    setBusy(true);
    onStatus?.("Uploading…");
    try {
      const url = await onUpload(file);
      if (typeof url === "string" && url) onChange(url);
      onStatus?.("Image uploaded ✓");
    } catch (e) {
      onStatus?.("Upload failed: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <label>{label}</label>
      <div className="img-field">
        {value && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img className="imgprev" src={value} alt="" />
        )}
        <div className="img-field__opts">
          <div>
            <span className="img-field__sublabel">Upload file</span>
            <input
              type="file"
              accept="image/*"
              disabled={busy}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) pickFile(file);
                e.target.value = "";
              }}
            />
          </div>
          <div>
            <span className="img-field__sublabel">Or paste image URL</span>
            <input
              type="url"
              placeholder="https://… or /projects/example.jpg"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
            <p className="img-field__hint">Use upload for Supabase Storage, or paste any public image link.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
