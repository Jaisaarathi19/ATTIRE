import { useEffect } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { useCart } from '@/components/cart/cart-drawer';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/components/cart/cart-item';
import { ShoppingBag, ChevronRight, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export default function CartPage() {
  const { cartItems, removeItem, updateQuantity, subtotal } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to proceed with checkout",
        variant: "destructive"
      });
      return;
    }
    
    if (cartItems.length === 0) {
      toast({
        title: "Empty cart",
        description: "Add some items to your cart before checkout",
        variant: "destructive"
      });
      return;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            <Link href="/products">
              <Button variant="ghost" className="flex items-center text-primary-600">
                Continue Shopping <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {cartItems.length === 0 ? (
            <motion.div 
              className="bg-white rounded-lg shadow p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col items-center">
                <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                <h2 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
                <Button asChild>
                  <Link href="/products">Browse Products</Link>
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div 
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-medium text-gray-900">Cart Items ({cartItems.length})</h2>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:bg-red-50"
                        onClick={() => {
                          cartItems.forEach(item => removeItem(item.id));
                          toast({
                            title: "Cart cleared",
                            description: "All items have been removed from your cart",
                          });
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Clear Cart
                      </Button>
                    </div>
                  </div>
                  
                  <div className="divide-y">
                    {cartItems.map(item => (
                      <div key={item.id} className="p-6">
                        <CartItem 
                          item={item} 
                          onRemove={removeItem} 
                          onUpdateQuantity={updateQuantity} 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="lg:col-span-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">₹{subtotal}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">{subtotal >= 999 ? 'Free' : '₹100'}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">₹{Math.round(subtotal * 0.18)}</span>
                    </div>
                    
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>₹{subtotal + (subtotal >= 999 ? 0 : 100) + Math.round(subtotal * 0.18)}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Including GST</p>
                    </div>
                    
                    <Button 
                      className="w-full mt-6" 
                      size="lg"
                      onClick={handleCheckout}
                      asChild
                    >
                      <Link href={user ? "/checkout" : "/auth"}>
                        Proceed to Checkout
                      </Link>
                    </Button>
                    
                    <div className="mt-4 text-sm text-gray-600">
                      <p className="flex items-center mb-2">
                        <ShoppingBag className="h-4 w-4 mr-2 text-primary-600" />
                        Free shipping on orders above ₹999
                      </p>
                      <p>Estimated delivery: 3-5 business days</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
