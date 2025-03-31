import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, Link } from 'wouter';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductDetail } from '@/components/products/product-detail';
import { ProductCard } from '@/components/products/product-card';
import { ChevronRight, Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function ProductPage() {
  const [location] = useLocation();
  
  // Extract slug from URL
  const slug = location.split('/').pop() || '';
  
  // Fetch product by slug
  const { data: product, isLoading: productLoading, error: productError } = useQuery<Product>({
    queryKey: [`/api/products/${slug}`],
    queryFn: async () => {
      const response = await fetch(`/api/products/${slug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      return response.json();
    }
  });
  
  // Fetch related products
  const { data: relatedProducts, isLoading: relatedLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', { limit: 4 }],
    queryFn: async () => {
      const response = await fetch('/api/products?limit=4');
      if (!response.ok) {
        throw new Error('Failed to fetch related products');
      }
      return response.json();
    },
    enabled: !!product // Only fetch when product is available
  });
  
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);
  
  if (productLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }
  
  if (productError || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-6">Sorry, we couldn't find the product you're looking for.</p>
            <Link href="/products">
              <a className="text-primary-600 hover:text-primary-700 font-medium">Browse our collection</a>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="py-4 text-sm">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/">
                  <a className="text-gray-500 hover:text-primary-600">Home</a>
                </Link>
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
                <Link href="/products">
                  <a className="text-gray-500 hover:text-primary-600">Products</a>
                </Link>
              </li>
              <li className="flex items-center">
                <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
                <span className="text-gray-900">{product.name}</span>
              </li>
            </ol>
          </nav>
          
          {/* Product details */}
          <motion.div
            className="bg-white rounded-lg shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ProductDetail product={product} />
          </motion.div>
          
          {/* Tabs section */}
          <div className="my-12">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="p-6 bg-white rounded-lg shadow-sm mt-4">
                <div className="prose max-w-none">
                  <h3 className="text-lg font-medium mb-4">Product Description</h3>
                  <p>{product.description || 'No detailed description available for this product.'}</p>
                  
                  <p className="mt-4">
                    Our products are crafted with care and attention to detail, ensuring you receive quality garments that will last.
                    Each piece is designed to blend traditional aesthetics with contemporary styles, making them perfect for various occasions.
                  </p>
                  
                  <p className="mt-4">
                    Care instructions: Machine wash cold with similar colors. Gentle cycle. Do not bleach. Tumble dry low. Warm iron if needed.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="specifications" className="p-6 bg-white rounded-lg shadow-sm mt-4">
                <div>
                  <h3 className="text-lg font-medium mb-4">Product Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-b pb-2">
                      <span className="text-gray-600">Material:</span>
                      <span className="font-medium ml-2">Cotton Blend</span>
                    </div>
                    <div className="border-b pb-2">
                      <span className="text-gray-600">Fit:</span>
                      <span className="font-medium ml-2">Regular</span>
                    </div>
                    <div className="border-b pb-2">
                      <span className="text-gray-600">Pattern:</span>
                      <span className="font-medium ml-2">Solid</span>
                    </div>
                    <div className="border-b pb-2">
                      <span className="text-gray-600">Sleeve Length:</span>
                      <span className="font-medium ml-2">Full Sleeves</span>
                    </div>
                    <div className="border-b pb-2">
                      <span className="text-gray-600">Neck:</span>
                      <span className="font-medium ml-2">Round Neck</span>
                    </div>
                    <div className="border-b pb-2">
                      <span className="text-gray-600">Wash Care:</span>
                      <span className="font-medium ml-2">Machine Wash</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="p-6 bg-white rounded-lg shadow-sm mt-4">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium">Customer Reviews</h3>
                    <div className="flex items-center">
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const starValue = product.rating - i;
                          return (
                            <span key={i} className="flex-shrink-0">
                              {starValue >= 1 ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                </svg>
                              ) : starValue >= 0.5 ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/>
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                  <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>
                                </svg>
                              )}
                            </span>
                          );
                        })}
                      </div>
                      <span className="ml-2 text-gray-600">{product.rating} out of 5 ({product.reviewCount} reviews)</span>
                    </div>
                  </div>
                  
                  {/* Sample reviews - would be dynamic in a real app */}
                  <div className="space-y-6">
                    <div className="border-b pb-4">
                      <div className="flex items-center mb-2">
                        <div className="flex text-amber-400 text-sm">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < 5 ? 'fill-current' : ''}`} viewBox="0 0 24 24">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-900">Excellent quality</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        I absolutely love this product! The fabric is soft and the fit is perfect. Will definitely buy again.
                      </p>
                      <div className="mt-2 text-xs text-gray-500">Rahul S. - 1 month ago</div>
                    </div>
                    
                    <div className="border-b pb-4">
                      <div className="flex items-center mb-2">
                        <div className="flex text-amber-400 text-sm">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < 4 ? 'fill-current' : ''}`} viewBox="0 0 24 24">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-900">Good product</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        The material is good quality and the design is exactly as shown in the pictures. Shipping was also very quick.
                      </p>
                      <div className="mt-2 text-xs text-gray-500">Priya M. - 2 months ago</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Related products */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
            
            {relatedLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts?.filter(p => p.id !== product.id).slice(0, 4).map(relatedProduct => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
