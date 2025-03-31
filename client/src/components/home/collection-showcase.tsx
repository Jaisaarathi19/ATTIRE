import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const collections = [
  {
    id: 1,
    title: 'Wedding Collection',
    description: 'Elegant ethnic wear for your special day',
    image: 'https://images.unsplash.com/photo-1614676471928-2ebd94e2e2d4',
    tag: 'EXCLUSIVE',
    tagColor: 'bg-primary-600',
    buttonColor: 'text-primary-600',
    buttonHoverColor: 'hover:bg-primary-50',
    link: '/products/category/ethnic?tag=wedding'
  },
  {
    id: 2,
    title: 'Summer Collection',
    description: 'Light, breezy styles for the warm weather',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3',
    tag: 'NEW SEASON',
    tagColor: 'bg-secondary-600',
    buttonColor: 'text-secondary-600',
    buttonHoverColor: 'hover:bg-secondary-50',
    link: '/products/category/western?tag=summer'
  }
];

const smallCollections = [
  {
    id: 1,
    title: 'Kids Collection',
    description: 'Colorful and comfortable styles for children',
    image: 'https://images.unsplash.com/photo-1596122787821-13af5084b1d1',
    link: '/products/category/kids'
  },
  {
    id: 2,
    title: 'Office Wear',
    description: 'Professional attire for the modern workplace',
    image: 'https://images.unsplash.com/photo-1603252109360-909baaf261c7',
    link: '/products/category/western?tag=office'
  },
  {
    id: 3,
    title: 'Accessories',
    description: 'Complete your look with our stylish accessories',
    image: 'https://images.unsplash.com/photo-1631041556964-57f2686f5e5c',
    link: '/products/category/accessories'
  }
];

export function CollectionShowcase() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold font-heading text-gray-900">Featured Collections</h2>
          <p className="mt-2 text-gray-600">Explore our newest and most popular styles</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {collections.map((collection, index) => (
            <motion.div 
              key={collection.id}
              className="relative rounded-xl overflow-hidden shadow-lg group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <img 
                src={`${collection.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80`} 
                alt={collection.title} 
                className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className={`text-white text-sm font-medium ${collection.tagColor} px-3 py-1 rounded-full`}>
                  {collection.tag}
                </span>
                <h3 className="mt-3 text-2xl font-bold text-white">{collection.title}</h3>
                <p className="mt-2 text-gray-200">{collection.description}</p>
                <Link href={collection.link}>
                  <Button 
                    className={`mt-4 inline-flex items-center px-4 py-2 bg-white ${collection.buttonColor} rounded-full text-sm font-medium ${collection.buttonHoverColor} transition duration-300`}
                  >
                    Explore Collection <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {smallCollections.map((collection, index) => (
            <motion.div 
              key={collection.id}
              className="relative rounded-xl overflow-hidden shadow-md group bg-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
            >
              <div className="aspect-w-1 aspect-h-1">
                <img 
                  src={`${collection.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80`} 
                  alt={collection.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900">{collection.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{collection.description}</p>
                <Link href={collection.link}>
                  <a className="mt-3 inline-flex items-center text-primary-600 text-sm font-medium hover:text-primary-700">
                    View Collection <ChevronRight className="ml-1 h-4 w-4" />
                  </a>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
