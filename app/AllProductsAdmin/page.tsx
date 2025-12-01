'use client';

import { useState, useEffect } from 'react';

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
  reviews?: number;
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
    id: string;
  }>;
  brand?: string;
  recommended: boolean;
  relatedProducts: string[];
  createdAt: string;
  updatedAt: string;
  priceAfterDiscount: number;
  id: string;
}

interface NewProduct {
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  stock: number;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  badge: string;
  positiveFeature: string;
  features: string[];
  weight: number;
  ingredients: string;
  benefits: string;
  howToUse: string;
  warrantyDuration: number;
  warrantyDescription: string;
  brand?: string;
  slug: string;
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

export default function AllProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    discount: 0,
    stock: 0,
    category: {
      _id: '',
      name: '',
      slug: ''
    },
    badge: '',
    positiveFeature: '',
    features: [],
    weight: 0,
    ingredients: '',
    benefits: '',
    howToUse: '',
    warrantyDuration: 0,
    warrantyDescription: '',
    brand: '',
    slug: '',
  });
  const [featuresInput, setFeaturesInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL = 'https://coffee-shop-backend-k3un.onrender.com/api/v1/product';

  // Helper functions for generating values
  const generateRandomId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const generateRandomDate = () => new Date().toISOString();

  // Generate a random user ID like in your API
  const generateRandomUserId = () => {
    const prefix = '691b75ecd2d4fd0f55e46b';
    const suffix = Math.floor(100 + Math.random() * 900);
    return `${prefix}${suffix}`;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products based on search term
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.category && product.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      
      const data: ProductsResponse = await response.json();
      setProducts(data.data.products);
      setFilteredProducts(data.data.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowAddForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این محصول اطمینان دارید؟')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`حذف محصول ناموفق بود: ${response.status}`);
      }

      // Remove product from local state
      setProducts(products.filter(item => item._id !== id));
      alert('محصول با موفقیت حذف شد');
    } catch (err) {
      alert(`خطا در حذف محصول: ${err instanceof Error ? err.message : 'خطای ناشناخته'}`);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;

    try {
      setIsSubmitting(true);

      // Prepare update data
      const updateData = {
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price,
        originalPrice: editingProduct.originalPrice || editingProduct.price,
        discount: editingProduct.discount,
        stock: editingProduct.stock,
        status: editingProduct.status,
        badge: editingProduct.badge,
        positiveFeature: editingProduct.positiveFeature,
        isPrime: editingProduct.isPrime,
        isPremium: editingProduct.isPremium,
        features: editingProduct.features,
        weight: editingProduct.weight,
        ingredients: editingProduct.ingredients,
        benefits: editingProduct.benefits,
        howToUse: editingProduct.howToUse,
        hasWarranty: editingProduct.hasWarranty,
        warrantyDuration: editingProduct.warrantyDuration,
        warrantyDescription: editingProduct.warrantyDescription,
        brand: editingProduct.brand || '',
        recommended: editingProduct.recommended,
        category: editingProduct.category,
      };

      const response = await fetch(`${API_BASE_URL}/${editingProduct._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`به‌روزرسانی محصول ناموفق بود: ${response.status} - ${errorData.message || ''}`);
      }

      // Refresh products list
      await fetchProducts();
      setEditingProduct(null);
      alert('محصول با موفقیت به‌روزرسانی شد');
    } catch (err) {
      alert(`خطا در به‌روزرسانی محصول: ${err instanceof Error ? err.message : 'خطای ناشناخته'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      setIsSubmitting(true);

      // Validate required fields
      if (!newProduct.name || !newProduct.price || !newProduct.stock || !newProduct.category._id || !newProduct.category.name) {
        alert('لطفاً فیلدهای ضروری (نام، قیمت، موجودی، دسته‌بندی) را پر کنید');
        return;
      }

      // Auto-generate slug from name if not provided
      const slug = newProduct.slug || newProduct.name
        .toLowerCase()
        .replace(/[^\w\u0600-\u06FF]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Calculate price after discount
      const priceAfterDiscount = newProduct.originalPrice > 0 
        ? newProduct.originalPrice - (newProduct.originalPrice * newProduct.discount / 100)
        : newProduct.price;

      // Generate realistic values based on your API structure
      const productId = generateRandomId();
      const currentDate = generateRandomDate();
      const userId = generateRandomUserId();
      const reviewId = generateRandomId();
      
      // Prepare product data with ALL fields filled
      const productData = {
        // User-provided fields
        name: newProduct.name,
        description: newProduct.description || 'قهوه اسپرسو ایتالیایی اصل با عطر و طعمی غنی و منحصر به فرد.',
        price: newProduct.price,
        originalPrice: newProduct.originalPrice || newProduct.price * 1.1, // 10% more than sale price
        discount: newProduct.discount || 5,
        stock: newProduct.stock,
        category: {
          _id: newProduct.category._id,
          name: newProduct.category.name,
          slug: newProduct.category.slug || 'coffee',
          id: newProduct.category._id
        },
        badge: newProduct.badge || 'پرفروش',
        positiveFeature: newProduct.positiveFeature || 'کیفیت عالی با قیمت اقتصادی',
        features: newProduct.features.length > 0 ? newProduct.features : ['حرفه ای'],
        weight: newProduct.weight || 250,
        ingredients: newProduct.ingredients || '100٪ دانه عربیکا',
        benefits: newProduct.benefits || 'افزایش انرژی، بهبود تمرکز',
        howToUse: newProduct.howToUse || 'در قهوه ساز ریخته و دم کنید',
        warrantyDuration: newProduct.warrantyDuration || 6,
        warrantyDescription: newProduct.warrantyDescription || 'گارانتی تجهیزات دم‌آوری 6 ماهه',
        brand: newProduct.brand || 'Reale Coffee',
        slug: slug,
        
        // Auto-generated fields with realistic values
        seo: {
          keywords: [] // Empty array as in your API
        },
        status: 'active',
        type: 'regular',
        dealType: 'lightning',
        isPrime: true,
        isPremium: true,
        hasWarranty: true,
        recommended: true,
        priceAfterDiscount: priceAfterDiscount,
        
        // Realistic values matching your API structure
        images: [`public/images/products/product-${productId.substring(0, 8)}.jpg`],
        image: `public/images/products/product-${productId.substring(0, 8)}.jpg`,
        timeLeft: '02:45:30', // Fixed time as in your API
        soldCount: Math.floor(newProduct.stock * 0.5), // 50% of stock sold
        totalCount: newProduct.stock * 2, // Double the stock for total count
        rating: 0,
        reviews: 0,
        
        // User reviews with realistic structure
        userReviews: [
          {
            user: userId,
            rating: 5,
            comment: 'عالی بود، خیلی خوشم اومد',
            _id: reviewId,
            createdAt: currentDate,
            id: reviewId
          }
        ],
        
        // Related products (empty array or with IDs if available)
        relatedProducts: products.length > 0 ? [products[0]._id] : [],
        
        // Dates and IDs
        createdAt: currentDate,
        updatedAt: currentDate,
        _id: productId,
        id: productId
      };

      console.log('Sending product data:', JSON.stringify(productData, null, 2));

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.log('Server error response:', responseData);
        throw new Error(`افزودن محصول ناموفق بود: ${response.status} - ${JSON.stringify(responseData)}`);
      }

      // Reset form
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        originalPrice: 0,
        discount: 0,
        stock: 0,
        category: {
          _id: '',
          name: '',
          slug: ''
        },
        badge: '',
        positiveFeature: '',
        features: [],
        weight: 0,
        ingredients: '',
        benefits: '',
        howToUse: '',
        warrantyDuration: 0,
        warrantyDescription: '',
        brand: '',
        slug: '',
      });
      setFeaturesInput('');

      // Refresh products list
      await fetchProducts();
      setShowAddForm(false);
      alert('محصول با موفقیت اضافه شد');
    } catch (err) {
      alert(`خطا در اضافه کردن محصول: ${err instanceof Error ? err.message : 'خطای ناشناخته'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const getDiscountPercentage = (originalPrice: number, currentPrice: number) => {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
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

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 py-8">
      {/* Main Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">مدیریت تمام محصولات</h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">مدیریت و ویرایش تمام محصولات فروشگاه</p>
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
                  placeholder="جستجو بر اساس نام، توضیحات، برند یا دسته‌بندی..."
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

        {/* Add Product Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">افزودن محصول جدید</h2>
            <div className="space-y-6">
              {/* Required Fields */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>توجه:</strong> فیلدهای با ستاره (*) اجباری هستند. سایر فیلدها به صورت خودکار با مقادیر واقعی پر می‌شوند.
                </p>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نام محصول *</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="نام محصول را وارد کنید"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اسلاگ (اختیاری)</label>
                  <input
                    type="text"
                    value={newProduct.slug}
                    onChange={(e) => setNewProduct({...newProduct, slug: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="نامک محصول (به انگلیسی)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">قیمت اصلی (تومان) *</label>
                  <input
                    type="number"
                    value={newProduct.originalPrice || ''}
                    onChange={(e) => setNewProduct({...newProduct, originalPrice: Number(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="قیمت اصلی محصول"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">قیمت فروش (تومان) *</label>
                  <input
                    type="number"
                    value={newProduct.price || ''}
                    onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="قیمت فروش محصول"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">تخفیف (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newProduct.discount || ''}
                    onChange={(e) => setNewProduct({...newProduct, discount: Number(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="درصد تخفیف"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">موجودی *</label>
                  <input
                    type="number"
                    value={newProduct.stock || ''}
                    onChange={(e) => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="تعداد موجودی"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">برند</label>
                  <input
                    type="text"
                    value={newProduct.brand || ''}
                    onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="نام برند"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">وزن (گرم)</label>
                  <input
                    type="number"
                    value={newProduct.weight || ''}
                    onChange={(e) => setNewProduct({...newProduct, weight: Number(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="وزن محصول"
                  />
                </div>
              </div>

              {/* Category Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">اطلاعات دسته‌بندی *</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">شناسه دسته‌بندی *</label>
                    <input
                      type="text"
                      value={newProduct.category._id}
                      onChange={(e) => setNewProduct({
                        ...newProduct,
                        category: {
                          ...newProduct.category,
                          _id: e.target.value
                        }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="مثال: 691ca406b352811ec2947020"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">شناسه یکتای دسته‌بندی</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">نام دسته‌بندی *</label>
                    <input
                      type="text"
                      value={newProduct.category.name}
                      onChange={(e) => setNewProduct({
                        ...newProduct,
                        category: {
                          ...newProduct.category,
                          name: e.target.value
                        }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="مثال: موشیدنی خودت رو بخر"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">اسلاگ دسته‌بندی</label>
                    <input
                      type="text"
                      value={newProduct.category.slug}
                      onChange={(e) => setNewProduct({
                        ...newProduct,
                        category: {
                          ...newProduct.category,
                          slug: e.target.value
                        }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="مثال: coffee"
                    />
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>راهنما:</strong> از محصولات موجود می‌توانید اطلاعات دسته‌بندی را کپی کنید. به مثال زیر توجه کنید:
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    شناسه: <code>691ca406b352811ec2947020</code> | نام: <code>موشیدنی خودت رو بخر</code> | اسلاگ: <code>coffee</code>
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات محصول</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="توضیحات کامل محصول"
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ویژگی‌های محصول</label>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">مواد تشکیل‌دهنده</label>
                  <input
                    type="text"
                    value={newProduct.ingredients}
                    onChange={(e) => setNewProduct({...newProduct, ingredients: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مواد تشکیل‌دهنده محصول"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">فواید</label>
                  <input
                    type="text"
                    value={newProduct.benefits}
                    onChange={(e) => setNewProduct({...newProduct, benefits: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="فواید محصول"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نحوه استفاده</label>
                  <input
                    type="text"
                    value={newProduct.howToUse}
                    onChange={(e) => setNewProduct({...newProduct, howToUse: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="نحوه استفاده از محصول"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ویژگی مثبت</label>
                  <input
                    type="text"
                    value={newProduct.positiveFeature}
                    onChange={(e) => setNewProduct({...newProduct, positiveFeature: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ویژگی مثبت محصول"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">نوع برچسب</label>
                  <input
                    type="text"
                    value={newProduct.badge}
                    onChange={(e) => setNewProduct({...newProduct, badge: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مثال: پرفروش"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات گارانتی</label>
                  <input
                    type="text"
                    value={newProduct.warrantyDescription}
                    onChange={(e) => setNewProduct({...newProduct, warrantyDescription: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="توضیحات گارانتی محصول"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">مدت گارانتی (ماه)</label>
                  <input
                    type="number"
                    value={newProduct.warrantyDuration || ''}
                    onChange={(e) => setNewProduct({...newProduct, warrantyDuration: Number(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مدت گارانتی"
                  />
                </div>
              </div>

              {/* Auto-generated fields info */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800 mb-2">
                  <strong>فیلدهای خودکار:</strong> فیلدهای زیر به صورت خودکار با مقادیر واقعی پر می‌شوند:
                </p>
                <ul className="text-xs text-green-700 list-disc list-inside space-y-1">
                  <li>تصاویر: آدرس تصویر واقعی</li>
                  <li>زمان باقی‌مانده: 02:45:30</li>
                  <li>فروخته شده: 50% موجودی</li>
                  <li>تعداد کل: دو برابر موجودی</li>
                  <li>نظرات کاربران: یک نظر نمونه 5 ستاره</li>
                  <li>محصولات مرتبط: اولین محصول موجود</li>
                  <li>SEO: آرایه خالی</li>
                  <li>وضعیت: فعال</li>
                  <li>پرایم/پریمیوم/گارانتی/پیشنهادی: فعال</li>
                </ul>
              </div>
            </div>
            
            <div className="flex gap-3 flex-col sm:flex-row mt-8">
              <button
                onClick={handleAddProduct}
                disabled={isSubmitting || !newProduct.name || !newProduct.price || !newProduct.stock || !newProduct.category._id || !newProduct.category.name}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex-1"
              >
                {isSubmitting ? 'در حال ذخیره...' : 'ذخیره محصول'}
              </button>
              <button
                onClick={() => setShowAddForm(false)}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نام محصول</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    name: e.target.value
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">قیمت فروش (تومان)</label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    price: Number(e.target.value)
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">قیمت اصلی (تومان)</label>
                <input
                  type="number"
                  value={editingProduct.originalPrice || editingProduct.price}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    originalPrice: Number(e.target.value)
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">موجودی</label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    stock: Number(e.target.value)
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">برند</label>
                <input
                  type="text"
                  value={editingProduct.brand || ''}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    brand: e.target.value
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {editingProduct.category && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">شناسه دسته‌بندی</label>
                    <input
                      type="text"
                      value={editingProduct.category._id}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        category: {
                          ...editingProduct.category!,
                          _id: e.target.value
                        }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">نام دسته‌بندی</label>
                    <input
                      type="text"
                      value={editingProduct.category.name}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        category: {
                          ...editingProduct.category!,
                          name: e.target.value
                        }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
              <textarea
                value={editingProduct.description}
                onChange={(e) => setEditingProduct({
                  ...editingProduct,
                  description: e.target.value
                })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6"
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
                onClick={() => setEditingProduct(null)}
                disabled={isSubmitting}
                className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex-1"
              >
                انصراف
              </button>
            </div>
          </div>
        )}

        {/* Products List - Amazon Style */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* List Header */}
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900">
                لیست تمام محصولات ({filteredProducts.length})
              </h2>
              <div className="text-sm text-gray-600">
                صفحه {1} از {1} - کل محصولات: {products.length}
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
                        <span className="text-sm">تصویر محصول</span>
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
                        
                        {product.brand && (
                          <p className="text-gray-600 mb-2">برند: <span className="font-medium">{product.brand}</span></p>
                        )}

                        {product.category && (
                          <div className="mb-3">
                            <p className="text-gray-600">دسته‌بندی: <span className="font-medium">{product.category.name}</span></p>
                            <p className="text-xs text-gray-500 mt-1">شناسه: {product.category._id}</p>
                          </div>
                        )}

                        {/* Price and Stock */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-green-600">
                              {formatPrice(product.priceAfterDiscount)}
                            </span>
                            {product.discount > 0 && (
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
                            {product.rating} ({product.reviews || product.userReviews.length} نظر)
                          </span>
                        </div>

                        {/* Features */}
                        {product.features && product.features.length > 0 && (
                          <div className="mb-3">
                            <span className="text-sm text-gray-700 font-medium mb-2 block">ویژگی‌ها:</span>
                            <div className="flex flex-wrap gap-2">
                              {product.features.map((feature, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                                  {feature}
                                </span>
                              ))}
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
        {filteredProducts.length === 0 && !loading && (
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