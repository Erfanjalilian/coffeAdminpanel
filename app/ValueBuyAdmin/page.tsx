'use client';

import { useState, useEffect } from 'react';

interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
  brand?: string;
  priceAfterDiscount: number;
  id: string;
}

interface ValueBuy {
  _id: string;
  product: Product;
  features?: string[];
  filters?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ValueBuyAdmin() {
  const [valueBuys, setValueBuys] = useState<ValueBuy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<ValueBuy | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<ValueBuy[]>([]);

  useEffect(() => {
    fetchValueBuys();
  }, []);

  useEffect(() => {
    // Filter products based on search term
    if (searchTerm.trim() === '') {
      setFilteredProducts(valueBuys);
    } else {
      const filtered = valueBuys.filter(item =>
        item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.product.brand && item.product.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.features && item.features.some(feature => 
          feature.toLowerCase().includes(searchTerm.toLowerCase())
        )) ||
        (item.filters && item.filters.some(filter => 
          filter.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, valueBuys]);

  const fetchValueBuys = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://coffee-shop-backend-k3un.onrender.com/api/v1/valueBuy');
      
      if (!response.ok) {
        throw new Error('Failed to fetch valuable products');
      }
      
      const data = await response.json();
      setValueBuys(data.data.valueBuys);
      setFilteredProducts(data.data.valueBuys);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: ValueBuy) => {
    setEditingProduct(product);
    setShowAddForm(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این محصول اطمینان دارید؟')) {
      return;
    }

    try {
      // In a real implementation, you would call your DELETE API here
      setValueBuys(valueBuys.filter(item => item._id !== id));
      alert('محصول با موفقیت حذف شد');
    } catch (err) {
      alert('خطا در حذف محصول');
    }
  };

  const handleSaveEdit = async () => {
    if (!editingProduct) return;

    try {
      // In a real implementation, you would call your PUT API here
      setValueBuys(valueBuys.map(item => 
        item._id === editingProduct._id ? editingProduct : item
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
      const mockNewProduct: ValueBuy = {
        _id: Date.now().toString(),
        product: {
          _id: Date.now().toString(),
          name: 'محصول جدید',
          slug: 'new-product',
          category: 'category-id',
          price: 0,
          stock: 0,
          priceAfterDiscount: 0,
          id: Date.now().toString(),
        },
        isActive: true,
        features: [],
        filters: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setValueBuys([...valueBuys, mockNewProduct]);
      setShowAddForm(false);
      alert('محصول با موفقیت اضافه شد');
    } catch (err) {
      alert('خطا در اضافه کردن محصول');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">مدیریت محصولات ارزشمند</h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">مدیریت و ویرایش محصولات ارزشمند فروشگاه</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base w-full sm:w-auto"
            >
              افزودن محصول ارزشمند
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                جستجو در محصولات ارزشمند
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="جستجو بر اساس نام محصول، برند، ویژگی‌ها یا فیلترها..."
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
            <h2 className="text-xl font-semibold mb-6">افزودن محصول ارزشمند جدید</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">قیمت (تومان)</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="قیمت محصول"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">موجودی</label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="تعداد موجودی"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">برند</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="نام برند"
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
            <h2 className="text-xl font-semibold mb-6">ویرایش محصول</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نام محصول</label>
                <input
                  type="text"
                  value={editingProduct.product.name}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    product: { ...editingProduct.product, name: e.target.value }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">قیمت (تومان)</label>
                <input
                  type="number"
                  value={editingProduct.product.price}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    product: { ...editingProduct.product, price: Number(e.target.value) }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">موجودی</label>
                <input
                  type="number"
                  value={editingProduct.product.stock}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    product: { ...editingProduct.product, stock: Number(e.target.value) }
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center justify-start">
                <input
                  type="checkbox"
                  checked={editingProduct.isActive}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    isActive: e.target.checked
                  })}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ml-2"
                />
                <label className="text-sm font-medium text-gray-700">فعال</label>
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
                لیست محصولات ارزشمند ({filteredProducts.length})
              </h2>
              <div className="text-sm text-gray-600">
                صفحه {1} از {1} - کل محصولات: {valueBuys.length}
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="divide-y divide-gray-200">
            {filteredProducts.map((item) => (
              <div key={item._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row gap-6">
                  
                  {/* Image Placeholder - Right Side */}
                  <div className="lg:order-2 flex-shrink-0">
                    <div className="bg-gray-100 w-full lg:w-48 h-48 rounded-lg flex items-center justify-center">
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
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.product.name}</h3>
                        
                        {item.product.brand && (
                          <p className="text-gray-600 mb-3">برند: <span className="font-medium">{item.product.brand}</span></p>
                        )}

                        {/* Price and Stock */}
                        <div className="flex items-center gap-6 mb-4">
                          <span className="text-2xl font-bold text-green-600">{formatPrice(item.product.price)}</span>
                          <span className="text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded-full">
                            موجودی: {item.product.stock}
                          </span>
                        </div>

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
                        
                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit(item)}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                          >
                            ویرایش
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
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
                <p className="text-gray-500 mb-6">هیچ محصول ارزشمندی با عبارت "{searchTerm}" پیدا نشد.</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                >
                  نمایش تمام محصولات
                </button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-2">محصول ارزشمندی وجود ندارد</h3>
                <p className="text-gray-500 mb-6">برای شروع، اولین محصول ارزشمند را اضافه کنید.</p>
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