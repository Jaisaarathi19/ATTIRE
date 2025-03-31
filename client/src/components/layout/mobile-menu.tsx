import React from "react";
import { Link } from "wouter";
import { X, User, Heart, ShoppingBag, Search } from "lucide-react";
import { useCart } from "@/components/cart/cart-drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { Category } from "@/types";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
}

export function MobileMenu({ isOpen, onClose, categories }: MobileMenuProps) {
  const { user } = useAuth();
  const { openCart } = useCart();
  const [searchQuery, setSearchQuery] = React.useState("");

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
      onClose();
    }
  };

  const handleCartClick = () => {
    onClose();
    openCart();
  };

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      <div className="sticky top-0 p-4 flex items-center justify-between shadow-sm bg-white">
        <Link href="/" onClick={onClose}>
          <span className="text-xl sm:text-2xl font-bold font-heading text-primary-600">ATTIRE</span>
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          aria-label="Close menu"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="p-4 pb-20">
        <form onSubmit={handleSearch} className="relative mb-6">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm w-full"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </form>
        
        <h3 className="font-medium text-gray-500 uppercase text-xs tracking-wider mb-3">Categories</h3>
        <nav className="space-y-1 mb-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products/category/${category.slug}`}
              className="flex items-center py-3 text-base font-medium text-gray-900 border-b border-gray-200 hover:text-primary-600 transition-colors"
              onClick={onClose}
            >
              {category.name}
            </Link>
          ))}
          <Link
            href="/products"
            className="flex items-center py-3 text-base font-medium text-gray-900 border-b border-gray-200 hover:text-primary-600 transition-colors"
            onClick={onClose}
          >
            All Products
          </Link>
        </nav>
        
        <h3 className="font-medium text-gray-500 uppercase text-xs tracking-wider mb-3">Account</h3>
        <div className="space-y-4">
          <Link
            href={user ? "/account" : "/auth"}
            className="flex items-center py-2 text-gray-900 hover:text-primary-600 transition-colors"
            onClick={onClose}
          >
            <User className="mr-3 h-5 w-5" /> 
            {user ? "My Account" : "Login / Register"}
          </Link>
          <Link
            href="/wishlist"
            className="flex items-center py-2 text-gray-900 hover:text-primary-600 transition-colors"
            onClick={onClose}
          >
            <Heart className="mr-3 h-5 w-5" /> Wishlist
          </Link>
          <button
            onClick={handleCartClick}
            className="flex items-center py-2 text-gray-900 hover:text-primary-600 transition-colors w-full text-left"
          >
            <ShoppingBag className="mr-3 h-5 w-5" /> Cart
          </button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Theme</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
