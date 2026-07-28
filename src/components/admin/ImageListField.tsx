"use client";

import { useState } from "react";

type Props = {
  label: string;
  urls: string[];
  onChange: (urls: string[]) => void;
  onUpload: (file: File) => Promise<string>;
  onStatus?: (message: string) => void;
};

export default function ImageListField({ label, urls, onChange, onUpload, onStatus }: Props) {
  const [busy, setBusy] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const addUrl = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return;
    if (urls.includes(trimmed)) {
      onStatus?.("That image is already in the list");
      return;
    }
    onChange([...urls, trimmed]);
    setUrlInput("");
    onStatus?.("Image added ✓");
  };

  const removeAt = (index: number) => {
    onChange(urls.filter((_, i) => i !== index));
  };

  const pickFile = async (file: File) => {
    setBusy(true);
    onStatus?.("Uploading…");
    try {
      const url = await onUpload(file);
      if (url) addUrl(url);
      else onStatus?.("Image uploaded ✓");
    } catch (e) {
      onStatus?.("Upload failed: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <label>{label}</label>
      {urls.length > 0 && (
        <ul className="img-list">
          {urls.map((url, i) => (
            <li key={`${url}-${i}`} className="img-list__item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="imgprev" src={url} alt="" />
              <div className="img-list__meta">
                <span className="img-list__idx">{i === 0 ? "Cover" : `Image ${i + 1}`}</span>
                <button type="button" className="img-list__remove" onClick={() => removeAt(i)}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="img-field__opts" style={{ marginTop: urls.length ? ".75rem" : 0 }}>
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
          <div className="img-list__add">
            <input
              type="url"
              placeholder="https://… or /projects/example.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addUrl(urlInput);
                }
              }}
            />
            <button type="button" className="btn btn--sm" disabled={!urlInput.trim()} onClick={() => addUrl(urlInput)}>
              Add
            </button>
          </div>
          <p className="img-field__hint">First image is the cover on the projects grid. Upload or add multiple images.</p>
        </div>
      </div>
    </div>
  );
}
