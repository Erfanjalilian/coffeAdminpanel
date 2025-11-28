'use client';

import { useState, useEffect } from 'react';

interface DiscountProduct {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
  badge: string;
  rating: number;
  reviews: number;
  isPrime: boolean;
  discount: number;
  dealType: string;
  timeLeft: string;
  soldCount: number;
  totalCount: number;
  type: string;
  description: string;
  positiveFeature: string;
  status: string;
  createdAt: string;
}

export default function TodaysDiscountsAdmin() {
  const [discounts, setDiscounts] = useState<DiscountProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<DiscountProduct | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<DiscountProduct[]>([]);

  useEffect(() => {
    fetchDiscounts();
  }, []);

  useEffect(() => {
    // Filter products based on search term
    if (searchTerm.trim() === '') {
      setFilteredProducts(discounts);
    } else {
      const filtered = discounts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.positiveFeature.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.badge.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, discounts]);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://683dc5b3199a0039e9e6d25e.mockapi.io/Discount');
      
      if (!response.ok) {
        throw new Error('Failed to fetch today\'s discounts');
      }
      
      const data: DiscountProduct[] = await response.json();
      setDiscounts(data);
      setFilteredProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: DiscountProduct) => {
    setEditingProduct(product);
    setShowAddForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این محصول تخفیف‌دار اطمینان دارید؟')) {
      return;
    }

    try {
      // In a real implementation, you would call your DELETE API here
      setDiscounts(discounts.filter(item => item.id !== id));
      alert('محصول با موفقیت حذف شد');
    } catch (err) {
      alert('خطا در حذف محصول');
    }
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;

    try {
      // In a real implementation, you would call your PUT API here
      setDiscounts(discounts.map(item => 
        item.id === editingProduct.id ? editingProduct : item
      ));
      setEditingProduct(null);
      alert('محصول با موفقیت به‌روزرسانی شد');
    } catch (err) {
      alert('خطا در به‌روزرسانی محصول');
    }
  };

  const handleAddProduct = async () => {
    try {
      // Mock new product for demonstration
      const mockNewProduct: DiscountProduct = {
        id: Date.now().toString(),
        name: 'محصول تخفیف‌دار جدید',
        price: 0,
        originalPrice: 0,
        image: '',
        category: 'دسته‌بندی',
        badge: 'جدید',
        rating: 0,
        reviews: 0,
        isPrime: false,
        discount: 0,
        dealType: 'special',
        timeLeft: '00:00:00',
        soldCount: 0,
        totalCount: 0,
        type: 'discount',
        description: 'توضیحات محصول جدید',
        positiveFeature: 'ویژگی مثبت',
        status: 'فعال',
        createdAt: new Date().toISOString()
      };

      setDiscounts([...discounts, mockNewProduct]);
      setShowAddForm(false);
      alert('محصول با موفقیت اضافه شد');
    } catch (err) {
      alert('خطا در اضافه کردن محصول');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const calculateDiscountPercentage = (originalPrice: number, currentPrice: number) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  const getDealTypeColor = (dealType: string) => {
    switch (dealType) {
      case 'lightning':
        return 'bg-red-100 text-red-800';
      case 'special':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getDealTypeText = (dealType: string) => {
    const dealTypeMap: { [key: string]: string } = {
      'lightning': 'فروش فلش',
      'special': 'ویژه',
      'regular': 'عادی'
    };
    return dealTypeMap[dealType] || dealType;
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">مدیریت تخفیف‌های امروز</h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">مدیریت و ویرایش محصولات تخفیف‌دار امروز</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base w-full sm:w-auto"
            >
              افزودن محصول تخفیف‌دار
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                جستجو در محصولات تخفیف‌دار
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="جستجو بر اساس نام محصول، دسته‌بندی، توضیحات یا ویژگی‌ها..."
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
            <h2 className="text-xl font-semibold mb-6">افزودن محصول تخفیف‌دار جدید</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نام محصول</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="نام محصول را وارد کنید"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">قیمت فعلی (تومان)</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="قیمت بعد از تخفیف"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">قیمت اصلی (تومان)</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="قیمت قبل از تخفیف"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">درصد تخفیف</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="درصد تخفیف"
                />
              </div>
            </div>
            <div className="flex gap-3 flex-col sm:flex-row">
              <button
                onClick={handleAddProduct}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex-1"
              >
                ذخیره محصول
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex-1"
              >
                انصراف
              </button>
            </div>
          </div>
        )}

        {/* Edit Product Form */}
        {editingProduct && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">ویرایش محصول تخفیف‌دار</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">قیمت فعلی (تومان)</label>
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
                  value={editingProduct.originalPrice}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    originalPrice: Number(e.target.value)
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">درصد تخفیف</label>
                <input
                  type="number"
                  value={editingProduct.discount}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    discount: Number(e.target.value)
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">دسته‌بندی</label>
                <input
                  type="text"
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    category: e.target.value
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">زمان باقی‌مانده</label>
                <input
                  type="text"
                  value={editingProduct.timeLeft}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    timeLeft: e.target.value
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="مثال: 02:15:30"
                />
              </div>
            </div>
            <div className="flex gap-3 flex-col sm:flex-row">
              <button
                onClick={handleSaveEdit}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex-1"
              >
                ذخیره تغییرات
              </button>
              <button
                onClick={() => setEditingProduct(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex-1"
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
                لیست محصولات تخفیف‌دار امروز ({filteredProducts.length})
              </h2>
              <div className="text-sm text-gray-600">
                کل محصولات: {discounts.length}
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <div key={product.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row gap-6">
                  
                  {/* Image Placeholder - Right Side */}
                  <div className="lg:order-2 flex-shrink-0">
                    <div className="bg-gray-100 w-full lg:w-48 h-48 rounded-lg flex items-center justify-center relative">
                      {/* Discount Badge */}
                      <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                        {product.discount}% تخفیف
                      </div>
                      {/* Product Badge */}
                      {product.badge && (
                        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                          {product.badge}
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
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDealTypeColor(product.dealType)}`}>
                              {getDealTypeText(product.dealType)}
                            </span>
                            {product.isPrime && (
                              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">پرایم</span>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-3">دسته‌بندی: <span className="font-medium">{product.category}</span></p>

                        {/* Price and Discount */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-green-600">
                              {formatPrice(product.price)}
                            </span>
                            <span className="text-lg text-gray-500 line-through">
                              {formatPrice(product.originalPrice)}
                            </span>
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-semibold">
                              {calculateDiscountPercentage(product.originalPrice, product.price)}% ذخیره کنید
                            </span>
                          </div>
                        </div>

                        {/* Time Left and Sales Progress */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-700">زمان باقی‌مانده: </span>
                            <span className="font-semibold text-red-600">{product.timeLeft}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-700">فروخته شده: </span>
                            <span className="font-semibold">{product.soldCount} از {product.totalCount}</span>
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
                            {product.rating} ({product.reviews} نظر)
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>

                        {/* Positive Feature */}
                        <div className="mb-4">
                          <span className="text-sm text-gray-700 font-medium mb-1 block">ویژگی برتر:</span>
                          <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                            {product.positiveFeature}
                          </span>
                        </div>
                      </div>

                      {/* Footer with Status and Actions */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            product.status === 'فعال' || product.status === 'فروش ویژه'
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.status}
                          </span>
                          <span className="text-gray-500 text-sm">
                            ایجاد شده در: {new Date(product.createdAt).toLocaleDateString('fa-IR')}
                          </span>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit(product)}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                          >
                            ویرایش
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
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
                <p className="text-gray-500 mb-6">هیچ محصول تخفیف‌داری با عبارت "{searchTerm}" پیدا نشد.</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                >
                  نمایش تمام محصولات
                </button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-2">محصول تخفیف‌داری وجود ندارد</h3>
                <p className="text-gray-500 mb-6">برای شروع، اولین محصول تخفیف‌دار را اضافه کنید.</p>
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