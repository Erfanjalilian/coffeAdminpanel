'use client';

import { useState, useEffect } from 'react';

// Interfaces
interface Category {
  seo: {
    metaKeywords: string[];
  };
  _id: string;
  name: string;
  slug: string;
  description: string;
  images: string;
  color: string;
  parent: string | null;
  order: number;
  isActive: boolean;
  showOnHomepage: boolean;
  productsCount: number;
  createdAt: string;
  updatedAt: string;
  id: string;
}

interface Product {
  seo: {
    keywords: string[];
  };
  _id: string;
  name: string;
  slug: string;
  description: string;
  positiveFeature: string;
  category: {
    _id: string;
    name: string;
    slug: string;
    id: string;
  } | null;
  badge: string;
  images: string[];
  status: string;
  price: number;
  stock: number;
  originalPrice: number;
  discount: number;
  type: string;
  dealType: string;
  timeLeft: string;
  soldCount: number;
  totalCount: number;
  rating: number;
  isPrime: boolean;
  isPremium: boolean;
  features: string[];
  image: string;
  weight: number;
  ingredients: string;
  benefits: string;
  howToUse: string;
  hasWarranty: boolean;
  warrantyDuration: number;
  warrantyDescription: string;
  userReviews: Array<{
    user: string;
    rating: number;
    comment: string;
    _id: string;
    createdAt: string;
  }>;
  brand: string;
  createdAt: string;
  updatedAt: string;
  recommended: boolean;
  relatedProducts: string[];
  priceAfterDiscount: number;
  id: string;
}

