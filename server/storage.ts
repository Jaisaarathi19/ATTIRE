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
  sessionStore: session.MemoryStore; // Use the correct type for session store
}

export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private categoriesMap: Map<number, Category>;
  private productsMap: Map<number, Product>;
  private cartItemsMap: Map<number, CartItem>;
  private wishlistItemsMap: Map<number, WishlistItem>;
  
  sessionStore: session.MemoryStore;
  
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
    const user: User = {
      ...insertUser, 
      id, 
      createdAt: new Date(),
      address: (insertUser as any).address ?? null, // Ensure address is included
      phone: (insertUser as any).phone ?? null,     // Ensure phone is included
      name: insertUser.name ?? null,                // Ensure name is not undefined
      email: insertUser.email ?? null               // Ensure email is not undefined
    };
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
    const newCategory: Category = { 
      ...category, 
      id,
      description: category.description ?? null,
      image: category.image ?? null 
    };
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
      inventory: product.inventory || 0,
      description: product.description ?? '', 
      originalPrice: product.originalPrice ?? null,
      discount: product.discount ?? null,
      images: product.images ?? null // Ensure images is not undefined
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
    const newCartItem: CartItem = {
      id,
      color: cartItem.color ?? null,
      size: cartItem.size ?? null,
      userId: cartItem.userId,
      productId: cartItem.productId,
      quantity: cartItem.quantity ?? 1,
      createdAt: new Date()
    };
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
      { name: "Men", slug: "men", image: "https://images.unsplash.com/photo-1550246140-29f40b909e5a?q=80&w=600", description: "Men's Fashion" },
      { name: "Women", slug: "women", image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=600", description: "Women's Fashion" },
      { name: "Kids", slug: "kids", image: "https://images.unsplash.com/photo-1624435990733-aca957d0bbcf?q=80&w=600", description: "Kids Fashion" },
      { name: "Ethnic", slug: "ethnic", image: "https://images.unsplash.com/photo-1610030469668-76cd682c6e53?q=80&w=600", description: "Ethnic Wear" },
      { name: "Western", slug: "western", image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600", description: "Western Wear" },
      { name: "Accessories", slug: "accessories", image: "https://images.unsplash.com/photo-1601821765780-754fa98637c1?q=80&w=600", description: "Fashion Accessories" }
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
          "https://images.unsplash.com/photo-1623609163859-ca93c959b98a?q=80&w=600",
          "https://images.unsplash.com/photo-1612336307429-8a898d10e223?q=80&w=600",
          "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?q=80&w=600"
        ],
        inventory: 45,
        featured: true,
        trending: true,
        rating: 4.5,
        reviewCount: 124
      },
      {
        name: "Men's Mint Striped Shirt",
        slug: "mens-mint-striped-shirt",
        description: "Premium mint green striped shirt crafted with soft fabric for a relaxed, stylish summer look. Perfect for beach holidays and casual outings.",
        price: 1499,
        originalPrice: 1999,
        discount: 25,
        categoryId: 1, // Men
        images: [
          "/assets/mint-striped-shirt.png",
          "/assets/mint-striped-shirt.png",
          "/assets/mint-striped-shirt.png"
        ],
        inventory: 78,
        featured: true,
        trending: true,
        rating: 4.9,
        reviewCount: 112
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
          "https://images.unsplash.com/photo-1598359007833-f8a3ecfccee6?q=80&w=600",
          "https://images.unsplash.com/photo-1600488999785-a12f63eb5a16?q=80&w=600",
          "https://images.unsplash.com/photo-1600488999872-fb78426ee27f?q=80&w=600"
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
          "https://images.unsplash.com/photo-1624835020714-f9521e3e1421?q=80&w=600",
          "https://images.unsplash.com/photo-1563630423918-b58f07336ac9?q=80&w=600",
          "https://images.unsplash.com/photo-1577381450259-a0e1f56a85a6?q=80&w=600"
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
          "https://images.unsplash.com/photo-1476344305746-32062f10f791?q=80&w=600",
          "https://images.unsplash.com/photo-1535572290543-960a8046f5af?q=80&w=600",
          "https://images.unsplash.com/photo-1540479859555-17af45c78602?q=80&w=600"
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
          "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?q=80&w=600",
          "https://images.unsplash.com/photo-1598224572873-f81da0bf1222?q=80&w=600",
          "https://images.unsplash.com/photo-1633810541031-84d98b471cae?q=80&w=600"
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
          "https://images.unsplash.com/photo-1610030469668-76cd682c6e53?q=80&w=600",
          "https://images.unsplash.com/photo-1611042553484-d61f84d22784?q=80&w=600",
          "https://images.unsplash.com/photo-1603400521630-9f2de124b33b?q=80&w=600"
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
          "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600",
          "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?q=80&w=600",
          "https://images.unsplash.com/photo-1542060748-10c28b62716f?q=80&w=600"
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
