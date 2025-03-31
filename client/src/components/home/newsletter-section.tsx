import { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      emailSchema.parse(email);
      
      setIsSubmitting(true);
      
      // In a real application, this would be an API call
      // Simulating API call with a timeout
      setTimeout(() => {
        setIsSubmitting(false);
        toast({
          title: 'Subscribed!',
          description: 'Thank you for subscribing to our newsletter.',
        });
        setEmail('');
      }, 1000);
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Invalid email',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <motion.section 
      className="bg-gradient-to-r from-primary-600 to-primary-800 py-12"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2 
            className="text-2xl font-bold font-heading text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Subscribe for Exclusive Offers
          </motion.h2>
          <motion.p 
            className="mt-2 text-primary-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Stay updated with the latest trends and exclusive offers
          </motion.p>
          
          <motion.form 
            className="mt-6 sm:flex sm:max-w-md sm:mx-auto"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="relative flex-grow">
              <Input
                id="email-address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-3 placeholder-gray-500 focus:ring-primary-500 focus:border-primary-500 sm:max-w-xs border-white rounded-l-full shadow-sm"
                placeholder="Enter your email"
              />
            </div>
            <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-primary-600 rounded-r-full border border-transparent px-5 py-3 flex items-center justify-center text-base font-medium hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-700"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </div>
          </motion.form>
          
          <motion.p 
            className="mt-3 text-sm text-primary-100"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            By subscribing, you agree to our Privacy Policy.
          </motion.p>
        </div>
      </div>
    </motion.section>
  );
}
