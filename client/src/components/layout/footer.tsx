import { Link } from "wouter";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube 
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center">
              <span className="text-2xl font-bold font-heading text-white">ATTIRE</span>
              <span className="text-xs text-secondary-400 ml-1 font-accent">Fashion Redefined</span>
            </div>
            <p className="mt-4 text-gray-400 text-sm">
              Your one-stop destination for all fashion needs. From traditional ethnic wear to modern western outfits, we have it all.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="https://facebook.com" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://youtube.com" className="text-gray-400 hover:text-white transition-colors" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Shopping</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/products/category/men" className="text-gray-400 hover:text-white text-sm transition-colors">Men's Clothing</Link></li>
              <li><Link href="/products/category/women" className="text-gray-400 hover:text-white text-sm transition-colors">Women's Clothing</Link></li>
              <li><Link href="/products/category/kids" className="text-gray-400 hover:text-white text-sm transition-colors">Kids Wear</Link></li>
              <li><Link href="/products/category/ethnic" className="text-gray-400 hover:text-white text-sm transition-colors">Ethnic Collection</Link></li>
              <li><Link href="/products/category/western" className="text-gray-400 hover:text-white text-sm transition-colors">Western Wear</Link></li>
              <li><Link href="/products/category/accessories" className="text-gray-400 hover:text-white text-sm transition-colors">Accessories</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Customer Service</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white text-sm transition-colors">FAQs</Link></li>
              <li><Link href="/returns" className="text-gray-400 hover:text-white text-sm transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/shipping" className="text-gray-400 hover:text-white text-sm transition-colors">Shipping Policy</Link></li>
              <li><Link href="/track" className="text-gray-400 hover:text-white text-sm transition-colors">Track Your Order</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">About Us</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/story" className="text-gray-400 hover:text-white text-sm transition-colors">Our Story</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white text-sm transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-white text-sm transition-colors">Careers</Link></li>
              <li><Link href="/stores" className="text-gray-400 hover:text-white text-sm transition-colors">Store Locations</Link></li>
              <li><Link href="/responsibility" className="text-gray-400 hover:text-white text-sm transition-colors">Corporate Responsibility</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} ATTIRE. All rights reserved.
            </div>
            <div className="flex space-x-6 md:justify-end">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</Link>
              <Link href="/refund" className="text-gray-400 hover:text-white text-sm transition-colors">Refund Policy</Link>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-4">
            <svg className="h-8" viewBox="0 0 36 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.44 10.44V7.63H11.42V0.8H8.42V10.44H15.44ZM27.4399 10.44V7.63H23.4199V6.54H27.0199V3.96H23.4199V3.01H27.2799V0.8H20.4199V10.44H27.4399ZM36 10.44V0.8H33V4.73H29.94V0.8H26.94V10.44H29.94V7.36H33V10.44H36ZM19.5 10.44V7.47H17.08V0.8H14.08V10.44H19.5ZM7.18 5.72C7.18 2.37 5.49 0.55 2.41 0.55C1.92333 0.55 1.48 0.596667 1.08 0.69C0.693333 0.77 0.346667 0.883333 0.04 1.03V3.56C0.666667 3.16 1.44 2.96 2.36 2.96C3.01333 2.96 3.49 3.11 3.79 3.41C4.09 3.71 4.24 4.17 4.24 4.79V5.17H3.88C1.28 5.17 0 6.38 0 8.67C0 9.13 0.0866667 9.55333 0.26 9.94C0.433333 10.3133 0.68 10.63 1 10.89C1.32 11.15 1.70333 11.35 2.15 11.49C2.59667 11.63 3.09333 11.7 3.64 11.7C4.24 11.7 4.78333 11.6433 5.27 11.53C5.77 11.4167 6.18 11.2833 6.5 11.13C6.82 10.9767 7.06333 10.8267 7.23 10.68C7.39667 10.5333 7.49333 10.44 7.52 10.4L7.18 5.72ZM4.31 8.38V7.79H4.73C5.37 7.79 5.85667 7.85 6.19 7.97V9.35C5.85667 9.49667 5.35333 9.57 4.68 9.57C4.43333 9.57 4.24333 9.51 4.11 9.39C3.97667 9.27 3.91 9.07 3.91 8.79C3.91 8.51667 4.04333 8.38 4.31 8.38Z" fill="white"/>
            </svg>
            <svg className="h-8" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0H20V6.5V12H0V0Z" fill="#F2F2F2"/>
              <path d="M7.90573 7.25984C7.43483 7.25984 7.03452 7.40845 6.7229 7.41906C6.29198 7.43494 5.81048 7.25132 5.4945 6.91965C5.29847 6.71573 5.16186 6.45768 5.09997 6.19428C5.03808 5.93089 5.04753 5.65813 5.12742 5.39902C5.5378 4.13406 6.73121 3.96485 7.22273 3.96485C7.61773 3.96485 8.08331 4.13406 8.41992 4.13406L8.80456 3.18293C8.80456 3.18293 8.0664 2.99724 7.20712 2.99724C6.62404 2.99724 5.94338 3.12895 5.37596 3.54339C4.80846 3.95776 4.39261 4.68073 4.22824 5.43975C4.15218 5.82284 4.14792 6.21909 4.21572 6.60439C4.28351 6.98968 4.42198 7.35673 4.62328 7.68554C5.28331 8.76949 6.60151 8.80136 7.02208 8.80136C7.47729 8.80136 8.00821 8.66965 8.45292 8.48396L8.84288 7.53813C8.84288 7.53813 8.36669 7.25984 7.90573 7.25984Z" fill="#474747"/>
              <path d="M9.47607 5.40969C9.47607 6.59091 10.4457 8.79198 10.4457 8.79198H11.5838L12.9966 2.99724H11.8585L11.0734 6.42698C11.0734 6.42698 10.6145 5.17297 10.6145 4.38122C10.6145 3.73567 10.6926 2.99724 10.6926 2.99724H9.47607C9.47607 2.99724 9.47607 4.6225 9.47607 5.40969Z" fill="#474747"/>
              <path d="M14.4094 2.99724L13.1094 8.79198H14.2474L15.5474 2.99724H14.4094Z" fill="#474747"/>
              <path d="M19.1636 2.99724H18.1825L16.6232 4.71828V2.99724H15.4852V8.79198H16.6232V6.33176L18.3825 8.79198H19.6044L17.63 6.02134L19.1636 2.99724Z" fill="#474747"/>
              <path d="M4.27294 4.55637H2.8128V8.79198H3.93431V7.13854H4.27294C5.16188 7.13854 5.85798 6.60556 5.85798 5.84702C5.85805 5.08849 5.16188 4.55637 4.27294 4.55637ZM4.1895 6.30526C3.87789 6.30526 3.93431 6.30526 3.93431 6.30526V5.38965H4.1895C4.53142 5.38965 4.75813 5.57534 4.75813 5.84702C4.75813 6.11871 4.53136 6.30526 4.1895 6.30526Z" fill="#474747"/>
              <path d="M1.89323 7.9618V2.99732H0.760156V8.79198H2.99308L3.22511 7.9618H1.89323Z" fill="#474747"/>
            </svg>
            <svg className="h-8" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.2769 6.39983H1.77385V22.9569H22.2769V6.39983Z" fill="#002C8A"/>
              <path d="M1.77385 6.39983H22.2769V14.6784H1.77385V6.39983Z" fill="#009BE1"/>
              <path d="M6.28925 18.9761C4.92154 18.9761 3.82617 18.1784 3.82617 16.4823C3.82617 14.8454 4.92154 13.9885 6.35079 13.9885C7.09386 13.9885 7.65693 14.1769 8.16001 14.4254L7.77847 15.593C7.37156 15.3445 6.94001 15.2169 6.44924 15.2169C5.70617 15.2169 5.23616 15.72 5.23616 16.4784C5.23616 17.3361 5.76462 17.8392 6.44924 17.8392C6.98001 17.8392 7.43771 17.6823 7.84463 17.4323L8.22617 18.5607C7.67541 18.8092 6.98001 18.9761 6.28925 18.9761Z" fill="white"/>
              <path d="M11.077 18.8485L10.8708 17.8408H9.02319L8.79319 18.8485H7.37158L9.25319 14.0869H10.7163L12.6133 18.8485H11.077ZM10.564 16.6453L10.1417 15.3484C10.0909 15.1999 9.99705 14.7992 9.97781 14.6576H9.96089C9.94166 14.7992 9.85935 15.1999 9.8085 15.3484L9.38627 16.6453H10.564Z" fill="white"/>
              <path d="M15.0402 18.8485L14.9918 18.1816C14.5679 18.6846 14.0864 18.976 13.4341 18.976C12.5695 18.976 11.8571 18.2823 11.8571 17.1846C11.8571 15.8308 12.8379 14.9731 14.7025 14.9731H14.8756V14.7854C14.8756 14.1485 14.4941 13.8577 13.8756 13.8577C13.3718 13.8577 12.8379 14.0931 12.4318 14.4254L12.0102 13.3461C12.5525 12.9546 13.3225 12.6638 14.0864 12.6638C15.4218 12.6638 16.2356 13.3854 16.2356 14.7461V17.2238C16.2356 17.7654 16.2679 18.3823 16.3517 18.8492H15.0402V18.8485ZM14.8248 16.0692H14.6894C13.7579 16.0692 13.2864 16.4607 13.2864 17.0085C13.2864 17.4392 13.5271 17.7307 13.9748 17.7307C14.4733 17.7307 14.8248 17.3685 14.8248 16.9069V16.0692Z" fill="white"/>
              <path d="M17.2333 18.8485V12.7915H18.6041V17.6154H20.4786V18.8485H17.2333Z" fill="white"/>
            </svg>
            <svg className="h-8" viewBox="0 0 22 9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.629 0L14.743 0L14.743 9L20.629 9L20.629 0Z" fill="#5F259F"/>
              <path d="M15.1851 4.50007C15.1851 3.07079 15.8634 1.80729 16.9476 0.96875C16.1826 0.3593 15.2145 0 14.1514 0C11.5975 0 9.53027 2.01472 9.53027 4.5C9.53027 6.98528 11.5975 9 14.1514 9C15.2145 9 16.1826 8.6407 16.9476 8.03125C15.8634 7.20067 15.1851 5.92935 15.1851 4.50007Z" fill="#EB001B"/>
              <path d="M26.5513 4.5C26.5513 6.98528 24.484 9 21.9301 9C20.867 9 19.899 8.6407 19.1339 8.03125C20.2262 7.19271 20.8963 5.92921 20.8963 4.5C20.8963 3.07079 20.2181 1.80729 19.1339 0.96875C19.899 0.3593 20.867 0 21.9301 0C24.484 0 26.5513 2.01472 26.5513 4.5Z" fill="#00A1DF"/>
              <path d="M2.36364 8.86364L2.85795 7.29574H1.09375L1.45881 6.15483H3.22301L3.70199 4.6696H1.93778L2.30284 3.52869H4.06705L4.6151 1.70312H3.36932L2.81832 3.52869H1.72869L2.27969 1.70312H1.03125L0.484233 3.52869H0L0.365057 4.6696H0.845398L0.32108 6.15483H0.853551L1.2186 7.29574H2.70028H3.18182L3.54688 6.15483H4.79801H5.28125L5.64205 5.01392H4.39062L4.87228 3.52869H3.63366L3.15199 5.01392H1.9985L2.48017 3.52869H1.24155L0.759943 5.01392H1.26989L0.734091 6.15483H1.09375H1.59091L1.95597 5.01392H3.19943L2.83438 6.15483H1.5909L1.22585 7.29574H2.46875L2.36364 8.86364Z" fill="#5F259F"/>
              <path d="M6.60083 0.965912H4.17543L3.0307 5.0419C3.0307 5.0419 2.81179 6.13708 3.93288 6.13708H5.95358L6.60083 0.965912ZM5.35758 5.09446H4.50085L5.2201 1.77585H6.07683L5.35758 5.09446Z" fill="#00A1DF"/>
              <path d="M4.17543 0.976569H6.60083L5.95358 6.14773H3.93288C3.93288 6.14773 2.81179 6.14773 3.0307 5.05256L4.17543 0.976569Z" fill="#5F259F"/>
              <path d="M4.5531 5.09446L5.2201 1.77585H6.07683L5.35758 5.09446H4.5531Z" fill="#FFED00"/>
              <path d="M6.94762 0.965912C6.94762 0.965912 6.55357 0.976566 6.38051 1.35803C6.20746 1.7395 3.1733 8.97441 3.1733 8.97441H4.70224C4.70224 8.97441 8.09184 1.03196 8.13209 0.965912H6.94762Z" fill="#5F259F"/>
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
}
