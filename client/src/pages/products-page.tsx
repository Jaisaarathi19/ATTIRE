import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductCard } from '@/components/products/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { CategoryButton } from '@/components/products/category-button';
import { Product, Category } from '@/types';
import { Loader2, Search, SlidersHorizontal, X } from 'lucide-react';

export default function ProductsPage() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  
  // Parse the location to extract category from URL if present
  useEffect(() => {
    const match = location.match(/\/products\/category\/(.+)/);
    if (match) {
      setSelectedCategory(match[1]);
    } else {
      setSelectedCategory(null);
    }
    
    // Extract search query if present
    const searchParams = new URLSearchParams(location.split('?')[1]);
    const search = searchParams.get('search');
    if (search) {
      setSearchQuery(search);
    }
    
    // Scroll to top on component mount or route change
    window.scrollTo(0, 0);
  }, [location]);
  
  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return response.json();
    }
  });
  
  // Fetch products
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', { category: selectedCategory }],
    queryFn: async () => {
      let url = '/api/products';
      if (selectedCategory) {
        url += `?category=${selectedCategory}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    }
  });
  
  // Filter and sort products
  const filteredProducts = products ? products
    .filter(product => {
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return product.name.toLowerCase().includes(query) || 
               (product.description && product.description.toLowerCase().includes(query));
      }
      return true;
    })
    .filter(product => {
      // Filter by price range
      return product.price >= priceRange[0] && product.price <= priceRange[1];
    })
    .sort((a, b) => {
      // Sort products
      switch (sortOption) {
        case 'price-low-high':
          return a.price - b.price;
        case 'price-high-low':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'rating':
          return b.rating - a.rating;
        default:
          return b.trending ? 1 : -1; // featured
      }
    }) : [];
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update the URL with the search query without navigating
    const url = new URL(window.location.href);
    if (searchQuery) {
      url.searchParams.set('search', searchQuery);
    } else {
      url.searchParams.delete('search');
    }
    window.history.pushState({}, '', url.toString());
  };
  
  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setPriceRange([0, 10000]);
    setSortOption('featured');
    
    // Update the URL
    const url = new URL(window.location.href);
    url.search = '';
    window.history.pushState({}, '', url.toString());
  };
  
  const getCategoryName = () => {
    if (!selectedCategory || !categories) return 'All Products';
    const category = categories.find(c => c.slug === selectedCategory);
    return category ? category.name : 'All Products';
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {getCategoryName()}
            </h1>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="black"
                size="sm"
                className="md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                  <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters sidebar - desktop */}
            <div className="w-full md:w-64 space-y-6 hidden md:block">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <form onSubmit={handleSearchSubmit} className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2"
                    />
                  </div>
                </form>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="categories">
                    <AccordionTrigger className="text-sm font-medium">Categories</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {categoriesLoading ? (
                          <div className="flex justify-center py-2">
                            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                          </div>
                        ) : (
                          categories?.map(category => (
                            <CategoryButton
                              key={category.id}
                              active={selectedCategory === category.slug}
                              onClick={() => window.location.href = `/products/category/${category.slug}`}
                              className="block w-full text-left px-0"
                            >
                              {category.name}
                            </CategoryButton>
                          ))
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="price-range">
                    <AccordionTrigger className="text-sm font-medium">Price Range</AccordionTrigger>
                    <AccordionContent>
                      <Slider
                        defaultValue={[0, 10000]}
                        max={10000}
                        step={100}
                        value={priceRange}
                        onValueChange={handlePriceChange}
                        className="mt-6"
                      />
                      <div className="flex justify-between mt-2 text-sm text-gray-600">
                        <span>₹{priceRange[0]}</span>
                        <span>₹{priceRange[1]}</span>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="mt-4 w-full text-white bg-gray-900 border-gray-900 hover:bg-gray-800 hover:text-white"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
            
            {/* Filters sidebar - mobile */}
            {showFilters && (
              <motion.div
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="absolute right-0 top-0 h-full w-80 bg-white p-4 shadow-xl"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Filters</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFilters(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <form onSubmit={handleSearchSubmit} className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2"
                      />
                    </div>
                  </form>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="categories">
                      <AccordionTrigger className="text-sm font-medium">Categories</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {categoriesLoading ? (
                            <div className="flex justify-center py-2">
                              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                            </div>
                          ) : (
                            categories?.map(category => (
                              <CategoryButton
                                key={category.id}
                                active={selectedCategory === category.slug}
                                onClick={() => {
                                  window.location.href = `/products/category/${category.slug}`;
                                  setShowFilters(false);
                                }}
                                className="block w-full text-left px-0"
                              >
                                {category.name}
                              </CategoryButton>
                            ))
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="price-range">
                      <AccordionTrigger className="text-sm font-medium">Price Range</AccordionTrigger>
                      <AccordionContent>
                        <Slider
                          defaultValue={[0, 10000]}
                          max={10000}
                          step={100}
                          value={priceRange}
                          onValueChange={handlePriceChange}
                          className="mt-6"
                        />
                        <div className="flex justify-between mt-2 text-sm text-gray-600">
                          <span>₹{priceRange[0]}</span>
                          <span>₹{priceRange[1]}</span>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="mt-4 w-full text-white bg-gray-900 border-gray-900 hover:bg-gray-800 hover:text-white"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                  
                  <Button
                    variant="black"
                    className="mt-4 w-full"
                    onClick={() => setShowFilters(false)}
                  >
                    Apply Filters
                  </Button>
                </motion.div>
              </motion.div>
            )}
            
            {/* Product grid */}
            <div className="flex-1">
              {productsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredProducts.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-6">
                    Try adjusting your search or filter criteria to find what you're looking for.
                  </p>
                  <Button variant="black" onClick={clearFilters}>Clear Filters</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
