import { motion } from 'framer-motion';
import { 
  Package, 
  RefreshCw, 
  ShieldCheck, 
  PhoneCall 
} from 'lucide-react';

const features = [
  {
    id: 1,
    title: 'Free Shipping',
    description: 'On orders above ₹999',
    icon: Package
  },
  {
    id: 2,
    title: 'Easy Returns',
    description: '10-day return policy',
    icon: RefreshCw
  },
  {
    id: 3,
    title: 'Secure Payments',
    description: 'Multiple payment options',
    icon: ShieldCheck
  },
  {
    id: 4,
    title: '24/7 Support',
    description: 'Dedicated customer service',
    icon: PhoneCall
  }
];

export function FeaturesSection() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={feature.id}
              className="flex items-start space-x-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 text-primary-600">
                  <feature.icon className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
