import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";
import { useCart } from "@/components/cart/cart-drawer";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();

  const { mutate: toggleWishlist } = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("You must be logged in to add items to your wishlist");
      }
      
      if (isWishlisted) {
        // This is simplified. In reality, you'd need the wishlist item ID
        await apiRequest("DELETE", `/api/wishlist/${product.id}`);
        return { added: false };
      } else {
        const res = await apiRequest("POST", "/api/wishlist", { productId: product.id });
        return { added: true, data: await res.json() };
      }
    },
    onSuccess: (data) => {
      setIsWishlisted(data.added);
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      toast({
        title: data.added ? "Added to wishlist" : "Removed from wishlist",
        description: data.added ? `${product.name} has been added to your wishlist` : `${product.name} has been removed from your wishlist`,
      });
    },
    onError: (error: Error) => {
      if (error.message.includes("logged in")) {
        toast({
          title: "Authentication required",
          description: "Please log in to add items to your wishlist",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  });

  const handleAddToCart = () => {
    addItem({ 
      id: 0, // Will be set by server
      productId: product.id,
      quantity: 1,
      userId: user?.id || 0,
      size: null,
      color: null,
      product
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist();
  };

  // Calculate discount percentage
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      className={cn(
        "product-card group relative bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-w-4 aspect-h-5">
          <img 
            src={product.images?.[0] || 'https://placehold.co/600x800/e2e8f0/64748b?text=No+Image'} 
            alt={product.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://placehold.co/600x800/e2e8f0/64748b?text=Image+Error';
            }}
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.trending && (
              <Badge variant="trending">TRENDING</Badge>
            )}
            {discountPercentage >= 20 && (
              <Badge variant="sale">SALE</Badge>
            )}
          </div>
          <div className="absolute top-2 right-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="p-1.5 rounded-full bg-white/80 backdrop-blur-sm text-gray-600 hover:text-primary-500 transition-colors duration-200"
              onClick={handleWishlistToggle}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={cn("h-5 w-5", isWishlisted && "fill-red-500 text-red-500")} />
            </Button>
          </div>
          
          <motion.div
            className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.2 }}
          >
            <Button 
              variant="default" 
              className="w-full py-2 bg-white text-primary-600 rounded-full font-medium text-sm hover:bg-primary-50 transition duration-300"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToCart();
              }}
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </motion.div>
        </div>
        
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-700 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          <div className="mt-1 flex items-center">
            <p className="text-base font-semibold text-gray-900">₹{product.price}</p>
            {product.originalPrice && (
              <>
                <p className="ml-2 text-sm text-gray-500 line-through">₹{product.originalPrice}</p>
                <p className="ml-2 text-xs font-medium text-green-600">{discountPercentage}% off</p>
              </>
            )}
          </div>
          <div className="mt-2 flex items-center">
            <div className="flex text-amber-400 text-xs">
              {Array.from({ length: 5 }).map((_, i) => {
                // Full, half, or empty star
                const starValue = (product.rating || 0) - i;
                return (
                  <span key={i}>
                    {starValue >= 1 ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                      </svg>
                    ) : starValue >= 0.5 ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                        <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"/>
                      </svg>
                    )}
                  </span>
                );
              })}
            </div>
            <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
