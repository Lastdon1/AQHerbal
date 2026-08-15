export interface PopularCategory {
  id: number;
  title: string;
  urdu: string;
  slug: string;
  image: string;
  color: string;
}

export const popularCategories: PopularCategory[] = [
  {
    id: 1,
    title: "Digestive Health",
    urdu: "ہاضمہ",
    slug: "digestive-health",
    image: "/categories/digestive.png",
    color: "#2E7D32",
  },
  {
    id: 2,
    title: "Liver Care",
    urdu: "جگر کے لیے",
    slug: "liver-care",
    image: "/categories/liver.png",
    color: "#8D6E63",
  },
  {
    id: 3,
    title: "Blood Purifier",
    urdu: "خون صاف کرنے والے",
    slug: "blood-purifier",
    image: "/categories/blood.png",
    color: "#D32F2F",
  },
  {
    id: 4,
    title: "Men's Health",
    urdu: "مردانہ صحت",
    slug: "mens-health",
    image: "/categories/mens-health.png",
    color: "#1565C0",
  },
  {
    id: 5,
    title: "Women's Health",
    urdu: "خواتین کی صحت",
    slug: "womens-health",
    image: "/categories/womens-health.png",
    color: "#EC407A",
  },
  {
    id: 6,
    title: "Joint Pain",
    urdu: "جوڑوں کا درد",
    slug: "joint-pain",
    image: "/categories/joint-pain.png",
    color: "#F57C00",
  },
  {
    id: 7,
    title: "Respiratory",
    urdu: "سانس کے امراض",
    slug: "respiratory",
    image: "/categories/respiratory.png",
    color: "#00838F",
  },
  {
    id: 8,
    title: "General Wellness",
    urdu: "عام صحت",
    slug: "general-wellness",
    image: "/categories/general-wellness.png",
    color: "#6A1B9A",
  },
];