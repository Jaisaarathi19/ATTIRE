import { 
  User as UserSchema, 
  Category as CategorySchema, 
  Product as ProductSchema, 
  CartItem as CartItemSchema,
  WishlistItem as WishlistItemSchema
} from "@shared/schema";

export interface User extends UserSchema {}

export interface Category extends CategorySchema {}

export interface Product extends ProductSchema {}

export interface CartItem extends CartItemSchema {
  product: Product;
}

export interface WishlistItem extends WishlistItemSchema {
  product: Product;
}

export interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: 'cod' | 'card' | 'upi';
}

export interface TestimonialType {
  id: number;
  name: string;
  location: string;
  text: string;
  rating: number;
  image: string;
}
