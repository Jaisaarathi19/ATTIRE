import { motion } from 'framer-motion';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroBanner } from '@/components/home/hero-banner';
import { CategoryNavigation } from '@/components/home/category-navigation';
import { FeaturedProducts } from '@/components/home/featured-products';
import { CollectionShowcase } from '@/components/home/collection-showcase';
import { FeaturesSection } from '@/components/home/features-section';
import { TestimonialsSection } from '@/components/home/testimonials-section';
import { NewsletterSection } from '@/components/home/newsletter-section';
import { useEffect } from 'react';

export default function HomePage() {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <motion.main
        className="flex-grow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <HeroBanner />
        <CategoryNavigation />
        <FeaturedProducts />
        <CollectionShowcase />
        <FeaturesSection />
        <TestimonialsSection />
        <NewsletterSection />
      </motion.main>
      
      <Footer />
    </div>
  );
}
