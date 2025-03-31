import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Category } from '@/types';
import { ChevronRight } from 'lucide-react';

export function CategoryNavigation() {
  const { data: categories, isLoading, error } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <section className="bg-white py-6 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-heading text-gray-800">Shop By Category</h2>
            <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse"></div>
                <div className="mt-2 h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !categories) {
    return (
      <section className="bg-white py-6 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-heading text-gray-800">Shop By Category</h2>
          </div>
          <div className="mt-6 text-center text-red-500">
            Failed to load categories. Please try again later.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-6 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-heading text-gray-800">Shop By Category</h2>
          <Link 
            href="/products" 
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
          >
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <Link 
              key={category.id} 
              href={`/products/category/${category.slug}`}
              className="flex flex-col items-center group"
            >
              <motion.div 
                className={`w-20 h-20 rounded-full flex items-center justify-center ${
                  index % 2 === 0 ? 'bg-secondary-50 group-hover:bg-secondary-100' : 'bg-primary-50 group-hover:bg-primary-100'
                } transition duration-300`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <img 
                  src={`${category.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120&q=80`} 
                  alt={category.name} 
                  className="w-16 h-16 rounded-full object-cover"
                />
              </motion.div>
              <span className="mt-2 text-sm font-medium text-gray-700 group-hover:text-primary-600 transition-colors">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
