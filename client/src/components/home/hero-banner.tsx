import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const bannerData = [
  {
    id: 1,
    title: "Redefining Summer Style",
    subTitle: "Discover the perfect blend of comfort and elegance with our fresh summer collection",
    image: "/assets/mint-striped-shirt.png",
    tag: "NEW ARRIVAL",
    collection: "Summer Collection 2023",
    discount: "30% OFF"
  },
  {
    id: 2,
    title: "Elegant Ethnic Wear",
    subTitle: "Celebrate traditions with our premium collection of ethnic wear",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b",
    tag: "FESTIVE COLLECTION",
    collection: "Wedding Season 2023",
    discount: "25% OFF"
  },
  {
    id: 3,
    title: "Modern Western Styles",
    subTitle: "Contemporary fashion for the modern lifestyle",
    image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9",
    tag: "TRENDING NOW",
    collection: "Western Collection 2023",
    discount: "20% OFF"
  }
];

export function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % bannerData.length);
    }, 6000);
  };
  
  useEffect(() => {
    startAutoSlide();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);
  
  const handleSlideChange = (index: number) => {
    if (isAnimating) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentSlide(index);
    startAutoSlide();
  };
  
  const handleNext = () => {
    if (isAnimating) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentSlide(prev => (prev + 1) % bannerData.length);
    startAutoSlide();
  };
  
  const handlePrev = () => {
    if (isAnimating) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentSlide(prev => (prev - 1 + bannerData.length) % bannerData.length);
    startAutoSlide();
  };

  const current = bannerData[currentSlide];

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-primary-50 to-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
          <motion.div 
            className="space-y-4 sm:space-y-6 text-center md:text-left order-2 md:order-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence mode="wait">
              <motion.h1 
                key={`title-${current.id}`}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                onAnimationStart={() => setIsAnimating(true)}
                onAnimationComplete={() => setIsAnimating(false)}
              >
                {current.title.split(" ").map((word, i, arr) => 
                  i === arr.length - 1 ? (
                    <span key={i}> <span className="text-primary-600">{word}</span></span>
                  ) : (
                    <span key={i}>{word} </span>
                  )
                )}
              </motion.h1>
            </AnimatePresence>
            
            <AnimatePresence mode="wait">
              <motion.p 
                key={`subtitle-${current.id}`}
                className="text-base sm:text-lg text-gray-600 max-w-md mx-auto md:mx-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {current.subTitle}
              </motion.p>
            </AnimatePresence>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
              <Button 
                variant="black"
                size="lg"
                className="rounded-full shadow-md hover:scale-105 transition duration-300 ease-in-out"
                asChild
              >
                <Link href="/products">Shop Now</Link>
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="rounded-full shadow-md hover:bg-gray-50 border-primary-600 text-primary-600"
                asChild
              >
                <Link href="/products">Explore Collections</Link>
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-4 pt-2">
              <span className="text-xs sm:text-sm text-gray-500">Trending:</span>
              <Link href="/products?tag=summer" className="text-xs sm:text-sm text-gray-700 hover:text-primary-600">#SummerCollection</Link>
              <Link href="/products?tag=festive" className="text-xs sm:text-sm text-gray-700 hover:text-primary-600">#FestiveLook</Link>
            </div>
          </motion.div>
          
          <div className="relative order-1 md:order-2 mb-6 md:mb-0">
            <AnimatePresence mode="wait">
              <motion.div 
                key={`image-${current.id}`}
                className="relative rounded-lg overflow-hidden shadow-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <img 
                  src={current.image.startsWith('/assets') ? current.image : `${current.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=1000&q=80`} 
                  alt="Latest fashion collection showcase" 
                  className="w-full h-auto object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/800x1000/e2e8f0/64748b?text=Image+Error';
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/60 to-transparent">
                  <span className="inline-block px-3 py-1 sm:px-4 sm:py-1 bg-primary-600 text-white text-xs font-bold rounded-full">
                    {current.tag}
                  </span>
                  <h3 className="mt-2 text-lg sm:text-xl font-bold text-white">{current.collection}</h3>
                </div>
              </motion.div>
            </AnimatePresence>
            
            <motion.div 
              className="absolute -bottom-4 -right-4 bg-white p-2 sm:p-3 rounded-full shadow-lg"
              initial={{ rotate: 12 }}
              animate={{ rotate: 12 }}
              whileHover={{ rotate: 0, scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="font-accent text-base sm:text-lg font-bold text-primary-600">{current.discount}</span>
            </motion.div>
            
            {/* Navigation arrows */}
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 lg:block hidden">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full opacity-70 hover:opacity-100"
                onClick={handlePrev}
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </div>
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 lg:block hidden">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full opacity-70 hover:opacity-100"
                onClick={handleNext}
                aria-label="Next slide"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile navigation controls */}
      <div className="md:hidden flex justify-center gap-4 mt-4 mb-6">
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full opacity-70 hover:opacity-100 h-10 w-10"
          onClick={handlePrev}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full opacity-70 hover:opacity-100 h-10 w-10"
          onClick={handleNext}
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Slide indicators */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {bannerData.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors duration-300 ${
              index === currentSlide ? 'bg-primary-600' : 'bg-gray-300 hover:bg-primary-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