interface NewProductFormData {
  name: string;
  description: string;
  positiveFeature: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
  originalPrice: number;
  discount: number;
  weight: number;
  ingredients: string;
  benefits: string;
  howToUse: string;
  badge: string;
  warrantyDescription: string;
  warrantyDuration: number;
  slug: string;
  features: string[];
  status: string;
  type: string;
  isPrime: boolean;
  isPremium: boolean;
  hasWarranty: boolean;
  recommended: boolean;
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

interface CategoriesResponse {
  status: number;
  success: boolean;
  data: {
    categories: Category[];
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

export default function ProductManager() {
  // State Management
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [featuresInput, setFeaturesInput] = useState('');
  const [serverErrors, setServerErrors] = useState<ValidationError[]>([]);

  // New product state
  const [newProduct, setNewProduct] = useState<NewProductFormData>({
    name: '',
    description: '',
    positiveFeature: '',
    category: '',
    brand: '',
    price: 0,
    stock: 0,
    originalPrice: 0,
    discount: 0,
    weight: 0,
    ingredients: '',
    benefits: '',
    howToUse: '',
    badge: '',
    warrantyDescription: '',
    warrantyDuration: 0,
    slug: '',
    features: [],
    status: 'inactive',
    type: 'regular',
    isPrime: false,
    isPremium: false,
    hasWarranty: false,
    recommended: false,
  });

  const API_BASE_URL = 'https://coffee-shop-backend-k3un.onrender.com/api/v1/product';
  const CATEGORY_API_URL = 'https://coffee-shop-backend-k3un.onrender.com/api/v1/category';

  // Helper functions
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const getDiscountPercentage = (originalPrice: number, currentPrice: number) => {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  // Fetch categories and products on component mount
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Filter products when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const fetchCategories = async () => {
    try {
      console.log('=== Fetching Categories ===');
      const response = await fetch(CATEGORY_API_URL);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }
      
      const data: CategoriesResponse = await response.json();
      console.log('Categories API response:', data);
      
      // Extract categories from the nested structure
      if (data.data && data.data.categories && Array.isArray(data.data.categories)) {
        setCategories(data.data.categories);
        console.log('Categories set:', data.data.categories);
      } else {
        console.error('Unexpected categories response structure:', data);
        setCategories([]);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      alert('خطا در دریافت دسته‌بندی‌ها');
    }
  };

  const fetchProducts = async () => {
    try {
      console.log('=== Fetching Products ===');
      const response = await fetch(API_BASE_URL);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      
      const data: ProductsResponse = await response.json();
      console.log('Products API response:', data);
      
      if (data.data && data.data.products && Array.isArray(data.data.products)) {
        setProducts(data.data.products);
        setFilteredProducts(data.data.products);
        console.log('Products set:', data.data.products.length);
      } else {
        console.error('Unexpected products response structure:', data);
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      alert('خطا در دریافت محصولات');
    }
  };

  // Helper to convert product to FormData
  const createFormData = (productData: NewProductFormData): FormData => {
    const formData = new FormData();
    
    // Required fields
    formData.append('name', productData.name);
    formData.append('description', productData.description || '');
    formData.append('positiveFeature', productData.positiveFeature || '');
    formData.append('category', productData.category);
    formData.append('brand', productData.brand);
    formData.append('price', productData.price.toString());
    formData.append('stock', productData.stock.toString());
    
    // Optional fields with values
    if (productData.slug) formData.append('slug', productData.slug);
    if (productData.originalPrice) formData.append('originalPrice', productData.originalPrice.toString());
    if (productData.discount) formData.append('discount', productData.discount.toString());
    if (productData.weight) formData.append('weight', productData.weight.toString());
    if (productData.ingredients) formData.append('ingredients', productData.ingredients);
    if (productData.benefits) formData.append('benefits', productData.benefits);
    if (productData.howToUse) formData.append('howToUse', productData.howToUse);
    if (productData.badge) formData.append('badge', productData.badge);
    if (productData.warrantyDescription) formData.append('warrantyDescription', productData.warrantyDescription);
    if (productData.warrantyDuration) formData.append('warrantyDuration', productData.warrantyDuration.toString());
    
    // Features as JSON string (backend can parse array)
    if (productData.features.length > 0) {
      formData.append('features', JSON.stringify(productData.features));
    }
    
    // Boolean and enum fields
    formData.append('status', productData.status);
    formData.append('type', productData.type);
    formData.append('isPrime', productData.isPrime.toString());
    formData.append('isPremium', productData.isPremium.toString());
    formData.append('hasWarranty', productData.hasWarranty.toString());
    formData.append('recommended', productData.recommended.toString());
    
    return formData;
  };

  // Add Product Functionality
  const handleAddProduct = async () => {
    // Form Validation
    if (!newProduct.name || !newProduct.price || !newProduct.stock || !newProduct.category || !newProduct.brand) {
      alert('لطفاً فیلدهای ضروری (نام، قیمت، موجودی، دسته‌بندی، برند) را پر کنید');
      return;
    }

    if (newProduct.discount < 0 || newProduct.discount > 100) {
      alert('تخفیف باید بین ۰ تا ۱۰۰ درصد باشد');
      return;
    }

    // Auto-generate slug from name if not provided
    const slugToUse = newProduct.slug || newProduct.name
      .toLowerCase()
      .replace(/[^\w\u0600-\u06FF]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/[^a-z0-9-]/g, '');

    const productData = {
      ...newProduct,
      slug: slugToUse,
    };

    try {
      setIsSubmitting(true);
      setServerErrors([]);

      console.log('=== START: Add Product Request ===');
      console.log('Endpoint:', API_BASE_URL);
      console.log('Method: POST');
      console.log('Product data:', productData);

      const formData = createFormData(productData);
      
      // Log FormData contents
      console.log('FormData contents:');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        body: formData,
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
          
          // Extract validation errors
          if (errorData.data && Array.isArray(errorData.data)) {
            setServerErrors(errorData.data);
            const errorMessages = errorData.data.map(err => 
              `• ${err.path}: ${err.message}`
            ).join('\n');
            alert(`خطا در افزودن محصول:\n\n${errorMessages}`);
          } else {
            alert(`افزودن محصول ناموفق بود: ${errorData.error || response.statusText}`);
          }
        } catch (e) {
          console.error('Could not parse error response as JSON:', e);
          alert(`افزودن محصول ناموفق بود: ${response.status} - ${responseText}`);
        }
        
        throw new Error(`افزودن محصول ناموفق بود: ${response.status}`);
      }

      console.log('=== END: Add Product Request - SUCCESS ===');

      // Reset form
      setNewProduct({
        name: '',
        description: '',
        positiveFeature: '',
        category: '',
        brand: '',
        price: 0,
        stock: 0,
        originalPrice: 0,
        discount: 0,
        weight: 0,
        ingredients: '',
        benefits: '',
        howToUse: '',
        badge: '',
        warrantyDescription: '',
        warrantyDuration: 0,
        slug: '',
        features: [],
        status: 'inactive',
        type: 'regular',
        isPrime: false,
        isPremium: false,
        hasWarranty: false,
        recommended: false,
      });
      setFeaturesInput('');
      setServerErrors([]);

      // Refresh products list
      await fetchProducts();
      setShowAddForm(false);
      alert('محصول با موفقیت اضافه شد');
    } catch (err) {
      console.error('=== Add Product Request - FAILED ===');
      console.error('Error details:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit Product Functionality
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowAddForm(false);
    setServerErrors([]);
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;

    try {
      setIsSubmitting(true);
      setServerErrors([]);

      const updateData: Partial<NewProductFormData> = {
        name: editingProduct.name,
        description: editingProduct.description,
        positiveFeature: editingProduct.positiveFeature,
        category: editingProduct.category?._id || '',
        brand: editingProduct.brand,
        price: editingProduct.price,
        stock: editingProduct.stock,
        originalPrice: editingProduct.originalPrice,
        discount: editingProduct.discount,
        weight: editingProduct.weight,
        ingredients: editingProduct.ingredients,
        benefits: editingProduct.benefits,
        howToUse: editingProduct.howToUse,
        badge: editingProduct.badge,
        warrantyDescription: editingProduct.warrantyDescription,
        warrantyDuration: editingProduct.warrantyDuration,
        slug: editingProduct.slug,
        features: editingProduct.features,
        status: editingProduct.status,
        type: editingProduct.type,
        isPrime: editingProduct.isPrime,
        isPremium: editingProduct.isPremium,
        hasWarranty: editingProduct.hasWarranty,
        recommended: editingProduct.recommended,
      };

      console.log('=== START: Edit Product Request ===');
      console.log('Endpoint:', `${API_BASE_URL}/${editingProduct._id}`);
      console.log('Method: PATCH');
      console.log('Product ID:', editingProduct._id);
      console.log('Update data:', updateData);

      const formData = new FormData();
      
      // Append only changed fields
      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (typeof value === 'boolean') {
            formData.append(key, value.toString());
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      const response = await fetch(`${API_BASE_URL}/${editingProduct._id}`, {
        method: 'PATCH',
        body: formData,
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
            alert(`خطا در ویرایش محصول:\n\n${errorMessages}`);
          } else {
            alert(`ویرایش محصول ناموفق بود: ${errorData.error || response.statusText}`);
          }
        } catch (e) {
          console.error('Could not parse error response as JSON:', e);
          alert(`ویرایش محصول ناموفق بود: ${response.status} - ${responseText}`);
        }
        
        throw new Error(`ویرایش محصول ناموفق بود: ${response.status}`);
      }

      console.log('=== END: Edit Product Request - SUCCESS ===');

      // Update local state
      setProducts(products.map(item => 
        item._id === editingProduct._id ? editingProduct : item
      ));
      setEditingProduct(null);
      setServerErrors([]);
      alert('محصول با موفقیت به‌روزرسانی شد');
    } catch (err) {
      console.error('=== Edit Product Request - FAILED ===');
      console.error('Error details:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Product
  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این محصول اطمینان دارید؟')) {
      return;
    }

    try {
      console.log('=== START: Delete Product Request ===');
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
        let errorMessage = `حذف محصول ناموفق بود: ${response.status}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage += ` - ${errorData.error || responseText}`;
        } catch (e) {
          errorMessage += ` - ${responseText}`;
        }
        throw new Error(errorMessage);
      }

      console.log('=== END: Delete Product Request - SUCCESS ===');

      // Remove product from local state
      setProducts(products.filter(item => item._id !== id));
      alert('محصول با موفقیت حذف شد');
    } catch (err) {
      console.error('=== Delete Product Request - FAILED ===');
      console.error('Error details:', err);
      alert(`خطا در حذف محصول: ${err instanceof Error ? err.message : 'خطای ناشناخته'}`);
    }
  };

  // Features Handling
  const addFeature = () => {
    if (featuresInput.trim() && !newProduct.features.includes(featuresInput.trim())) {
      setNewProduct({
        ...newProduct,
        features: [...newProduct.features, featuresInput.trim()]
      });
      setFeaturesInput('');
    }
  };

  const removeFeature = (featureToRemove: string) => {
    setNewProduct({
      ...newProduct,
      features: newProduct.features.filter(f => f !== featureToRemove)
    });
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">مدیریت محصولات</h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">مدیریت و ویرایش محصولات فروشگاه</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base w-full sm:w-auto"
            >
              {isSubmitting ? 'در حال پردازش...' : 'افزودن محصول جدید'}
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                جستجو در محصولات
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="جستجو بر اساس نام، توضیحات یا برند محصول..."
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
              <span> : {filteredProducts.length} محصول یافت شد</span>
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

        {/* Add Product Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">افزودن محصول جدید</h2>
            <div className="space-y-6">
              {/* Required Fields Note */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>توجه:</strong> فیلدهای با ستاره (*) اجباری هستند.
                </p>
                <p className="text-sm text-blue-800 mt-1">
                  تصویر پیش‌فرض به صورت خودکار استفاده می‌شود.
                </p>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نام محصول *
                  </label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      serverErrors.some(e => e.path === 'name') 
                        ? 'border-red-500' 
                        : 'border-gray-300'
                    }`}
                    placeholder="نام محصول را وارد کنید"
                    required
                  />
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    برند *
                  </label>
                  <input
                    type="text"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      serverErrors.some(e => e.path === 'brand') 
                        ? 'border-red-500' 
                        : 'border-gray-300'
                    }`}
                    placeholder="نام برند"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    دسته‌بندی *
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      serverErrors.some(e => e.path === 'category') 
                        ? 'border-red-500' 
                        : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">انتخاب دسته‌بندی</option>
                    {categories.length > 0 ? (
                      categories.map(category => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>در حال بارگیری دسته‌بندی‌ها...</option>
                    )}
                  </select>
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسلاگ (اختیاری - از نام تولید می‌شود)
                  </label>
                  <input
                    type="text"
                    value={newProduct.slug}
                    onChange={(e) => setNewProduct({...newProduct, slug: e.target.value})}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      serverErrors.some(e => e.path === 'slug') 
                        ? 'border-red-500' 
                        : 'border-gray-300'
                    }`}
                    placeholder="نامک محصول (به انگلیسی)"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    قیمت فروش (تومان) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={newProduct.price || ''}
                    onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      serverErrors.some(e => e.path === 'price') 
                        ? 'border-red-500' 
                        : 'border-gray-300'
                    }`}
                    placeholder="قیمت فروش محصول"
                    required
                  />
                </div>

                {/* Original Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    قیمت اصلی (تومان)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={newProduct.originalPrice || ''}
                    onChange={(e) => setNewProduct({...newProduct, originalPrice: Number(e.target.value)})}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      serverErrors.some(e => e.path === 'originalPrice') 
                        ? 'border-red-500' 
                        : 'border-gray-300'
                    }`}
                    placeholder="قیمت اصلی محصول"
                  />
                </div>

                {/* Discount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تخفیف (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newProduct.discount || ''}
                    onChange={(e) => setNewProduct({...newProduct, discount: Number(e.target.value)})}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      serverErrors.some(e => e.path === 'discount') 
                        ? 'border-red-500' 
                        : 'border-gray-300'
                    }`}
                    placeholder="درصد تخفیف"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    موجودی *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newProduct.stock || ''}
                    onChange={(e) => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      serverErrors.some(e => e.path === 'stock') 
                        ? 'border-red-500' 
                        : 'border-gray-300'
                    }`}
                    placeholder="تعداد موجودی"
                    required
                  />
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وزن (گرم)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newProduct.weight || ''}
                    onChange={(e) => setNewProduct({...newProduct, weight: Number(e.target.value)})}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      serverErrors.some(e => e.path === 'weight') 
                        ? 'border-red-500' 
                        : 'border-gray-300'
                    }`}
                    placeholder="وزن محصول"
                  />
                </div>

                {/* Positive Feature */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ویژگی مثبت *
                  </label>
                  <input
                    type="text"
                    value={newProduct.positiveFeature}
                    onChange={(e) => setNewProduct({...newProduct, positiveFeature: e.target.value})}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      serverErrors.some(e => e.path === 'positiveFeature') 
                        ? 'border-red-500' 
                        : 'border-gray-300'
                    }`}
                    placeholder="ویژگی مثبت محصول"
                    required
                  />
                </div>

                {/* Badge */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع برچسب
                  </label>
                  <input
                    type="text"
                    value={newProduct.badge}
                    onChange={(e) => setNewProduct({...newProduct, badge: e.target.value})}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      serverErrors.some(e => e.path === 'badge') 
                        ? 'border-red-500' 
                        : 'border-gray-300'
                    }`}
                    placeholder="مثال: پرفروش"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  توضیحات محصول *
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    serverErrors.some(e => e.path === 'description') 
                      ? 'border-red-500' 
                      : 'border-gray-300'
                  }`}
                  placeholder="توضیحات کامل محصول"
                  required
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ویژگی‌های محصول
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={featuresInput}
                    onChange={(e) => setFeaturesInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ویژگی جدید را وارد کنید"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="bg-blue-100 text-blue-700 px-4 py-3 rounded-lg font-medium hover:bg-blue-200 transition-colors"
                  >
                    افزودن
                  </button>
                </div>
                {newProduct.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newProduct.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(feature)}
                          className="mr-1 text-gray-500 hover:text-red-500"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ingredients */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    مواد تشکیل‌دهنده
                  </label>
                  <input
                    type="text"
                    value={newProduct.ingredients}
                    onChange={(e) => setNewProduct({...newProduct, ingredients: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مواد تشکیل‌دهنده محصول"
                  />
                </div>

                {/* Benefits */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    فواید
                  </label>
                  <input
                    type="text"
                    value={newProduct.benefits}
                    onChange={(e) => setNewProduct({...newProduct, benefits: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="فواید محصول"
                  />
                </div>

                {/* How to Use */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نحوه استفاده
                  </label>
                  <input
                    type="text"
                    value={newProduct.howToUse}
                    onChange={(e) => setNewProduct({...newProduct, howToUse: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="نحوه استفاده از محصول"
                  />
                </div>

                {/* Warranty Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    مدت گارانتی (ماه)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newProduct.warrantyDuration || ''}
                    onChange={(e) => setNewProduct({...newProduct, warrantyDuration: Number(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مدت گارانتی"
                  />
                </div>

                {/* Warranty Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    توضیحات گارانتی
                  </label>
                  <input
                    type="text"
                    value={newProduct.warrantyDescription}
                    onChange={(e) => setNewProduct({...newProduct, warrantyDescription: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="توضیحات گارانتی محصول"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع محصول
                  </label>
                  <select
                    value={newProduct.type}
                    onChange={(e) => setNewProduct({...newProduct, type: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="regular">معمولی</option>
                    <option value="discount">تخفیف‌دار</option>
                    <option value="premium">پریمیوم</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وضعیت
                  </label>
                  <select
                    value={newProduct.status}
                    onChange={(e) => setNewProduct({...newProduct, status: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="inactive">غیرفعال</option>
                    <option value="active">فعال</option>
                  </select>
                </div>

                {/* Boolean Fields */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPrime"
                      checked={newProduct.isPrime}
                      onChange={(e) => setNewProduct({...newProduct, isPrime: e.target.checked})}
                      className="h-4 w-4 text-blue-600 rounded ml-2"
                    />
                    <label htmlFor="isPrime" className="text-sm text-gray-700">
                      محصول پرایم
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isPremium"
                      checked={newProduct.isPremium}
                      onChange={(e) => setNewProduct({...newProduct, isPremium: e.target.checked})}
                      className="h-4 w-4 text-blue-600 rounded ml-2"
                    />
                    <label htmlFor="isPremium" className="text-sm text-gray-700">
                      محصول پریمیوم
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hasWarranty"
                      checked={newProduct.hasWarranty}
                      onChange={(e) => setNewProduct({...newProduct, hasWarranty: e.target.checked})}
                      className="h-4 w-4 text-blue-600 rounded ml-2"
                    />
                    <label htmlFor="hasWarranty" className="text-sm text-gray-700">
                      دارای گارانتی
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="recommended"
                      checked={newProduct.recommended}
                      onChange={(e) => setNewProduct({...newProduct, recommended: e.target.checked})}
                      className="h-4 w-4 text-blue-600 rounded ml-2"
                    />
                    <label htmlFor="recommended" className="text-sm text-gray-700">
                      پیشنهاد شده
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 flex-col sm:flex-row mt-8">
              <button
                onClick={handleAddProduct}
                disabled={isSubmitting || !newProduct.name || !newProduct.price || !newProduct.stock || !newProduct.category || !newProduct.brand || !newProduct.description || !newProduct.positiveFeature}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex-1"
              >
                {isSubmitting ? 'در حال ذخیره...' : 'ذخیره محصول'}
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

        {/* Edit Product Form */}
        {editingProduct && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">ویرایش محصول</h2>
            
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نام محصول</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    name: e.target.value
                  })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    serverErrors.some(e => e.path === 'name') 
                      ? 'border-red-500' 
                      : 'border-gray-300'
                  }`}
                />
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">برند</label>
                <input
                  type="text"
                  value={editingProduct.brand}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    brand: e.target.value
                  })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    serverErrors.some(e => e.path === 'brand') 
                      ? 'border-red-500' 
                      : 'border-gray-300'
                  }`}
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">قیمت فروش (تومان)</label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    price: Number(e.target.value)
                  })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    serverErrors.some(e => e.path === 'price') 
                      ? 'border-red-500' 
                      : 'border-gray-300'
                  }`}
                />
              </div>

              {/* Original Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">قیمت اصلی (تومان)</label>
                <input
                  type="number"
                  value={editingProduct.originalPrice}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    originalPrice: Number(e.target.value)
                  })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    serverErrors.some(e => e.path === 'originalPrice') 
                      ? 'border-red-500' 
                      : 'border-gray-300'
                  }`}
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">موجودی</label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    stock: Number(e.target.value)
                  })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    serverErrors.some(e => e.path === 'stock') 
                      ? 'border-red-500' 
                      : 'border-gray-300'
                  }`}
                />
              </div>

              {/* Discount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">تخفیف (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editingProduct.discount || 0}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    discount: Number(e.target.value)
                  })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    serverErrors.some(e => e.path === 'discount') 
                      ? 'border-red-500' 
                      : 'border-gray-300'
                  }`}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">دسته‌بندی</label>
                <select
                  value={editingProduct.category?._id || ''}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    category: categories.find(cat => cat._id === e.target.value) || null
                  })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    serverErrors.some(e => e.path === 'category') 
                      ? 'border-red-500' 
                      : 'border-gray-300'
                  }`}
                >
                  <option value="">انتخاب دسته‌بندی</option>
                  {categories.length > 0 ? (
                    categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>در حال بارگیری دسته‌بندی‌ها...</option>
                  )}
                </select>
              </div>

              {/* Positive Feature */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ویژگی مثبت</label>
                <input
                  type="text"
                  value={editingProduct.positiveFeature}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    positiveFeature: e.target.value
                  })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    serverErrors.some(e => e.path === 'positiveFeature') 
                      ? 'border-red-500' 
                      : 'border-gray-300'
                  }`}
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اسلاگ</label>
                <input
                  type="text"
                  value={editingProduct.slug}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    slug: e.target.value
                  })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    serverErrors.some(e => e.path === 'slug') 
                      ? 'border-red-500' 
                      : 'border-gray-300'
                  }`}
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">وزن (گرم)</label>
                <input
                  type="number"
                  value={editingProduct.weight}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    weight: Number(e.target.value)
                  })}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    serverErrors.some(e => e.path === 'weight') 
                      ? 'border-red-500' 
                      : 'border-gray-300'
                  }`}
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">وضعیت</label>
                <select
                  value={editingProduct.status}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    status: e.target.value
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="inactive">غیرفعال</option>
                  <option value="active">فعال</option>
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع محصول</label>
                <select
                  value={editingProduct.type}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    type: e.target.value
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="regular">معمولی</option>
                  <option value="discount">تخفیف‌دار</option>
                  <option value="premium">پریمیوم</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
              <textarea
                value={editingProduct.description}
                onChange={(e) => setEditingProduct({
                  ...editingProduct,
                  description: e.target.value
                })}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6 ${
                  serverErrors.some(e => e.path === 'description') 
                    ? 'border-red-500' 
                    : 'border-gray-300'
                }`}
              />
            </div>

            <div className="flex gap-3 flex-col sm:flex-row">
              <button
                onClick={handleSaveEdit}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex-1"
              >
                {isSubmitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
              </button>
              <button
                onClick={() => {
                  setEditingProduct(null);
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

        {/* Products List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* List Header */}
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900">
                لیست محصولات ({filteredProducts.length})
              </h2>
              <div className="text-sm text-gray-600">
                کل محصولات: {products.length}
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <div key={product._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row gap-6">
                  
                  {/* Image Placeholder - Right Side */}
                  <div className="lg:order-2 flex-shrink-0">
                    <div className="bg-gray-100 w-full lg:w-48 h-48 rounded-lg flex items-center justify-center relative">
                      {/* Badge */}
                      {product.badge && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                          {product.badge}
                        </div>
                      )}
                      {/* Discount Badge */}
                      {product.discount > 0 && (
                        <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                          {getDiscountPercentage(product.originalPrice, product.priceAfterDiscount)}%
                        </div>
                      )}
                      <div className="text-center text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">تصویر پیش‌فرض</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Info - Left Side */}
                  <div className="lg:order-1 flex-1">
                    <div className="flex flex-col h-full">
                      
                      {/* Product Header */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                          <div className="flex items-center gap-2">
                            {product.isPrime && (
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">پرایم</span>
                            )}
                            {product.isPremium && (
                              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">پریمیوم</span>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-2">برند: <span className="font-medium">{product.brand}</span></p>

                        {product.category && (
                          <p className="text-gray-600 mb-3">دسته‌بندی: <span className="font-medium">{product.category.name}</span></p>
                        )}

                        {/* Price and Stock */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-green-600">
                              {formatPrice(product.priceAfterDiscount)}
                            </span>
                            {product.discount > 0 && product.originalPrice > product.priceAfterDiscount && (
                              <span className="text-lg text-gray-500 line-through">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                              موجودی: {product.stock}
                            </span>
                            <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                              فروخته شده: {product.soldCount}
                            </span>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating) 
                                    ? 'text-yellow-400' 
                                    : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {product.rating} ({product.userReviews.length} نظر)
                          </span>
                        </div>

                        {/* Features */}
                        {product.features && product.features.length > 0 && (
                          <div className="mb-3">
                            <span className="text-sm text-gray-700 font-medium mb-2 block">ویژگی‌ها:</span>
                            <div className="flex flex-wrap gap-2">
                              {product.features.slice(0, 3).map((feature, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                                  {feature}
                                </span>
                              ))}
                              {product.features.length > 3 && (
                                <span className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                                  +{product.features.length - 3} بیشتر
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      {/* Footer with Status and Actions */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            product.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.status === 'active' ? 'فعال' : 'غیرفعال'}
                          </span>
                          <span className="text-gray-500 text-sm">
                            ایجاد شده در: {new Date(product.createdAt).toLocaleDateString('fa-IR')}
                          </span>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit(product)}
                            disabled={isSubmitting}
                            className="bg-blue-100 hover:bg-blue-200 disabled:bg-blue-50 disabled:text-blue-300 text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                          >
                            ویرایش
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
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
        {filteredProducts.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            {searchTerm ? (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-2">محصولی یافت نشد</h3>
                <p className="text-gray-500 mb-6">هیچ محصولی با عبارت "{searchTerm}" پیدا نشد.</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                >
                  نمایش تمام محصولات
                </button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-2">محصولی وجود ندارد</h3>
                <p className="text-gray-500 mb-6">برای شروع، اولین محصول را اضافه کنید.</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  افزودن محصول اول
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}