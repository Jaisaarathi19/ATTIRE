import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/components/cart/cart-drawer";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Share2, 
  ShoppingBag, 
  Package, 
  ShieldCheck 
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const { user } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();

  // Available sizes
  const sizes = ["S", "M", "L", "XL", "XXL"];
  
  // Available colors (normally would come from product data)
  const colors = [
    { name: "Black", hex: "#000000" },
    { name: "Navy", hex: "#0a1172" },
    { name: "Grey", hex: "#e0e0e0" },
    { name: "Charcoal", hex: "#36454f" }
  ];

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
    if (!selectedSize) {
      toast({
        title: "Size required",
        description: "Please select a size",
        variant: "destructive",
      });
      return;
    }

    if (!selectedColor) {
      toast({
        title: "Color required",
        description: "Please select a color",
        variant: "destructive",
      });
      return;
    }

    addItem({
      id: 0, // Will be set by server
      productId: product.id,
      quantity,
      userId: user?.id || 0,
      size: selectedSize,
      color: selectedColor,
      product
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this amazing product: ${product.name}`,
          url: window.location.href,
        });
      } catch (error) {
        toast({
          title: "Sharing failed",
          description: "Could not share this product",
        });
      }
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard",
      });
    }
  };

  // Calculate discount percentage
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8">
      {/* Product images */}
      <div className="space-y-4">
        <motion.div 
          className="relative aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <img 
            src={product.images[selectedImage]} 
            alt={product.name} 
            className="w-full h-full object-center object-cover"
          />
        </motion.div>
        <div className="grid grid-cols-4 gap-2">
          {product.images.map((image, index) => (
            <button
              key={index}
              className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden ${selectedImage === index ? 'ring-2 ring-primary-500' : ''}`}
              onClick={() => setSelectedImage(index)}
            >
              <img 
                src={image} 
                alt={`${product.name} view ${index + 1}`} 
                className="w-full h-full object-center object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Product info */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
        
        <div className="mt-2 flex items-center">
          <div className="flex text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => {
              // Full, half, or empty star
              const starValue = product.rating - i;
              return (
                <span key={i}>
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
          <span className="ml-2 text-sm text-gray-600">({product.reviewCount} reviews)</span>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center">
            <p className="text-2xl font-bold text-gray-900">₹{product.price}</p>
            {product.originalPrice && (
              <>
                <p className="ml-3 text-lg text-gray-500 line-through">₹{product.originalPrice}</p>
                <p className="ml-2 text-sm font-medium text-green-600">{discountPercentage}% off</p>
              </>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
        </div>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900">Description</h3>
          <p className="mt-2 text-sm text-gray-600">
            {product.description}
          </p>
        </div>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900">Size</h3>
          <div className="mt-2 grid grid-cols-5 gap-2">
            {sizes.map((size) => (
              <Button
                key={size}
                variant={selectedSize === size ? "default" : "outline"}
                className="text-sm py-2"
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </Button>
            ))}
          </div>
          <p className="mt-2 text-sm text-primary-600 cursor-pointer hover:underline">Size Guide</p>
        </div>
        
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900">Color</h3>
          <div className="mt-2 flex space-x-3">
            {colors.map((color) => (
              <button
                key={color.name}
                className={`h-8 w-8 rounded-full`}
                style={{ backgroundColor: color.hex }}
                onClick={() => setSelectedColor(color.name)}
                aria-label={`Color: ${color.name}`}
              >
                {selectedColor === color.name && (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-white drop-shadow-lg">
                      ✓
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-6 flex space-x-2">
          <div className="w-1/4">
            <select 
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full rounded-md border border-gray-300 py-2 text-base"
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          <Button
            className="w-3/4 bg-primary-600 text-white flex items-center justify-center"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
        </div>
        
        <div className="mt-4 flex items-center space-x-4">
          <Button 
            variant="outline"
            className="flex items-center"
            onClick={() => toggleWishlist()}
          >
            <Heart className={`mr-2 h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
          </Button>
          <Button 
            variant="outline"
            className="flex items-center"
            onClick={handleShare}
          >
            <Share2 className="mr-2 h-5 w-5" />
            Share
          </Button>
        </div>
        
        <div className="mt-6 border-t border-gray-200 pt-4 space-y-2">
          <div className="flex items-center text-sm">
            <Package className="text-primary-500 mr-2 h-5 w-5" />
            <span>Free delivery on orders above ₹999</span>
          </div>
          <div className="flex items-center text-sm">
            <ShieldCheck className="text-primary-500 mr-2 h-5 w-5" />
            <span>COD available</span>
          </div>
        </div>
      </div>
    </div>
  );
}
