import React, { createContext, useContext, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem as CartItemComponent } from "@/components/cart/cart-item";
import { CartItem } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface CartContextProps {
  isOpen: boolean;
  cartItems: CartItem[];
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  subtotal: number;
  totalItems: number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export function CartDrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // Fetch cart items from the API if user is logged in
  const { data: apiCartItems, isLoading } = useQuery({
    queryKey: ["/api/cart", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const res = await fetch("/api/cart");
      if (!res.ok) throw new Error("Failed to fetch cart items");
      return res.json();
    },
    enabled: !!user
  });

  // Sync cart items when API data changes
  useEffect(() => {
    if (!isLoading && apiCartItems) {
      setCartItems(apiCartItems);
    }
  }, [apiCartItems, isLoading]);

  // Add item mutation
  const { mutate: addItemMutation } = useMutation({
    mutationFn: async (newItem: CartItem) => {
      if (!user) {
        // Handle local storage cart for non-logged in users
        setCartItems(prev => [...prev, newItem]);
        return newItem;
      }
      
      const res = await apiRequest("POST", "/api/cart", {
        productId: newItem.productId,
        quantity: newItem.quantity,
        size: newItem.size,
        color: newItem.color
      });
      
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      openCart();
    },
    onError: (error: Error) => {
      toast({
        title: "Error adding item",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Remove item mutation
  const { mutate: removeItemMutation } = useMutation({
    mutationFn: async (itemId: number) => {
      if (!user) {
        // Handle local storage cart for non-logged in users
        setCartItems(prev => prev.filter(item => item.id !== itemId));
        return;
      }
      
      await apiRequest("DELETE", `/api/cart/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart"
      });
    }
  });

  // Update quantity mutation
  const { mutate: updateQuantityMutation } = useMutation({
    mutationFn: async ({ id, quantity }: { id: number, quantity: number }) => {
      if (!user) {
        // Handle local storage cart for non-logged in users
        setCartItems(prev => 
          prev.map(item => 
            item.id === id ? { ...item, quantity } : item
          )
        );
        return;
      }
      
      const res = await apiRequest("PATCH", `/api/cart/${id}`, { quantity });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    }
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  
  const addItem = (item: CartItem) => {
    addItemMutation(item);
  };
  
  const removeItem = (id: number) => {
    removeItemMutation(id);
  };
  
  const updateQuantity = (id: number, quantity: number) => {
    updateQuantityMutation({ id, quantity });
  };

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to proceed with checkout",
        variant: "destructive"
      });
      closeCart();
      navigate("/auth");
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
    
    closeCart();
    navigate("/checkout");
  };

  return (
    <CartContext.Provider 
      value={{ 
        isOpen, 
        cartItems,
        openCart, 
        closeCart, 
        addItem, 
        removeItem, 
        updateQuantity,
        subtotal,
        totalItems
      }}
    >
      {children}
      
      {/* Cart Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeCart}
            />
            
            <motion.div
              className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-medium">Shopping Cart</h2>
                <Button variant="ghost" size="icon" onClick={closeCart}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {cartItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                  <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-center">Your cart is empty</p>
                  <Button 
                    variant="black"
                    className="mt-4"
                    onClick={() => {
                      closeCart();
                      navigate("/products");
                    }}
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-4">
                    {cartItems.map(item => (
                      <CartItemComponent
                        key={item.id}
                        item={item}
                        onRemove={removeItem}
                        onUpdateQuantity={updateQuantity}
                      />
                    ))}
                  </div>
                  
                  <div className="p-4 border-t">
                    <div className="flex justify-between text-base font-medium text-gray-900 mb-1">
                      <p>Subtotal</p>
                      <p>₹{subtotal}</p>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Shipping and taxes calculated at checkout</p>
                    <Button 
                      variant="black"
                      className="w-full mb-2" 
                      onClick={handleCheckout}
                    >
                      Proceed to Checkout
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        closeCart();
                        navigate("/products");
                      }}
                    >
                      Continue Shopping
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartDrawerProvider");
  }
  return context;
}
