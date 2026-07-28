-- Multiple images per project (gallery). Keeps image_url as cover / first image for compatibility.

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS image_urls text[] NOT NULL DEFAULT '{}';

UPDATE public.projects
SET image_urls = ARRAY[image_url]
WHERE image_url <> '' AND (image_urls IS NULL OR image_urls = '{}');
