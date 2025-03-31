import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  products, type Product, type InsertProduct,
  cartItems, type CartItem, type InsertCartItem,
  wishlistItems, type WishlistItem, type InsertWishlistItem
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category operations
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Product operations
  getProducts(options?: {
    categorySlug?: string;
    featured?: boolean;
    trending?: boolean;
    limit?: number;
  }): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Cart operations
  getCartItems(userId: number): Promise<(CartItem & { product: Product })[]>;
  getCartItemByProductId(userId: number, productId: number): Promise<CartItem | undefined>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<void>;
  
  // Wishlist operations
  getWishlistItems(userId: number): Promise<(WishlistItem & { product: Product })[]>;
  addToWishlist(wishlistItem: InsertWishlistItem): Promise<WishlistItem>;
  removeFromWishlist(id: number): Promise<void>;
  
  // Seed initial data
  seedInitialData(): Promise<void>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private categoriesMap: Map<number, Category>;
  private productsMap: Map<number, Product>;
  private cartItemsMap: Map<number, CartItem>;
  private wishlistItemsMap: Map<number, WishlistItem>;
  
  sessionStore: session.SessionStore;
  
  private userId: number = 1;
  private categoryId: number = 1;
  private productId: number = 1;
  private cartItemId: number = 1;
  private wishlistItemId: number = 1;

  constructor() {
    this.usersMap = new Map();
    this.categoriesMap = new Map();
    this.productsMap = new Map();
    this.cartItemsMap = new Map();
    this.wishlistItemsMap = new Map();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.usersMap.set(id, user);
    return user;
  }

  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categoriesMap.values());
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categoriesMap.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categoriesMap.values()).find(
      (category) => category.slug === slug
    );
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const newCategory: Category = { ...category, id };
    this.categoriesMap.set(id, newCategory);
    return newCategory;
  }

  // Product operations
  async getProducts(options?: {
    categorySlug?: string;
    featured?: boolean;
    trending?: boolean;
    limit?: number;
  }): Promise<Product[]> {
    let products = Array.from(this.productsMap.values());

    if (options?.categorySlug) {
      const category = await this.getCategoryBySlug(options.categorySlug);
      if (category) {
        products = products.filter(p => p.categoryId === category.id);
      }
    }

    if (options?.featured) {
      products = products.filter(p => p.featured);
    }

    if (options?.trending) {
      products = products.filter(p => p.trending);
    }

    if (options?.limit) {
      products = products.slice(0, options.limit);
    }

    return products;
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.productsMap.get(id);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.productsMap.values()).find(
      (product) => product.slug === slug
    );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const newProduct: Product = { 
      ...product, 
      id, 
      createdAt: new Date(),
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
      featured: product.featured || false,
      trending: product.trending || false,
      inventory: product.inventory || 0
    };
    this.productsMap.set(id, newProduct);
    return newProduct;
  }

  // Cart operations
  async getCartItems(userId: number): Promise<(CartItem & { product: Product })[]> {
    const cartItems = Array.from(this.cartItemsMap.values())
      .filter(item => item.userId === userId);
    
    return cartItems.map(item => {
      const product = this.productsMap.get(item.productId);
      if (!product) {
        throw new Error(`Product with id ${item.productId} not found`);
      }
      return { ...item, product };
    });
  }

  async getCartItemByProductId(userId: number, productId: number): Promise<CartItem | undefined> {
    return Array.from(this.cartItemsMap.values()).find(
      item => item.userId === userId && item.productId === productId
    );
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    const id = this.cartItemId++;
    const newCartItem: CartItem = { ...cartItem, id, createdAt: new Date() };
    this.cartItemsMap.set(id, newCartItem);
    return newCartItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItemsMap.get(id);
    if (!cartItem) return undefined;
    
    const updatedItem = { ...cartItem, quantity };
    this.cartItemsMap.set(id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(id: number): Promise<void> {
    this.cartItemsMap.delete(id);
  }

  // Wishlist operations
  async getWishlistItems(userId: number): Promise<(WishlistItem & { product: Product })[]> {
    const wishlistItems = Array.from(this.wishlistItemsMap.values())
      .filter(item => item.userId === userId);
    
    return wishlistItems.map(item => {
      const product = this.productsMap.get(item.productId);
      if (!product) {
        throw new Error(`Product with id ${item.productId} not found`);
      }
      return { ...item, product };
    });
  }

  async addToWishlist(wishlistItem: InsertWishlistItem): Promise<WishlistItem> {
    // Check if item already exists
    const existing = Array.from(this.wishlistItemsMap.values()).find(
      item => item.userId === wishlistItem.userId && item.productId === wishlistItem.productId
    );

    if (existing) {
      return existing;
    }

    const id = this.wishlistItemId++;
    const newWishlistItem: WishlistItem = { ...wishlistItem, id, createdAt: new Date() };
    this.wishlistItemsMap.set(id, newWishlistItem);
    return newWishlistItem;
  }

  async removeFromWishlist(id: number): Promise<void> {
    this.wishlistItemsMap.delete(id);
  }

  // Seed initial data
  async seedInitialData(): Promise<void> {
    // Only seed if no data exists
    if (this.categoriesMap.size > 0 || this.productsMap.size > 0) {
      return;
    }

    // Seed categories
    const categories: InsertCategory[] = [
      { name: "Men", slug: "men", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22", description: "Men's Fashion" },
      { name: "Women", slug: "women", image: "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda", description: "Women's Fashion" },
      { name: "Kids", slug: "kids", image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8", description: "Kids Fashion" },
      { name: "Ethnic", slug: "ethnic", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b", description: "Ethnic Wear" },
      { name: "Western", slug: "western", image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9", description: "Western Wear" },
      { name: "Accessories", slug: "accessories", image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d", description: "Fashion Accessories" }
    ];

    for (const category of categories) {
      await this.createCategory(category);
    }

    // Seed products
    const products: InsertProduct[] = [
      {
        name: "Floral Summer Dress",
        slug: "floral-summer-dress",
        description: "A beautiful floral summer dress perfect for warm weather.",
        price: 1999,
        originalPrice: 2499,
        discount: 20,
        categoryId: 2, // Women
        images: [
          "https://images.unsplash.com/photo-1522682078546-15d98fc6c6fd",
          "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446",
          "https://images.unsplash.com/photo-1566174053879-31528523f8c6"
        ],
        inventory: 45,
        featured: true,
        trending: true,
        rating: 4.5,
        reviewCount: 124
      },
      {
        name: "Men's Black Kurta",
        slug: "mens-black-kurta",
        description: "A classic black kurta crafted from premium cotton fabric. Perfect for festivals, celebrations or casual wear.",
        price: 1499,
        originalPrice: 1999,
        discount: 25,
        categoryId: 1, // Men
        images: [
          "https://images.unsplash.com/photo-1618886614638-80e3c103d465",
          "https://images.unsplash.com/photo-1610123598157-f7dfd74d2425",
          "https://images.unsplash.com/photo-1572307480813-ceb0e59d8325"
        ],
        inventory: 78,
        featured: false,
        trending: true,
        rating: 5.0,
        reviewCount: 89
      },
      {
        name: "Embroidered Lehenga",
        slug: "embroidered-lehenga",
        description: "A stunning embroidered lehenga for special occasions.",
        price: 4999,
        originalPrice: 7999,
        discount: 38,
        categoryId: 4, // Ethnic
        images: [
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c",
          "https://images.unsplash.com/photo-1626197031507-c17099753f20",
          "https://images.unsplash.com/photo-1596720226768-e0b865a48894"
        ],
        inventory: 32,
        featured: true,
        trending: false,
        rating: 4.0,
        reviewCount: 42
      },
      {
        name: "Classic White Shirt",
        slug: "classic-white-shirt",
        description: "A timeless white shirt for formal and casual occasions.",
        price: 999,
        originalPrice: 1299,
        discount: 23,
        categoryId: 5, // Western
        images: [
          "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4",
          "https://images.unsplash.com/photo-1598033129183-c4f50c736f10",
          "https://images.unsplash.com/photo-1581655353564-df123a1eb820"
        ],
        inventory: 120,
        featured: false,
        trending: false,
        rating: 5.0,
        reviewCount: 215
      },
      {
        name: "Kids Casual T-Shirt",
        slug: "kids-casual-t-shirt",
        description: "Comfortable and colorful t-shirt for kids.",
        price: 499,
        originalPrice: 699,
        discount: 29,
        categoryId: 3, // Kids
        images: [
          "https://images.unsplash.com/photo-1519238360632-a91498eb069f",
          "https://images.unsplash.com/photo-1502451885777-16c98b07834a",
          "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2"
        ],
        inventory: 85,
        featured: true,
        trending: false,
        rating: 4.7,
        reviewCount: 63
      },
      {
        name: "Handcrafted Earrings",
        slug: "handcrafted-earrings",
        description: "Beautiful handcrafted earrings to complement your ethnic wear.",
        price: 799,
        originalPrice: 1199,
        discount: 33,
        categoryId: 6, // Accessories
        images: [
          "https://images.unsplash.com/photo-1631163159638-7d7fb13410a1",
          "https://images.unsplash.com/photo-1535556116002-6281ff3e9f36",
          "https://images.unsplash.com/photo-1561172317-5860051e5de1"
        ],
        inventory: 54,
        featured: false,
        trending: true,
        rating: 4.8,
        reviewCount: 97
      },
      {
        name: "Women's Designer Saree",
        slug: "womens-designer-saree",
        description: "Elegant designer saree for special occasions.",
        price: 3999,
        originalPrice: 5999,
        discount: 33,
        categoryId: 4, // Ethnic
        images: [
          "https://images.unsplash.com/photo-1610030469668-76cd682c6e53",
          "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b",
          "https://images.unsplash.com/photo-1620741212082-4e5c583f9019"
        ],
        inventory: 40,
        featured: true,
        trending: true,
        rating: 4.9,
        reviewCount: 124
      },
      {
        name: "Men's Slim Fit Jeans",
        slug: "mens-slim-fit-jeans",
        description: "Comfortable slim fit jeans for a modern look.",
        price: 1299,
        originalPrice: 1799,
        discount: 28,
        categoryId: 5, // Western
        images: [
          "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec",
          "https://images.unsplash.com/photo-1542272604-787c3835535d",
          "https://images.unsplash.com/photo-1604176354204-9268737828e4"
        ],
        inventory: 95,
        featured: false,
        trending: true,
        rating: 4.6,
        reviewCount: 78
      }
    ];

    for (const product of products) {
      await this.createProduct(product);
    }
  }
}

export const storage = new MemStorage();
