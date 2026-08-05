export interface NavItem {
  name: string;
  href: string;
}

export const navigation: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Categories", href: "/categories" },
  { name: "Health Concerns", href: "/health-concerns" },
  { name: "Knowledge Center", href: "/knowledge-center" },
  { name: "Blog", href: "/blog" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
]; 