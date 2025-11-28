'use client';

import { useState, useEffect } from 'react';

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

export default function SiteSettingsAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'categories' | 'general' | 'contact' | 'footer'>('categories');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Static site settings state
  const [siteSettings, setSiteSettings] = useState({
    logo: '',
    siteName: 'کافی‌شاپ ما',
    adminEmail: 'admin@coffeeshop.com',
    supportEmail: 'support@coffeeshop.com',
    phone: '021-12345678',
    address: 'تهران، خیابان ولیعصر، پلاک 123',
    footerText: 'کافی‌شاپ ما - ارائه بهترین قهوه‌های ایتالیایی',
    socialLinks: {
      instagram: '',
      telegram: '',
      whatsapp: ''
    }
  });

  // New category form state
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#8B4513',
    order: 0,
    isActive: true,
    showOnHomepage: false
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://coffee-shop-backend-k3un.onrender.com/api/v1/category');
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const data: CategoriesResponse = await response.json();
      setCategories(data.data.categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    try {
      // In a real implementation, you would call your POST API here
      const mockNewCategory: Category = {
        seo: { metaKeywords: [] },
        _id: Date.now().toString(),
        id: Date.now().toString(),
        name: newCategory.name,
        slug: newCategory.slug,
        description: newCategory.description,
        images: '/images/categories/default.jpg',
        color: newCategory.color,
        parent: null,
        order: newCategory.order,
        isActive: newCategory.isActive,
        showOnHomepage: newCategory.showOnHomepage,
        productsCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setCategories([...categories, mockNewCategory]);
      setShowAddCategory(false);
      setNewCategory({
        name: '',
        slug: '',
        description: '',
        color: '#8B4513',
        order: 0,
        isActive: true,
        showOnHomepage: false
      });
      alert('دسته‌بندی با موفقیت اضافه شد');
    } catch (err) {
      alert('خطا در اضافه کردن دسته‌بندی');
    }
  };

  const handleEditCategory = async () => {
    if (!editingCategory) return;

    try {
      // In a real implementation, you would call your PUT API here
      setCategories(categories.map(cat => 
        cat._id === editingCategory._id ? editingCategory : cat
      ));
      setEditingCategory(null);
      alert('دسته‌بندی با موفقیت به‌روزرسانی شد');
    } catch (err) {
      alert('خطا در به‌روزرسانی دسته‌بندی');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('آیا از حذف این دسته‌بندی اطمینان دارید؟')) {
      return;
    }

    try {
      // In a real implementation, you would call your DELETE API here
      setCategories(categories.filter(cat => cat._id !== id));
      alert('دسته‌بندی با موفقیت حذف شد');
    } catch (err) {
      alert('خطا در حذف دسته‌بندی');
    }
  };

  const handleSiteSettingsUpdate = () => {
    // In a real implementation, you would save these settings to your backend
    alert('تنظیمات سایت با موفقیت ذخیره شد');
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
    <div dir="rtl" className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">تنظیمات سایت</h1>
              <p className="text-gray-600 mt-2 text-xs sm:text-sm lg:text-base">مدیریت دسته‌بندی‌ها و تنظیمات کلی سایت</p>
            </div>
          </div>
        </div>

        {/* Tabs - Mobile Scrollable */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-4 space-x-reverse overflow-x-auto pb-2 -mx-2 px-2">
              {[
                { id: 'categories', label: 'دسته‌بندی‌ها' },
                { id: 'general', label: 'عمومی' },
                { id: 'contact', label: 'تماس' },
                { id: 'footer', label: 'فوتر' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-3 whitespace-nowrap border-b-2 font-medium text-xs sm:text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Add Category Button */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">مدیریت دسته‌بندی‌ها</h2>
                <button
                  onClick={() => setShowAddCategory(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base w-full sm:w-auto"
                >
                  افزودن دسته‌بندی جدید
                </button>
              </div>

              {/* Add Category Form */}
              {showAddCategory && (
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6 border border-gray-200">
                  <h3 className="text-base sm:text-lg font-semibold mb-4">افزودن دسته‌بندی جدید</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">نام دسته‌بندی</label>
                      <input
                        type="text"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="نام دسته‌بندی"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                      <input
                        type="text"
                        value={newCategory.slug}
                        onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="slug"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">رنگ</label>
                      <input
                        type="color"
                        value={newCategory.color}
                        onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ترتیب نمایش</label>
                      <input
                        type="number"
                        value={newCategory.order}
                        onChange={(e) => setNewCategory({ ...newCategory, order: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
                      <textarea
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="توضیحات دسته‌بندی"
                      />
                    </div>
                    <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newCategory.isActive}
                          onChange={(e) => setNewCategory({ ...newCategory, isActive: e.target.checked })}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ml-2"
                        />
                        <span className="text-sm text-gray-700">فعال</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newCategory.showOnHomepage}
                          onChange={(e) => setNewCategory({ ...newCategory, showOnHomepage: e.target.checked })}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ml-2"
                        />
                        <span className="text-sm text-gray-700">نمایش در صفحه اصلی</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleAddCategory}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base flex-1"
                    >
                      ذخیره دسته‌بندی
                    </button>
                    <button
                      onClick={() => setShowAddCategory(false)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base flex-1"
                    >
                      انصراف
                    </button>
                  </div>
                </div>
              )}

              {/* Edit Category Form */}
              {editingCategory && (
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6 border border-gray-200">
                  <h3 className="text-base sm:text-lg font-semibold mb-4">ویرایش دسته‌بندی</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">نام دسته‌بندی</label>
                      <input
                        type="text"
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                      <input
                        type="text"
                        value={editingCategory.slug}
                        onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">رنگ</label>
                      <input
                        type="color"
                        value={editingCategory.color}
                        onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ترتیب نمایش</label>
                      <input
                        type="number"
                        value={editingCategory.order}
                        onChange={(e) => setEditingCategory({ ...editingCategory, order: Number(e.target.value) })}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات</label>
                      <textarea
                        value={editingCategory.description}
                        onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editingCategory.isActive}
                          onChange={(e) => setEditingCategory({ ...editingCategory, isActive: e.target.checked })}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ml-2"
                        />
                        <span className="text-sm text-gray-700">فعال</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editingCategory.showOnHomepage}
                          onChange={(e) => setEditingCategory({ ...editingCategory, showOnHomepage: e.target.checked })}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ml-2"
                        />
                        <span className="text-sm text-gray-700">نمایش در صفحه اصلی</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleEditCategory}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base flex-1"
                    >
                      به‌روزرسانی دسته‌بندی
                    </button>
                    <button
                      onClick={() => setEditingCategory(null)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base flex-1"
                    >
                      انصراف
                    </button>
                  </div>
                </div>
              )}

              {/* Categories List - Mobile Cards / Desktop Table */}
              <div className="overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden lg:block">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          نام دسته‌بندی
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Slug
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          رنگ
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          وضعیت
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          تعداد محصولات
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          عملیات
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {categories.map((category) => (
                        <tr key={category._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div 
                                className="w-4 h-4 rounded-full ml-3 border border-gray-300"
                                style={{ backgroundColor: category.color }}
                              ></div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                <div className="text-sm text-gray-500">{category.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {category.slug}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div 
                                className="w-6 h-6 rounded border border-gray-300"
                                style={{ backgroundColor: category.color }}
                              ></div>
                              <span className="text-sm text-gray-600 mr-2">{category.color}</span>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                category.isActive 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {category.isActive ? 'فعال' : 'غیرفعال'}
                              </span>
                              {category.showOnHomepage && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  صفحه اصلی
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {category.productsCount}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => setEditingCategory(category)}
                              className="text-blue-600 hover:text-blue-900 ml-4"
                            >
                              ویرایش
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              حذف
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4">
                  {categories.map((category) => (
                    <div key={category._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded-full ml-2 border border-gray-300"
                            style={{ backgroundColor: category.color }}
                          ></div>
                          <h3 className="font-medium text-gray-900">{category.name}</h3>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingCategory(category)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            ویرایش
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category._id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Slug:</span>
                          <span className="text-gray-900">{category.slug}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>رنگ:</span>
                          <div className="flex items-center">
                            <div 
                              className="w-4 h-4 rounded border border-gray-300 ml-2"
                              style={{ backgroundColor: category.color }}
                            ></div>
                            <span>{category.color}</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span>وضعیت:</span>
                          <div className="flex gap-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                              category.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {category.isActive ? 'فعال' : 'غیرفعال'}
                            </span>
                            {category.showOnHomepage && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                                صفحه اصلی
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span>تعداد محصولات:</span>
                          <span className="text-gray-900">{category.productsCount}</span>
                        </div>
                        {category.description && (
                          <div>
                            <span className="block mb-1">توضیحات:</span>
                            <p className="text-gray-900 text-xs">{category.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Empty State */}
              {categories.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                  <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">دسته‌بندی‌ای وجود ندارد</h3>
                  <p className="text-gray-500 mb-6 text-sm sm:text-base">برای شروع، اولین دسته‌بندی را اضافه کنید.</p>
                  <button
                    onClick={() => setShowAddCategory(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base inline-flex items-center gap-2"
                  >
                    افزودن دسته‌بندی اول
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* General Settings Tab */}
        {activeTab === 'general' && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-6">تنظیمات عمومی سایت</h2>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">لوگو سایت</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center">
                  <svg className="w-8 h-8 sm:w-12 sm:h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs sm:text-sm text-gray-500">برای آپلود لوگو کلیک کنید</p>
                  <input type="file" className="hidden" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نام سایت</label>
                <input
                  type="text"
                  value={siteSettings.siteName}
                  onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              onClick={handleSiteSettingsUpdate}
              className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base w-full sm:w-auto"
            >
              ذخیره تنظیمات
            </button>
          </div>
        )}

        {/* Contact Settings Tab */}
        {activeTab === 'contact' && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-6">اطلاعات تماس</h2>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل مدیریت</label>
                <input
                  type="email"
                  value={siteSettings.adminEmail}
                  onChange={(e) => setSiteSettings({ ...siteSettings, adminEmail: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل پشتیبانی</label>
                <input
                  type="email"
                  value={siteSettings.supportEmail}
                  onChange={(e) => setSiteSettings({ ...siteSettings, supportEmail: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">تلفن تماس</label>
                <input
                  type="text"
                  value={siteSettings.phone}
                  onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">آدرس</label>
                <textarea
                  value={siteSettings.address}
                  onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              onClick={handleSiteSettingsUpdate}
              className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base w-full sm:w-auto"
            >
              ذخیره اطلاعات تماس
            </button>
          </div>
        )}

        {/* Footer Settings Tab */}
        {activeTab === 'footer' && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-6">تنظیمات فوتر</h2>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">متن فوتر</label>
                <textarea
                  value={siteSettings.footerText}
                  onChange={(e) => setSiteSettings({ ...siteSettings, footerText: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اینستاگرام</label>
                <input
                  type="url"
                  value={siteSettings.socialLinks.instagram}
                  onChange={(e) => setSiteSettings({ 
                    ...siteSettings, 
                    socialLinks: { ...siteSettings.socialLinks, instagram: e.target.value }
                  })}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://instagram.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">تلگرام</label>
                <input
                  type="url"
                  value={siteSettings.socialLinks.telegram}
                  onChange={(e) => setSiteSettings({ 
                    ...siteSettings, 
                    socialLinks: { ...siteSettings.socialLinks, telegram: e.target.value }
                  })}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://t.me/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">واتساپ</label>
                <input
                  type="text"
                  value={siteSettings.socialLinks.whatsapp}
                  onChange={(e) => setSiteSettings({ 
                    ...siteSettings, 
                    socialLinks: { ...siteSettings.socialLinks, whatsapp: e.target.value }
                  })}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="شماره واتساپ"
                />
              </div>
            </div>
            <button
              onClick={handleSiteSettingsUpdate}
              className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base w-full sm:w-auto"
            >
              ذخیره تنظیمات فوتر
            </button>
          </div>
        )}
      </div>
    </div>
  );
}