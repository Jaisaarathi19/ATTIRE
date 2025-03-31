import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCart } from '@/components/cart/cart-drawer';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Truck, CheckCircle2, DollarSign, Loader2 } from 'lucide-react';
import { CartItem, CheckoutFormData } from '@/types';

const checkoutFormSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  address: z.string().min(5, { message: "Address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  pincode: z.string().min(6, { message: "Pincode must be at least 6 digits" }),
  paymentMethod: z.enum(["cod", "card", "upi"], {
    required_error: "Please select a payment method",
  }),
});

export default function CheckoutPage() {
  const [, navigate] = useLocation();
  const { cartItems, subtotal } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  
  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      city: "",
      state: "",
      pincode: "",
      paymentMethod: "cod",
    }
  });
  
  useEffect(() => {
    // Redirect if not logged in or cart is empty
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to proceed with checkout",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }
    
    if (cartItems.length === 0 && !orderComplete) {
      toast({
        title: "Empty cart",
        description: "Add some items to your cart before checkout",
        variant: "destructive"
      });
      navigate("/cart");
      return;
    }
    
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, [user, cartItems, navigate, toast, orderComplete]);
  
  const calculateTotal = () => {
    const shipping = subtotal >= 999 ? 0 : 100;
    const tax = Math.round(subtotal * 0.18);
    return subtotal + shipping + tax;
  };
  
  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    
    // In a real application, this would be an API call to process the order
    // Simulating API call with timeout
    setTimeout(() => {
      setIsSubmitting(false);
      setOrderComplete(true);
      
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase.",
      });
    }, 2000);
  };
  
  // Order confirmation screen
  if (orderComplete) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow bg-gray-50 py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="bg-white p-8 rounded-lg shadow text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-green-100 p-4">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for your purchase. We've received your order and will begin processing it right away.
                You will receive an email confirmation shortly.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h2 className="font-medium text-gray-900 mb-2">Order #ATTIRE-{Math.floor(Math.random() * 10000)}</h2>
                <p className="text-sm text-gray-600">Estimated delivery: 3-5 business days</p>
              </div>
              
              <div className="flex justify-center space-x-4">
                <Button asChild>
                  <a href="/">Return to Home</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/products">Continue Shopping</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-medium text-gray-900">Shipping Information</h2>
                </div>
                
                <div className="p-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="john@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="10-digit mobile number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Street address, apartment, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="City" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input placeholder="State" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="pincode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pincode</FormLabel>
                              <FormControl>
                                <Input placeholder="6-digit pincode" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="border-t pt-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
                        
                        <FormField
                          control={form.control}
                          name="paymentMethod"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="space-y-4"
                                >
                                  <div className="flex items-center space-x-3 border p-4 rounded-lg">
                                    <RadioGroupItem value="cod" id="cod" />
                                    <FormLabel htmlFor="cod" className="flex items-center cursor-pointer">
                                      <DollarSign className="h-5 w-5 mr-2 text-primary-600" />
                                      Cash on Delivery
                                    </FormLabel>
                                  </div>
                                  
                                  <div className="flex items-center space-x-3 border p-4 rounded-lg">
                                    <RadioGroupItem value="card" id="card" />
                                    <FormLabel htmlFor="card" className="flex items-center cursor-pointer">
                                      <CreditCard className="h-5 w-5 mr-2 text-primary-600" />
                                      Credit / Debit Card
                                    </FormLabel>
                                  </div>
                                  
                                  <div className="flex items-center space-x-3 border p-4 rounded-lg">
                                    <RadioGroupItem value="upi" id="upi" />
                                    <FormLabel htmlFor="upi" className="flex items-center cursor-pointer">
                                      <svg className="h-5 w-5 mr-2 text-primary-600" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" />
                                      </svg>
                                      UPI Payment
                                    </FormLabel>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="pt-4">
                        <Button 
                          type="submit" 
                          className="w-full"
                          size="lg"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Place Order"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
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
                
                <div className="mb-6 max-h-80 overflow-y-auto">
                  {cartItems.map((item: CartItem) => (
                    <div key={item.id} className="flex py-3 border-b">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-sm font-medium text-gray-900">
                            <h3>{item.product.name}</h3>
                            <p className="ml-4">₹{item.product.price * item.quantity}</p>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">{item.quantity} x ₹{item.product.price}</p>
                          {(item.size || item.color) && (
                            <p className="mt-1 text-xs text-gray-500">
                              {item.size && `Size: ${item.size}`}{item.size && item.color && ", "}
                              {item.color && `Color: ${item.color}`}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
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
                      <span>₹{calculateTotal()}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Including GST</p>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-600">
                    <p className="flex items-center mb-2">
                      <Truck className="h-4 w-4 mr-2 text-primary-600" />
                      Free shipping on orders above ₹999
                    </p>
                    <p className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-primary-600" />
                      Secure payment options
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
