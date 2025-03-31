import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/components/cart/cart-drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  Sun,
  Moon,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useQuery } from "@tanstack/react-query";
import { MobileMenu } from "@/components/layout/mobile-menu";

export function Header() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, navigate] = useLocation();
  
  const { user } = useAuth();
  const { cartItems, openCart } = useCart();
  
  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const totalCartItems = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <header className={`sticky top-0 bg-white z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 md:justify-start md:space-x-10">
          {/* Logo */}
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold font-heading text-primary-600">ATTIRE</span>
              <span className="text-xs text-secondary-500 ml-1 font-accent">Fashion Redefined</span>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="-mr-2 -my-2 md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowMobileMenu(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          
          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex space-x-10">
            {categories?.map((category: any) => (
              <Link 
                key={category.id} 
                href={`/products/category/${category.slug}`}
                className="text-base font-medium text-gray-500 hover:text-primary-600 transition-colors"
              >
                {category.name}
              </Link>
            ))}
            <Link href="/products" className="text-base font-medium text-gray-500 hover:text-primary-600 transition-colors">
              All Products
            </Link>
          </nav>
          
          {/* Right section icons */}
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 space-x-4 lg:space-x-6">
            <form onSubmit={handleSearch} className="relative hidden lg:block">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm w-56 xl:w-64"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </form>
            
            <form onSubmit={handleSearch} className="relative lg:hidden">
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-primary-600" type="submit">
                <Search className="h-6 w-6" />
              </Button>
            </form>
            
            <Link href={user ? "/account" : "/auth"} className="text-gray-500 hover:text-primary-600 transition-colors">
              <User className="h-6 w-6" />
            </Link>
            <Link href="/wishlist" className="text-gray-500 hover:text-primary-600 transition-colors">
              <Heart className="h-6 w-6" />
            </Link>
            <button 
              onClick={openCart}
              className="text-gray-500 hover:text-primary-600 transition-colors relative"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-6 w-6" />
              {totalCartItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </button>
            
            <ThemeToggle />
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <MobileMenu 
        isOpen={showMobileMenu} 
        onClose={() => setShowMobileMenu(false)} 
        categories={categories || []}
      />
    </header>
  );
}
