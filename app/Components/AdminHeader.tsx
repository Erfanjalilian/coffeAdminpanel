// app/Components/AdminHeader.tsx
'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);

  // Extract active section from pathname
  const getActiveSection = () => {
    if (pathname.includes('/admin/orders')) return 'orders';
    if (pathname.includes('/admin/users')) return 'users';
    if (pathname.includes('/admin/premium-products')) return 'products-premium';
    if (pathname.includes('/admin/todays-discounts')) return 'products-discounts';
    if (pathname.includes('/admin/all-products')) return 'products-all';
    if (pathname.includes('/admin/settings')) return 'settings';
    return 'orders'; // default
  };

  const activeSection = getActiveSection();

  const menuItems = [
    { 
      id: 'orders', 
      label: 'سفارشات',
      href: '/OrdersAdmin'
    },
    { 
      id: 'users', 
      label: 'لیست کاربران',
      href: '/UsersList'
    },
    { 
      id: 'products', 
      label: 'محصولات',
      dropdown: [
        { 
          id: 'premium', 
          label: 'خریدهای ویژه', 
          href: '/ValueBuyAdmin' 
        },
        { 
          id: 'all', 
          label: 'همه محصولات', 
          href: '/AllProductsAdmin' 
        }
        // Removed "Today's Discounts" option
      ]
    },
    { 
      id: 'settings', 
      label: 'تنظیمات سایت',
      href: '/'
    }
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMobileMenuOpen(false);
    setIsProductsDropdownOpen(false);
  };

  const handleProductsItemClick = (href: string) => {
    handleNavigation(href);
  };

  const handleMenuItemClick = (item: any) => {
    if (item.dropdown) {
      setIsProductsDropdownOpen(!isProductsDropdownOpen);
    } else {
      handleNavigation(item.href);
    }
  };

  const isProductsActive = activeSection.startsWith('products-');

  return (
    <header className="bg-white text-gray-800 shadow-sm border-b border-gray-200">
      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between px-6 py-4">
        <div className="text-xl font-bold text-gray-900">پنل مدیریت کافی‌شاپ</div>
        
        <nav className="flex items-center gap-8">
          {menuItems.map((item) => (
            <div key={item.id} className="relative">
              {item.dropdown ? (
                <div className="relative">
                  <button
                    onClick={() => handleMenuItemClick(item)}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      isProductsActive 
                        ? 'bg-gray-100 text-gray-900 border border-gray-300' 
                        : 'hover:bg-gray-50 hover:text-gray-700'
                    }`}
                  >
                    {item.label}
                    <svg 
                      className={`w-4 h-4 transition-transform ${
                        isProductsDropdownOpen ? 'rotate-180' : ''
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isProductsDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                      {item.dropdown.map((dropdownItem) => (
                        <button
                          key={dropdownItem.id}
                          onClick={() => handleProductsItemClick(dropdownItem.href)}
                          className={`block w-full text-right px-4 py-2 text-sm transition-colors ${
                            activeSection === `products-${dropdownItem.id}`
                              ? 'bg-gray-100 text-gray-900 border-r-2 border-gray-400'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {dropdownItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handleMenuItemClick(item)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeSection === item.id 
                      ? 'bg-gray-100 text-gray-900 border border-gray-300' 
                      : 'hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  {item.label}
                </button>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden bg-white text-right px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-gray-900">پنل مدیریت</div>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-right rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mt-4 bg-gray-50 text-right rounded-lg p-4 space-y-2 border border-gray-200">
            {menuItems.map((item) => (
              <div key={item.id}>
                {item.dropdown ? (
                  <div className="space-y-2 text-right">
                    <button
                      onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
                      className="w-full text-right px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between text-gray-700"
                    >
                       {/* FIXED: Added mr-auto to push text to right */}
                      <svg 
                        className={`w-4 h-4 text-right transition-transform ${
                          isProductsDropdownOpen ? 'rotate-180' : ''
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      <div className="text-right">{item.label}</div>
                    </button>

                    {isProductsDropdownOpen && (
                      <div className="pr-4 text-right space-y-1 bg-white rounded-lg p-2 border border-gray-200">
                        {item.dropdown.map((dropdownItem) => (
                          <button
                            key={dropdownItem.id}
                            onClick={() => handleProductsItemClick(dropdownItem.href)}
                            className={`block w-full text-tight px-4 py-2 rounded transition-colors ${
                              activeSection === `products-${dropdownItem.id}`
                                ? 'bg-gray-100 text-gray-900 border-r-2 border-gray-400'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {dropdownItem.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleMenuItemClick(item)}
                    className={`w-full text-right px-4 py-2 rounded-lg transition-colors ${
                      activeSection === item.id 
                        ? 'bg-gray-100 text-gray-900 border border-gray-300' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-auto text-right">{item.label}</span> {/* FIXED: Added mr-auto to push text to right */}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}