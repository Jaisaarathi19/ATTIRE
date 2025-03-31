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
        <div className="flex justify-between items-center py-3">
          {/* Logo - Mobile */}
          <div className="md:hidden flex justify-start">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold font-heading text-gray-900">ATTIRE</span>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowMobileMenu(true)}
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          {/* Desktop header layout */}
          <div className="hidden md:flex w-full items-center justify-between">
            {/* Logo - Desktop */}
            <div className="flex justify-start">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold font-heading text-gray-900">ATTIRE</span>
                <span className="text-xs text-primary-600 ml-1 font-accent hidden lg:inline">Fashion Redefined</span>
              </Link>
            </div>
            
            {/* Navigation Links - Center */}
            <nav className="flex space-x-6 lg:space-x-10 mx-auto">
              {categories?.map((category: any) => (
                <Link 
                  key={category.id} 
                  href={`/products/category/${category.slug}`}
                  className="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </nav>
            
            {/* Right section icons */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 border border-gray-300 rounded-full text-sm w-44 lg:w-56 bg-gray-50"
                />
                <Search className="absolute left-3 top-2 h-4 w-4 text-gray-500" />
              </form>
              
              <Link href={user ? "/account" : "/auth"} className="text-gray-900 hover:text-primary-600 transition-colors">
                <User className="h-5 w-5" />
              </Link>
              <Link href="/wishlist" className="text-gray-900 hover:text-primary-600 transition-colors">
                <Heart className="h-5 w-5" />
              </Link>
              <button 
                onClick={openCart}
                className="text-gray-900 hover:text-primary-600 transition-colors relative"
                aria-label="Open cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </button>
            </div>
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
