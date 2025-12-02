'use client';

import { useState, useEffect } from 'react';

// Update Product interface to match actual API response
interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  image?: string;
  images?: string[];
  brand?: string;
  priceAfterDiscount: number;
  id: string;
  category?: {
    _id: string;
    name: string;
    slug: string;
  };
  description?: string;
  status?: string;
}

interface ValueBuy {
  _id: string;
  product: Product | null;
  features: string[];
  filters: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductsResponse {
  status: number;
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

interface ValueBuysResponse {
  status: number;
  success: boolean;
  data: {
    valueBuys: ValueBuy[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

interface ValidationError {
  path: string;
  message: string;
}

interface ErrorResponse {
  status: number;
  success: boolean;
  error: string;
  data?: ValidationError[];
}

interface NewValueBuyFormData {
  product: string;
  features: {
    recommended: boolean;
    specialDiscount: boolean;
    lowStock: boolean;
    rareDeal: boolean;
  };
  filters: {
    economicChoice: boolean;
    bestValue: boolean;
    topSelling: boolean;
    freeShipping: boolean;
  };
  isActive: boolean;
}

// Mapping between English keys and Persian strings (EXACT MATCH)
const FEATURE_MAP: Record<string, string> = {
  recommended: 'پیشنهاد شده',
  specialDiscount: 'تخفیف ویژه',
  lowStock: 'موجودی کم',
  rareDeal: 'پیشنهاد نادر'
};

const FILTER_MAP: Record<string, string> = {
  economicChoice: 'انتخاب اقتصادی',
  bestValue: 'بهترین ارزش',
  topSelling: 'پرفروش‌ترین',
  freeShipping: 'ارسال رایگان'
};

// Reverse mapping for display
const REVERSE_FEATURE_MAP: Record<string, string> = {
  'پیشنهاد شده': 'recommended',
  'تخفیف ویژه': 'specialDiscount',
  'موجودی کم': 'lowStock',
  'پیشنهاد نادر': 'rareDeal'
};

const REVERSE_FILTER_MAP: Record<string, string> = {
  'انتخاب اقتصادی': 'economicChoice',
  'بهترین ارزش': 'bestValue',
  'پرفروش‌ترین': 'topSelling',
  'ارسال رایگان': 'freeShipping'
};

export default function ValueBuyAdmin() {
  // State Management
  const [valueBuys, setValueBuys] = useState<ValueBuy[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingValueBuy, setEditingValueBuy] = useState<ValueBuy | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredValueBuys, setFilteredValueBuys] = useState<ValueBuy[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState<ValidationError[]>([]);

  // New valueBuy state
  const [newValueBuy, setNewValueBuy] = useState<NewValueBuyFormData>({
    product: '',
    features: {
      recommended: true,
      specialDiscount: false,
      lowStock: false,
      rareDeal: false
    },
    filters: {
      economicChoice: true,
      bestValue: false,
      topSelling: false,
      freeShipping: false
    },
    isActive: true
  });

  const API_BASE_URL = 'https://coffee-shop-backend-k3un.onrender.com/api/v1/valueBuy';
  const PRODUCTS_API_URL = 'https://coffee-shop-backend-k3un.onrender.com/api/v1/product';

  useEffect(() => {
    fetchProducts();
    fetchValueBuys();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredValueBuys(valueBuys);
    } else {
      const filtered = valueBuys.filter(item =>
        (item.product && item.product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.product && item.product.brand && item.product.brand.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredValueBuys(filtered);
    }
  }, [searchTerm, valueBuys]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(PRODUCTS_API_URL);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      
      const data: ProductsResponse = await response.json();
      
      if (data.data && data.data.products && Array.isArray(data.data.products)) {
        setProducts(data.data.products);
      } else {
        console.error('Unexpected products response structure:', data);
        setProducts([]);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      alert('خطا در دریافت محصولات');
    }
  };

  const fetchValueBuys = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch value buys: ${response.status}`);
      }
      
      const data: ValueBuysResponse = await response.json();
      
      if (data.data && data.data.valueBuys && Array.isArray(data.data.valueBuys)) {
        setValueBuys(data.data.valueBuys);
        setFilteredValueBuys(data.data.valueBuys);
      } else {
        console.error('Unexpected valueBuys response structure:', data);
        setValueBuys([]);
        setFilteredValueBuys([]);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // CORRECTED: Convert English boolean object to Persian string array
  const convertFeaturesToPersianArray = (features: Record<string, boolean>): string[] => {
    const result: string[] = [];
    
    // Check each feature - only add if true
    if (features.recommended === true) result.push("پیشنهاد شده");
    if (features.specialDiscount === true) result.push("تخفیف ویژه");
    if (features.lowStock === true) result.push("موجودی کم");
    if (features.rareDeal === true) result.push("پیشنهاد نادر");
    
    // If no features selected, use default from validator
    if (result.length === 0) {
      result.push("پیشنهاد شده");
    }
    
    return result;
  };

  // CORRECTED: Convert English boolean object to Persian string array
  const convertFiltersToPersianArray = (filters: Record<string, boolean>): string[] => {
    const result: string[] = [];
    
    // Check each filter - only add if true
    if (filters.economicChoice === true) result.push("انتخاب اقتصادی");
    if (filters.bestValue === true) result.push("بهترین ارزش");
    if (filters.topSelling === true) result.push("پرفروش‌ترین");
    if (filters.freeShipping === true) result.push("ارسال رایگان");
    
    // If no filters selected, use default from validator
    if (result.length === 0) {
      result.push("انتخاب اقتصادی");
    }
    
    return result;
  };

  // Helper function to convert Persian array back to English boolean object for editing
  const convertPersianArrayToEnglishObject = <T extends Record<string, boolean>>(
    persianArray: string[],
    reverseMap: Record<string, string>,
    defaultObj: T
  ): T => {
    const result = { ...defaultObj };
    
    // Reset all to false
    Object.keys(result).forEach(key => {
      result[key as keyof T] = false as T[keyof T];
    });
    
    // Set to true based on Persian array
    persianArray.forEach(persianStr => {
      const englishKey = reverseMap[persianStr];
      if (englishKey && englishKey in result) {
        result[englishKey as keyof T] = true as T[keyof T];
      }
    });
    
    return result;
  };

  // CORRECTED: Get products that are not already in ValueBuys
  const getAvailableProducts = (): Product[] => {
    if (!products.length) return [];
    
    const usedProductIds = new Set(
      valueBuys
        .filter(vb => vb.product && vb.product._id)
        .map(vb => vb.product!._id)
    );
    
    return products.filter(product => !usedProductIds.has(product._id));
  };

  // CORRECTED: Add ValueBuy Functionality
  const handleAddValueBuy = async () => {
    // Form Validation
    if (!newValueBuy.product) {
      alert('لطفاً یک محصول را انتخاب کنید');
      return;
    }

    // Check if product is already in a ValueBuy (client-side validation)
    const isProductAlreadyUsed = valueBuys.some(vb => 
      vb.product && vb.product._id === newValueBuy.product
    );
    
    if (isProductAlreadyUsed) {
      alert('این محصول قبلاً در یک ValueBuy ثبت شده است.');
      return;
    }

    try {
      setIsSubmitting(true);
      setServerErrors([]);

      // Convert English boolean objects to Persian string arrays
      const persianFeatures = convertFeaturesToPersianArray(newValueBuy.features);
      const persianFilters = convertFiltersToPersianArray(newValueBuy.filters);

      // Prepare data in EXACT format backend expects
      const requestData = {
        product: newValueBuy.product.trim(), // Ensure no extra spaces
        features: persianFeatures,
        filters: persianFilters,
        isActive: newValueBuy.isActive
      };

      console.log('=== START: Create ValueBuy Request ===');
      console.log('Endpoint:', API_BASE_URL);
      console.log('Method: POST');
      console.log('Data to send:', JSON.stringify(requestData, null, 2));

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);

      const responseText = await response.text();
      console.log('Raw response text:', responseText);

      if (!response.ok) {
        console.error('Server responded with error:', {
          status: response.status,
          statusText: response.statusText,
          body: responseText
        });
        
        let errorData: ErrorResponse;
        try {
          errorData = JSON.parse(responseText);
          console.log('Parsed error data:', errorData);
          
          if (errorData.data && Array.isArray(errorData.data)) {
            setServerErrors(errorData.data);
            const errorMessages = errorData.data.map(err => 
              `• ${err.path}: ${err.message}`
            ).join('\n');
            alert(`خطا در ایجاد ValueBuy:\n\n${errorMessages}`);
          } else {
            alert(`ایجاد ValueBuy ناموفق بود: ${errorData.error || response.statusText}`);
          }
        } catch (e) {
          console.error('Could not parse error response as JSON:', e);
          alert(`ایجاد ValueBuy ناموفق بود: ${response.status} - ${responseText}`);
        }
        
        throw new Error(`ایجاد ValueBuy ناموفق بود: ${response.status}`);
      }

      console.log('=== END: Create ValueBuy Request - SUCCESS ===');

      // Reset form
      setNewValueBuy({
        product: '',
        features: {
          recommended: true,
          specialDiscount: false,
          lowStock: false,
          rareDeal: false
        },
        filters: {
          economicChoice: true,
          bestValue: false,
          topSelling: false,
          freeShipping: false
        },
        isActive: true
      });
      setServerErrors([]);

      // Refresh both lists
      await fetchValueBuys();
      await fetchProducts();
      setShowAddForm(false);
      alert('ValueBuy با موفقیت ایجاد شد');
    } catch (err: unknown) {
      console.error('=== Create ValueBuy Request - FAILED ===');
      console.error('Error details:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit ValueBuy Functionality
  const handleEdit = (valueBuy: ValueBuy) => {
    // Don't allow editing if product is null
    if (!valueBuy.product) {
      alert('ویرایش این ValueBuy امکان‌پذیر نیست زیرا محصول مرتبط حذف شده است.');
      return;
    }
    
    // Convert Persian arrays back to English boolean objects for the form
    const englishFeatures = convertPersianArrayToEnglishObject(
      valueBuy.features,
      REVERSE_FEATURE_MAP,
      { recommended: false, specialDiscount: false, lowStock: false, rareDeal: false }
    );
    
    const englishFilters = convertPersianArrayToEnglishObject(
      valueBuy.filters,
      REVERSE_FILTER_MAP,
      { economicChoice: false, bestValue: false, topSelling: false, freeShipping: false }
    );
    
    // Create a copy with converted data
    const valueBuyWithEnglishBooleans: any = {
      ...valueBuy,
      features: englishFeatures,
      filters: englishFilters
    };
    
    setEditingValueBuy(valueBuyWithEnglishBooleans);
    setShowAddForm(false);
    setServerErrors([]);
  };

  const handleSaveEdit = async () => {
    if (!editingValueBuy || !editingValueBuy.product) return;

    try {
      setIsSubmitting(true);
      setServerErrors([]);

      // Convert English boolean objects to Persian string arrays
      const persianFeatures = convertFeaturesToPersianArray(
        editingValueBuy.features as unknown as Record<string, boolean>
      );
      
      // For update, we only send features and isActive (no filters or product)
      const updateData: any = {
        features: persianFeatures,
        isActive: editingValueBuy.isActive
      };

      console.log('=== START: Update ValueBuy Request ===');
      console.log('Endpoint:', `${API_BASE_URL}/${editingValueBuy._id}`);
      console.log('Method: PATCH');
      console.log('ValueBuy ID:', editingValueBuy._id);
      console.log('Update data:', JSON.stringify(updateData, null, 2));

      const response = await fetch(`${API_BASE_URL}/${editingValueBuy._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);

      const responseText = await response.text();
      console.log('Raw response text:', responseText);

      if (!response.ok) {
        console.error('Server responded with error:', {
          status: response.status,
          statusText: response.statusText,
          body: responseText
        });
        
        let errorData: ErrorResponse;
        try {
          errorData = JSON.parse(responseText);
          console.log('Parsed error data:', errorData);
          
          if (errorData.data && Array.isArray(errorData.data)) {
            setServerErrors(errorData.data);
            const errorMessages = errorData.data.map(err => 
              `• ${err.path}: ${err.message}`
            ).join('\n');
            alert(`خطا در ویرایش ValueBuy:\n\n${errorMessages}`);
          } else {
            alert(`ویرایش ValueBuy ناموفق بود: ${errorData.error || response.statusText}`);
          }
        } catch (e) {
          console.error('Could not parse error response as JSON:', e);
          alert(`ویرایش ValueBuy ناموفق بود: ${response.status} - ${responseText}`);
        }
        
        throw new Error(`ویرایش ValueBuy ناموفق بود: ${response.status}`);
      }

      console.log('=== END: Update ValueBuy Request - SUCCESS ===');

      // Refresh the list to get updated data
      await fetchValueBuys();
      setEditingValueBuy(null);
      setServerErrors([]);
      alert('ValueBuy با موفقیت به‌روزرسانی شد');
    } catch (err: unknown) {
      console.error('=== Update ValueBuy Request - FAILED ===');
      console.error('Error details:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete ValueBuy
  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این ValueBuy اطمینان دارید؟')) {
      return;
    }

    try {
      console.log('=== START: Delete ValueBuy Request ===');
      console.log('Endpoint:', `${API_BASE_URL}/${id}`);
      console.log('Method: DELETE');

      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });

      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);

      const responseText = await response.text();
      console.log('Raw response text:', responseText);

      if (!response.ok) {
        let errorMessage = `حذف ValueBuy ناموفق بود: ${response.status}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage += ` - ${errorData.error || responseText}`;
        } catch (e) {
          errorMessage += ` - ${responseText}`;
        }
        throw new Error(errorMessage);
      }

      console.log('=== END: Delete ValueBuy Request - SUCCESS ===');

      // Remove valueBuy from local state
      setValueBuys(valueBuys.filter(item => item._id !== id));
      // Refresh products list to update available products
      await fetchProducts();
      alert('ValueBuy با موفقیت حذف شد');
    } catch (err: unknown) {
      console.error('=== Delete ValueBuy Request - FAILED ===');
      console.error('Error details:', err);
      alert(`خطا در حذف ValueBuy: ${err instanceof Error ? err.message : 'خطای ناشناخته'}`);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  // Helper to translate English feature keys to Persian for display
  const getFeatureLabel = (key: string): string => {
    const labels: Record<string, string> = {
      recommended: 'پیشنهاد شده',
      specialDiscount: 'تخفیف ویژه',
      lowStock: 'موجودی کم',
      rareDeal: 'پیشنهاد نادر'
    };
    return labels[key] || key;
  };

  // Helper to translate English filter keys to Persian for display
  const getFilterLabel = (key: string): string => {
    const labels: Record<string, string> = {
      economicChoice: 'انتخاب اقتصادی',
      bestValue: 'بهترین ارزش',
      topSelling: 'پرفروش‌ترین',
      freeShipping: 'ارسال رایگان'
    };
    return labels[key] || key;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md text-center">
          <strong>خطا: </strong> {error}
        </div>
      </div>
    );
  }

  const availableProducts = getAvailableProducts();

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 py-8">
      {/* Main Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">مدیریت ValueBuy</h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">مدیریت و ویرایش محصولات ارزشمند</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base w-full sm:w-auto"
            >
              {isSubmitting ? 'در حال پردازش...' : 'افزودن ValueBuy جدید'}
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                جستجو در ValueBuy
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="جستجو بر اساس نام محصول یا برند..."
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex gap-3 self-end">
              <button
                onClick={() => setSearchTerm('')}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors text-sm"
              >
                پاک کردن
              </button>
            </div>
          </div>
          {searchTerm && (
            <div className="mt-4 text-sm text-gray-600">
              <span>نتایج جستجو برای </span>
              <span className="font-semibold">"{searchTerm}"</span>
              <span> : {filteredValueBuys.length} ValueBuy یافت شد</span>
            </div>
          )}
        </div>

        {/* Server Errors Display */}
        {serverErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800 mb-2">خطاهای اعتبارسنجی</h3>
                <p className="text-red-700 mb-3">سرور با فیلدهای زیر مشکل دارد:</p>
                <ul className="space-y-2">
                  {serverErrors.map((error, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <div>
                        <span className="font-medium text-red-800">{error.path}:</span>
                        <span className="text-red-700 mr-2"> {error.message}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="text-red-600 text-sm mt-3">
                  خطاهای کامل در کنسول مرورگر لاگ شده‌اند (F12 → Console)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Add ValueBuy Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">افزودن ValueBuy جدید</h2>
            <div className="space-y-6">
              {/* Required Fields Note */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>توجه:</strong> فیلدهای با ستاره (*) اجباری هستند.
                </p>
                <p className="text-sm text-blue-800 mt-1">
                  هر محصول فقط می‌تواند در یک ValueBuy ثبت شود.
                </p>
              </div>

              {/* Product Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  محصول *
                </label>
                <select
                  value={newValueBuy.product}
                  onChange={(e) => setNewValueBuy({...newValueBuy, product: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    serverErrors.some(e => e.path === 'product') 
                      ? 'border-red-500' 
                      : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">انتخاب محصول</option>
                  {availableProducts.length > 0 ? (
                    availableProducts.map(product => (
                      <option key={product._id} value={product._id}>
                        {product.name} - {formatPrice(product.price)} {product.brand ? `(${product.brand})` : ''}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      {products.length > 0 ? 'همه محصولات قبلاً در ValueBuy ثبت شده‌اند' : 'در حال بارگیری محصولات...'}
                    </option>
                  )}
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  {availableProducts.length} محصول از {products.length} محصول موجود برای انتخاب
                </p>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">ویژگی‌ها</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(newValueBuy.features).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`feature-${key}`}
                        checked={value}
                        onChange={(e) => setNewValueBuy({
                          ...newValueBuy,
                          features: {
                            ...newValueBuy.features,
                            [key]: e.target.checked
                          }
                        })}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ml-2"
                      />
                      <label htmlFor={`feature-${key}`} className="text-sm text-gray-700">
                        {getFeatureLabel(key)}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  اگر هیچ ویژگی انتخاب نشود، "پیشنهاد شده" به طور خودکار اضافه می‌شود.
                </p>
              </div>

              {/* Filters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">فیلترها</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(newValueBuy.filters).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`filter-${key}`}
                        checked={value}
                        onChange={(e) => setNewValueBuy({
                          ...newValueBuy,
                          filters: {
                            ...newValueBuy.filters,
                            [key]: e.target.checked
                          }
                        })}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ml-2"
                      />
                      <label htmlFor={`filter-${key}`} className="text-sm text-gray-700">
                        {getFilterLabel(key)}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  اگر هیچ فیلتر انتخاب نشود، "انتخاب اقتصادی" به طور خودکار اضافه می‌شود.
                </p>
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={newValueBuy.isActive}
                  onChange={(e) => setNewValueBuy({...newValueBuy, isActive: e.target.checked})}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ml-2"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  فعال
                </label>
              </div>
            </div>
            
            <div className="flex gap-3 flex-col sm:flex-row mt-8">
              <button
                onClick={handleAddValueBuy}
                disabled={isSubmitting || !newValueBuy.product || availableProducts.length === 0}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex-1"
              >
                {isSubmitting ? 'در حال ذخیره...' : 'ذخیره ValueBuy'}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setServerErrors([]);
                }}
                disabled={isSubmitting}
                className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex-1"
              >
                انصراف
              </button>
            </div>
          </div>
        )}

        {/* Edit ValueBuy Form */}
        {editingValueBuy && editingValueBuy.product && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">ویرایش ValueBuy</h2>
            
            {serverErrors.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-red-800 font-medium mb-2">خطاهای اعتبارسنجی:</h3>
                <ul className="space-y-1">
                  {serverErrors.map((error, index) => (
                    <li key={index} className="text-red-700">
                      • <span className="font-medium">{error.path}</span>: {error.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="space-y-6">
              {/* Product Info (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">محصول</label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg">
                  <p className="font-medium">{editingValueBuy.product.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    برند: {editingValueBuy.product.brand || 'ندارد'} | 
                    قیمت: {formatPrice(editingValueBuy.product.price)} | 
                    موجودی: {editingValueBuy.product.stock}
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  محصول قابل تغییر نیست. برای تغییر محصول، لطفاً ValueBuy جدید ایجاد کنید.
                </p>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">ویژگی‌ها</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(editingValueBuy.features as unknown as Record<string, boolean>).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`edit-feature-${key}`}
                        checked={!!value}
                        onChange={(e) => setEditingValueBuy({
                          ...editingValueBuy,
                          features: {
                            ...(editingValueBuy.features as unknown as Record<string, boolean>),
                            [key]: e.target.checked
                          }
                        } as any)}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ml-2"
                      />
                      <label htmlFor={`edit-feature-${key}`} className="text-sm text-gray-700">
                        {getFeatureLabel(key)}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  اگر هیچ ویژگی انتخاب نشود، "پیشنهاد شده" به طور خودکار اضافه می‌شود.
                </p>
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="edit-isActive"
                  checked={editingValueBuy.isActive}
                  onChange={(e) => setEditingValueBuy({
                    ...editingValueBuy,
                    isActive: e.target.checked
                  })}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ml-2"
                />
                <label htmlFor="edit-isActive" className="text-sm font-medium text-gray-700">
                  فعال
                </label>
              </div>
            </div>

            <div className="flex gap-3 flex-col sm:flex-row mt-8">
              <button
                onClick={handleSaveEdit}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex-1"
              >
                {isSubmitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
              </button>
              <button
                onClick={() => {
                  setEditingValueBuy(null);
                  setServerErrors([]);
                }}
                disabled={isSubmitting}
                className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex-1"
              >
                انصراف
              </button>
            </div>
          </div>
        )}

        {/* ValueBuys List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* List Header */}
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900">
                لیست ValueBuy ({filteredValueBuys.length})
              </h2>
              <div className="text-sm text-gray-600">
                کل ValueBuy: {valueBuys.length} | محصولات قابل انتخاب: {availableProducts.length} از {products.length}
              </div>
            </div>
          </div>

          {/* ValueBuys */}
          <div className="divide-y divide-gray-200">
            {filteredValueBuys.map((item) => (
              <div key={item._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row gap-6">
                  
                  {/* Image Placeholder - Right Side */}
                  <div className="lg:order-2 flex-shrink-0">
                    <div className="bg-gray-100 w-full lg:w-48 h-48 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">
                          {item.product ? 'تصویر محصول' : 'بدون محصول'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ValueBuy Info - Left Side */}
                  <div className="lg:order-1 flex-1">
                    <div className="flex flex-col h-full">
                      
                      {/* ValueBuy Header */}
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {item.product ? item.product.name : 'محصول حذف شده'}
                        </h3>
                        
                        {item.product && item.product.brand && (
                          <p className="text-gray-600 mb-3">برند: <span className="font-medium">{item.product.brand}</span></p>
                        )}

                        {/* Price and Stock - Only show if product exists */}
                        {item.product ? (
                          <div className="flex items-center gap-6 mb-4">
                            <span className="text-2xl font-bold text-green-600">{formatPrice(item.product.price)}</span>
                            <span className="text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded-full">
                              موجودی: {item.product.stock}
                            </span>
                          </div>
                        ) : (
                          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-yellow-800 text-sm">
                              ⚠️ محصول مرتبط با این ValueBuy حذف شده است.
                            </p>
                          </div>
                        )}

                        {/* Features */}
                        {item.features && item.features.length > 0 && (
                          <div className="mb-3">
                            <span className="text-sm text-gray-700 font-medium mb-2 block">ویژگی‌ها:</span>
                            <div className="flex flex-wrap gap-2">
                              {item.features.map((feature, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Filters */}
                        {item.filters && item.filters.length > 0 && (
                          <div className="mb-4">
                            <span className="text-sm text-gray-700 font-medium mb-2 block">فیلترها:</span>
                            <div className="flex flex-wrap gap-2">
                              {item.filters.map((filter, index) => (
                                <span key={index} className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                                  {filter}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer with Status and Actions */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            item.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.isActive ? 'فعال' : 'غیرفعال'}
                          </span>
                          <span className="text-gray-500 text-sm">
                            ایجاد شده در: {new Date(item.createdAt).toLocaleDateString('fa-IR')}
                          </span>
                        </div>
                        
                        {/* Action Buttons - Disable edit if product is null */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit(item)}
                            disabled={isSubmitting || !item.product}
                            className={`${!item.product ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-100 hover:bg-blue-200 text-blue-700'} px-4 py-2 rounded-lg font-medium transition-colors text-sm`}
                            title={!item.product ? 'ویرایش غیرفعال - محصول حذف شده' : ''}
                          >
                            ویرایش
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            disabled={isSubmitting}
                            className="bg-red-100 hover:bg-red-200 disabled:bg-red-50 disabled:text-red-300 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredValueBuys.length === 0 && !loading && (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            {searchTerm ? (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-2">ValueBuy یافت نشد</h3>
                <p className="text-gray-500 mb-6">هیچ ValueBuy با عبارت "{searchTerm}" پیدا نشد.</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                >
                  نمایش تمام ValueBuy
                </button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-2">ValueBuy وجود ندارد</h3>
                <p className="text-gray-500 mb-6">برای شروع، اولین ValueBuy را اضافه کنید.</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  افزودن ValueBuy اول
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}