import HeroSection from "@/components/hero/HeroSection";
import HealthConcerns from "@/components/home/HealthConcerns";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HerbsProducts from "@/components/home/HerbsProducts";
import MurabbaJatProducts from "@/components/home/MurabbaJatProducts";
import NuskhajatProducts from "@/components/home/NuskhajatProducts";
import WhyChooseISACO from "@/components/home/WhyChooseISACO";
import CustomerReviews from "@/components/home/CustomerReviews";
import Newsletter from "@/components/home/Newsletter";

import { getHealthConcerns } from "@/lib/health-concerns";
import { getFeaturedProducts } from "@/lib/featured-products";
import { getHerbsProducts } from "@/lib/herbs-products";
import { getMurabbaJatProducts } from "@/lib/murabba-jat-products";
import { getNuskhajatProducts } from "@/lib/nuskhajat-products";

export default async function Home() {
  const [
    healthConcerns,
    featuredProducts,
    herbsProducts,
    murabbaJatProducts,
    nuskhajatProducts,
  ] = await Promise.all([
    getHealthConcerns(),
    getFeaturedProducts(),
    getHerbsProducts(),
    getMurabbaJatProducts(),
    getNuskhajatProducts(),
  ]);

  return (
    <>
      <HeroSection />

      <HealthConcerns
        healthConcerns={healthConcerns}
      />

      <FeaturedProducts
        products={featuredProducts}
      />

      <HerbsProducts
        products={herbsProducts}
      />

      <MurabbaJatProducts
        products={murabbaJatProducts}
      />

      <NuskhajatProducts
        products={nuskhajatProducts}
      />

      <WhyChooseISACO />

      

      <CustomerReviews />

      <Newsletter />
    </>
  );
}