export type Category = "mechanical" | "product" | "printing";

export interface Project {
  id?: string;
  slug: string;
  name: string;
  category: Category;
  image_url: string;
  image_urls?: string[];
  blurb: string;
  tags: string[];
  featured?: boolean;
  published?: boolean;
  sort?: number;
}

export interface Post {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_url: string | null;
  body: string; // markdown
  tags: string[];
  published?: boolean;
  created_at?: string;
}

export const CATEGORIES: Record<Category, { label: string; tagline: string }> = {
  mechanical: {
    label: "Mechanical & Industrial",
    tagline: "Functional parts, assemblies and production engineering.",
  },
  product: {
    label: "Product Design & 3D Modeling",
    tagline: "Consumer products and industrial design, concept to CAD.",
  },
  printing: {
    label: "3D Printing & Reverse Engineering",
    tagline: "Printed parts, spare parts and reverse-engineered geometry.",
  },
};

export function catLabel(c: string): string {
  return (CATEGORIES as Record<string, { label: string }>)[c]?.label ?? c;
}
