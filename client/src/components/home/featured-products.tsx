import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import { ProductCard } from '@/components/products/product-card';
import { CategoryButton } from '@/components/products/category-button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ProductFilter = 'all' | 'new' | 'bestseller' | 'festival' | 'wedding' | 'summer';

export function FeaturedProducts() {
  const [activeFilter, setActiveFilter] = useState<ProductFilter>('all');
  
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products', { trending: true, limit: 8 }],
    queryFn: async () => {
      const response = await fetch('/api/products?trending=true&limit=8');
      if (!response.ok) {
        throw new Error('Failed to fetch trending products');
      }
      return response.json();
    }
  });

  const handlePrevClick = () => {
    const container = document.getElementById('categories-container');
    if (container) {
      container.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const handleNextClick = () => {
    const container = document.getElementById('categories-container');
    if (container) {
      container.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Filter products based on active filter
  // In a real app, this would use API filtering
  const getFilteredProducts = () => {
    if (!products) return [];
    
    if (activeFilter === 'all') return products;
    
    // Simulated filtering logic - in real app would use tags or categories
    const filterMap: Record<ProductFilter, (p: Product) => boolean> = {
      'all': () => true,
      'new': (p) => p.createdAt ? p.createdAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) : false,
      'bestseller': (p) => p.rating ? p.rating >= 4.5 : false,
      'festival': (p) => p.categoryId === 4, // Assuming 4 is Ethnic
      'wedding': (p) => p.price >= 3000,
      'summer': (p) => p.categoryId === 5 || p.categoryId === 2, // Western or Women
    };
    
    return products.filter(filterMap[activeFilter]);
  };

  const filteredProducts = getFilteredProducts();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 w-40 bg-gray-200 animate-pulse rounded"></div>
            <div className="flex space-x-2">
              <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full"></div>
              <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg aspect-[4/5]"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !products) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-500">
            Failed to load products. Please try again later.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-heading text-gray-900">Trending Now</h2>
          <div className="flex space-x-2">
            <Button
              id="prev-trending"
              variant="outline"
              size="icon"
              className="p-2 rounded-full text-gray-600 hover:bg-primary-100 hover:text-primary-600"
              onClick={handlePrevClick}
              aria-label="Previous category"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              id="next-trending"
              variant="outline"
              size="icon"
              className="p-2 rounded-full text-gray-600 hover:bg-primary-100 hover:text-primary-600"
              onClick={handleNextClick}
              aria-label="Next category"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div 
          id="categories-container"
          className="flex items-center border-b border-gray-200 pb-2 mb-6 overflow-x-auto md:justify-center scrollbar-hide"
        >
          <div className="flex items-center min-w-max gap-2 sm:gap-3 px-1">
            <CategoryButton 
              active={activeFilter === 'all'} 
              onClick={() => setActiveFilter('all')}
            >
              All
            </CategoryButton>
            <CategoryButton 
              active={activeFilter === 'new'} 
              onClick={() => setActiveFilter('new')}
            >
              New Arrivals
            </CategoryButton>
            <CategoryButton 
              active={activeFilter === 'bestseller'} 
              onClick={() => setActiveFilter('bestseller')}
            >
              Best Sellers
            </CategoryButton>
            <CategoryButton 
              active={activeFilter === 'festival'} 
              onClick={() => setActiveFilter('festival')}
            >
              Festival
            </CategoryButton>
            <CategoryButton 
              active={activeFilter === 'wedding'} 
              onClick={() => setActiveFilter('wedding')}
            >
              Wedding
            </CategoryButton>
            <CategoryButton 
              active={activeFilter === 'summer'} 
              onClick={() => setActiveFilter('summer')}
            >
              Summer
            </CategoryButton>
          </div>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {filteredProducts.map((product) => (
            <motion.div key={product.id} variants={item}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-10 text-center">
          <Button 
            variant="outline" 
            className="inline-flex items-center justify-center px-6 py-3 border border-primary-600 text-base font-medium rounded-full text-primary-600 hover:bg-primary-50"
            asChild
          >
            <Link href="/products">
              Browse All Products
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
