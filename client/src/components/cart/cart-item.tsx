import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem as CartItemType } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
}

export function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  const { toast } = useToast();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleIncrease = () => {
    if (item.quantity < 10) {
      onUpdateQuantity(item.id, item.quantity + 1);
    } else {
      toast({
        title: "Maximum limit reached",
        description: "You can't add more than 10 of the same item",
        variant: "destructive",
      });
    }
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    setIsRemoving(true);
    // Wait for animation to complete before actual removal
    setTimeout(() => {
      onRemove(item.id);
    }, 300);
  };

  const itemTotal = item.product.price * item.quantity;

  return (
    <AnimatePresence>
      {!isRemoving && (
        <motion.div
          className="flex py-4 border-b relative group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
            <Link href={`/product/${item.product.slug}`}>
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="h-full w-full object-cover object-center"
              />
            </Link>
          </div>
          
          <div className="ml-4 flex flex-1 flex-col">
            <div>
              <div className="flex justify-between text-base font-medium text-gray-900">
                <Link href={`/product/${item.product.slug}`}>
                  <h3 className="hover:text-primary-600 transition-colors">
                    {item.product.name}
                  </h3>
                </Link>
                <p className="ml-4">₹{itemTotal}</p>
              </div>
              {(item.size || item.color) && (
                <p className="mt-1 text-sm text-gray-500">
                  {item.size && `Size: ${item.size}`}{item.size && item.color && ", "}
                  {item.color && `Color: ${item.color}`}
                </p>
              )}
            </div>
            <div className="flex flex-1 items-end justify-between text-sm">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-none"
                  onClick={handleDecrease}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="px-2 flex items-center justify-center min-w-[36px]">
                  {item.quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-none"
                  onClick={handleIncrease}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:bg-red-50"
                onClick={handleRemove}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
