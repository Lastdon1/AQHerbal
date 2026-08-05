import AnnouncementBar from "../components/home/AnnouncementBar";
import Header from "../components/home/Header";
import Navigation from "../components/home/Navigation";
import HeroSection from "../hero/HeroSection";
import HealthConcerns from "../components/home/HealthConcerns";
import FeaturedProducts from "../components/home/FeaturedProducts";
import OrganicProducts from "../components/home/OrganicProducts";
import CategoryGrid from "../components/home/CategoryGrid";
import WhyChooseAQ from "../components/home/WhyChooseAQ";
import BestSellers from "../components/home/BestSellers";
import TibbBanner from "../components/home/TibbBanner";
import Newsletter from "../components/home/Newsletter";
import CustomerReviews from "../components/home/CustomerReviews";
import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <Navigation />
      <HeroSection />
      <CategoryGrid />
      <HealthConcerns />
      <FeaturedProducts />
      <OrganicProducts />
      <WhyChooseAQ />
      <BestSellers />
      <TibbBanner />
      <CustomerReviews />
      <Newsletter />
      <Footer />
    </>
  );
}