"use client";

import { useState } from "react";

export default function ProjectGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [idx, setIdx] = useState(0);
  if (!images.length) return null;

  return (
    <div className="pgallery">
      <div className="pgallery__stage">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[idx]} alt={`${name} — image ${idx + 1}`} />
        {images.length > 1 && (
          <>
            <button
              type="button"
              className="pgallery__nav pgallery__nav--prev"
              aria-label="Previous image"
              onClick={() => setIdx((i) => (i <= 0 ? images.length - 1 : i - 1))}
            >
              ‹
            </button>
            <button
              type="button"
              className="pgallery__nav pgallery__nav--next"
              aria-label="Next image"
              onClick={() => setIdx((i) => (i >= images.length - 1 ? 0 : i + 1))}
            >
              ›
            </button>
            <span className="pgallery__count">
              {idx + 1} / {images.length}
            </span>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="pgallery__thumbs">
          {images.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              className={`pgallery__thumb${i === idx ? " active" : ""}`}
              aria-label={`Show image ${i + 1}`}
              onClick={() => setIdx(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
