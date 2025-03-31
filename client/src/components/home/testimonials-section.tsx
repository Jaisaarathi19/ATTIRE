import { motion } from 'framer-motion';
import { Star, StarHalf } from 'lucide-react';
import { TestimonialType } from '@/types';

const testimonials: TestimonialType[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Delhi',
    text: 'The quality of the clothes is exceptional. I ordered a kurta for a wedding and received so many compliments. The fit was perfect and delivery was quick!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
  },
  {
    id: 2,
    name: 'Rahul Patel',
    location: 'Mumbai',
    text: 'I\'ve been shopping from ATTIRE for over a year now. Their collection is always trendy and the prices are reasonable. The return process is also very smooth.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'
  },
  {
    id: 3,
    name: 'Meera Iyer',
    location: 'Bangalore',
    text: 'Super fast delivery and amazing collection. I ordered a saree for my sister\'s wedding and it arrived beautifully packaged. Will definitely shop again!',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e'
  }
];

export function TestimonialsSection() {
  // Function to render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-amber-400 text-amber-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="fill-amber-400 text-amber-400" />);
    }
    
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-amber-400" />);
    }
    
    return stars;
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold font-heading text-gray-900">Customer Love</h2>
          <p className="mt-2 text-gray-600">What our customers say about us</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={testimonial.id}
              className="bg-white p-6 rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="flex text-amber-400 mb-4">
                {renderStars(testimonial.rating)}
              </div>
              <p className="text-gray-600 italic">"{testimonial.text}"</p>
              <div className="mt-6 flex items-center">
                <div className="flex-shrink-0">
                  <img 
                    className="h-10 w-10 rounded-full object-cover" 
                    src={`${testimonial.image}?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`} 
                    alt={testimonial.name} 
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">{testimonial.name}</h3>
                  <p className="text-xs text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
