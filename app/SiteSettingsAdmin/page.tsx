'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contaxt/AuthContext'; // Adjust path if needed

interface Category {
  seo: {
    metaTitle?: string;
    metaDescription?: string;
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
  const { isAuthenticated, login, logout, isLoading } = useAuth();
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // New category form state
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#8B4513',
    parent: '',
    order: 0,
    isActive: true,
    showOnHomepage: false,
    seo: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: [] as string[],
    },
    images: '/images/categories/default.jpg'
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
    }
  }, [isAuthenticated]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://coffee-shop-backend-k3un.onrender.com/api/v1/category');
      
      if (!response.ok) {
        throw new Error(`خطا در دریافت دسته‌بندی‌ها: ${response.status}`);
      }
      
      const data: CategoriesResponse = await response.json();
      if (data.success && data.data) {
        setCategories(data.data.categories);
      } else {
        throw new Error('پاسخ نامعتبر از سرور');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    
    setTimeout(() => {
      const success = login(password);
      if (!success) {
        setLoginError('رمز عبور اشتباه است');
      }
      setIsLoggingIn(false);
    }, 500); // Simulate network delay
  };

  const handleLogout = () => {
    if (confirm('آیا از خروج اطمینان دارید؟')) {
      logout();
      setPassword('');
    }
  };

  // Loading state for auth check
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div dir="rtl" className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              A
            </div>
            <h1 className="text-2xl font-bold text-gray-900">ورود به پنل مدیریت</h1>
            <p className="text-gray-600 mt-2">لطفاً برای دسترسی به پنل مدیریت رمز عبور را وارد کنید</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8">
            <form onSubmit={handleLogin}>
              <div className="mb-6">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  نام کاربری
                </label>
                <input
                  id="username"
                  type="text"
                  value="admin"
                  readOnly
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">نام کاربری ثابت است</p>
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  رمز عبور *
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (loginError) setLoginError('');
                  }}
                  className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    loginError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="رمز عبور را وارد کنید"
                  required
                  autoFocus
                />
                {loginError && (
                  <p className="text-red-500 text-xs mt-1">{loginError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className={`w-full py-3 rounded-lg font-semibold text-sm sm:text-base flex items-center justify-center gap-2 ${
                  isLoggingIn 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white transition-colors`}
              >
                {isLoggingIn ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    در حال بررسی...
                  </>
                ) : 'ورود به پنل مدیریت'}
              </button>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-center text-xs text-gray-500">
                  رمز عبور پیشفرض: 1383
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Original admin panel content (only shown when authenticated)
  const validateForm = (formData: any, isEdit: boolean = false) => {
    const errors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'نام الزامی است';
    } else if (formData.name.length > 100) {
      errors.name = 'نام نباید از 100 کاراکتر بیشتر باشد';
    }

    // Slug validation
    if (!formData.slug.trim()) {
      errors.slug = 'Slug الزامی است';
    } else if (!/^[a-z0-9\u0600-\u06FF-]+$/.test(formData.slug)) {
      errors.slug = 'Slug باید فقط شامل حروف کوچک، اعداد و خط فاصله باشد';
    }

    // Description validation
    if (formData.description.length > 500) {
      errors.description = 'توضیحات نمی‌تواند بیش از 500 کاراکتر باشد';
    }

    // Color validation
    if (formData.color && !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(formData.color)) {
      errors.color = 'فرمت رنگ نامعتبر است';
    }

    // Order validation
    if (formData.order < 0) {
      errors.order = 'ترتیب باید عدد مثبت باشد';
    }

    // SEO validation
    if (formData.seo?.metaTitle && formData.seo.metaTitle.length > 70) {
      errors.metaTitle = 'عنوان متا نمی‌تواند بیش از 70 کاراکتر باشد';
    }

    if (formData.seo?.metaDescription && formData.seo.metaDescription.length > 160) {
      errors.metaDescription = 'توضیحات متا نمی‌تواند بیش از 160 کاراکتر باشد';
    }

    return errors;
  };

  const handleAddCategory = async () => {
    const errors = validateForm(newCategory);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    try {
      setActionLoading(true);
      
      // Prepare data for backend
      const categoryData: any = {
        name: newCategory.name,
        slug: newCategory.slug,
        description: newCategory.description,
        color: newCategory.color,
        order: newCategory.order,
        isActive: newCategory.isActive,
        showOnHomepage: newCategory.showOnHomepage,
        images: newCategory.images // Send the default image path
      };
      
      // Add parent if selected
      if (newCategory.parent) {
        categoryData.parent = newCategory.parent;
      }
      
      // Add SEO data if provided
      if (newCategory.seo.metaTitle || newCategory.seo.metaDescription || newCategory.seo.metaKeywords.length > 0) {
        categoryData.seo = {
          metaTitle: newCategory.seo.metaTitle || '',
          metaDescription: newCategory.seo.metaDescription || '',
          metaKeywords: newCategory.seo.metaKeywords || []
        };
      }
      
      console.log('Sending category data:', categoryData);
      
      const response = await fetch('https://coffee-shop-backend-k3un.onrender.com/api/v1/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });
      
      const data = await response.json();
      
      console.log('Create response:', data);
      
      if (data.success) {
        alert('دسته‌بندی با موفقیت اضافه شد');
        setShowAddCategory(false);
        resetNewCategoryForm();
        fetchCategories();
      } else {
        throw new Error(data.error?.message || `خطای ${response.status} در ایجاد دسته‌بندی`);
      }
    } catch (err) {
      console.error('Create error:', err);
      alert(err instanceof Error ? err.message : 'خطا در اضافه کردن دسته‌بندی');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditCategory = async () => {
    if (!editingCategory) return;
    
    const errors = validateForm(editingCategory, true);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    try {
      setActionLoading(true);
      
      // Prepare data for backend - include only changed fields
      const categoryData: any = {
        name: editingCategory.name,
        slug: editingCategory.slug,
        description: editingCategory.description,
        color: editingCategory.color,
        order: editingCategory.order,
        isActive: editingCategory.isActive,
        showOnHomepage: editingCategory.showOnHomepage,
      };
      
      // Always send parent (can be null)
      categoryData.parent = editingCategory.parent || null;
      
      // Always send images (use existing or default)
      categoryData.images = editingCategory.images || '/images/categories/default.jpg';
      
      // Add SEO data if it exists
      if (editingCategory.seo) {
        categoryData.seo = {
          metaTitle: editingCategory.seo.metaTitle || '',
          metaDescription: editingCategory.seo.metaDescription || '',
          metaKeywords: editingCategory.seo.metaKeywords || []
        };
      }
      
      console.log('Updating category:', {
        id: editingCategory._id,
        data: categoryData
      });
      
      const response = await fetch(`https://coffee-shop-backend-k3un.onrender.com/api/v1/category/${editingCategory._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });
      
      const data = await response.json();
      
      console.log('Update response:', data);
      
      if (data.success) {
        alert('دسته‌بندی با موفقیت به‌روزرسانی شد');
        setEditingCategory(null);
        fetchCategories();
      } else {
        const errorMsg = data.error?.message || `خطای ${response.status}`;
        throw new Error(errorMsg);
      }
    } catch (err) {
      console.error('Edit error:', err);
      alert(err instanceof Error ? err.message : 'خطا در به‌روزرسانی دسته‌بندی');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('آیا از حذف این دسته‌بندی اطمینان دارید؟\nتوجه: دسته‌بندی‌هایی که زیرمجموعه دارند قابل حذف نیستند.')) {
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(`https://coffee-shop-backend-k3un.onrender.com/api/v1/category/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('دسته‌بندی با موفقیت حذف شد');
        fetchCategories();
      } else {
        throw new Error(data.error?.message || 'خطا در حذف دسته‌بندی');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'خطا در حذف دسته‌بندی');
    } finally {
      setActionLoading(false);
    }
  };

  const resetNewCategoryForm = () => {
    setNewCategory({
      name: '',
      slug: '',
      description: '',
      color: '#8B4513',
      parent: '',
      order: 0,
      isActive: true,
      showOnHomepage: false,
      seo: {
        metaTitle: '',
        metaDescription: '',
        metaKeywords: [],
      },
      images: '/images/categories/default.jpg'
    });
    setFormErrors({});
  };

  const handleEditCategoryClick = (category: Category) => {
    setEditingCategory({ ...category });
    setFormErrors({});
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
          <button 
            onClick={fetchCategories}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors block mx-auto"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Header with Logout Button */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">مدیریت دسته‌بندی‌ها</h1>
              <p className="text-gray-600 mt-2 text-xs sm:text-sm lg:text-base">مدیریت و سازماندهی دسته‌بندی‌های محصولات</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>وضعیت: وارد شده</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
              >
                خروج از پنل
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">لیست دسته‌بندی‌ها</h2>
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
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نام دسته‌بندی *
                  </label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => {
                      setNewCategory({ ...newCategory, name: e.target.value });
                      if (formErrors.name) setFormErrors({...formErrors, name: ''});
                    }}
                    className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="نام دسته‌بندی"
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={newCategory.slug}
                    onChange={(e) => {
                      setNewCategory({ ...newCategory, slug: e.target.value.toLowerCase() });
                      if (formErrors.slug) setFormErrors({...formErrors, slug: ''});
                    }}
                    className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.slug ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="slug-unique"
                  />
                  {formErrors.slug && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.slug}</p>
                  )}
                </div>

                {/* Parent Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    دسته‌بندی والد
                  </label>
                  <select
                    value={newCategory.parent}
                    onChange={(e) => setNewCategory({ ...newCategory, parent: e.target.value })}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">بدون والد (دسته اصلی)</option>
                    {categories
                      .filter(cat => !cat.parent)
                      .map(cat => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رنگ
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={newCategory.color}
                      onChange={(e) => {
                        setNewCategory({ ...newCategory, color: e.target.value });
                        if (formErrors.color) setFormErrors({...formErrors, color: ''});
                      }}
                      className="w-12 h-10 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      value={newCategory.color}
                      onChange={(e) => {
                        setNewCategory({ ...newCategory, color: e.target.value });
                        if (formErrors.color) setFormErrors({...formErrors, color: ''});
                      }}
                      className={`flex-1 px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.color ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="#8B4513"
                    />
                  </div>
                  {formErrors.color && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.color}</p>
                  )}
                </div>

                {/* Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ترتیب نمایش
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newCategory.order}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      setNewCategory({ ...newCategory, order: value });
                      if (formErrors.order) setFormErrors({...formErrors, order: ''});
                    }}
                    className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.order ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.order && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.order}</p>
                  )}
                </div>

                {/* Image URL (Read-only for now) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تصویر دسته‌بندی
                  </label>
                  <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                    <p className="text-sm text-gray-600">
                      تصویر پیش‌فرض: <span className="text-gray-900">{newCategory.images}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      (بارگذاری تصویر در نسخه‌های بعدی اضافه خواهد شد)
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    توضیحات
                  </label>
                  <textarea
                    value={newCategory.description}
                    onChange={(e) => {
                      setNewCategory({ ...newCategory, description: e.target.value });
                      if (formErrors.description) setFormErrors({...formErrors, description: ''});
                    }}
                    rows={3}
                    className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="توضیحات دسته‌بندی"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>اختیاری</span>
                    <span>{newCategory.description.length}/500</span>
                  </div>
                  {formErrors.description && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>
                  )}
                </div>

                {/* SEO Fields */}
                <div className="sm:col-span-2 border-t pt-4 mt-2">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">تنظیمات SEO</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        عنوان متا
                      </label>
                      <input
                        type="text"
                        value={newCategory.seo.metaTitle}
                        onChange={(e) => {
                          setNewCategory({
                            ...newCategory,
                            seo: { ...newCategory.seo, metaTitle: e.target.value }
                          });
                          if (formErrors.metaTitle) setFormErrors({...formErrors, metaTitle: ''});
                        }}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                          formErrors.metaTitle ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="عنوان برای موتورهای جستجو"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>اختیاری</span>
                        <span>{newCategory.seo.metaTitle.length}/70</span>
                      </div>
                      {formErrors.metaTitle && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.metaTitle}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        توضیحات متا
                      </label>
                      <textarea
                        value={newCategory.seo.metaDescription}
                        onChange={(e) => {
                          setNewCategory({
                            ...newCategory,
                            seo: { ...newCategory.seo, metaDescription: e.target.value }
                          });
                          if (formErrors.metaDescription) setFormErrors({...formErrors, metaDescription: ''});
                        }}
                        rows={2}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                          formErrors.metaDescription ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="توضیحات برای موتورهای جستجو"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>اختیاری</span>
                        <span>{newCategory.seo.metaDescription.length}/160</span>
                      </div>
                      {formErrors.metaDescription && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.metaDescription}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 sm:gap-6 pt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newCategory.isActive}
                      onChange={(e) => setNewCategory({ ...newCategory, isActive: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">فعال</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newCategory.showOnHomepage}
                      onChange={(e) => setNewCategory({ ...newCategory, showOnHomepage: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">نمایش در صفحه اصلی</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddCategory}
                  disabled={actionLoading}
                  className={`flex-1 py-2.5 rounded-lg font-semibold text-sm sm:text-base flex items-center justify-center gap-2 ${
                    actionLoading 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white`}
                >
                  {actionLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      در حال ذخیره...
                    </>
                  ) : 'ذخیره دسته‌بندی'}
                </button>
                <button
                  onClick={() => {
                    setShowAddCategory(false);
                    resetNewCategoryForm();
                  }}
                  disabled={actionLoading}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 sm:px-6 py-2.5 rounded-lg font-semibold transition-colors text-sm sm:text-base"
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
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نام دسته‌بندی *
                  </label>
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) => {
                      setEditingCategory({ ...editingCategory, name: e.target.value });
                      if (formErrors.name) setFormErrors({...formErrors, name: ''});
                    }}
                    className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={editingCategory.slug}
                    onChange={(e) => {
                      setEditingCategory({ ...editingCategory, slug: e.target.value.toLowerCase() });
                      if (formErrors.slug) setFormErrors({...formErrors, slug: ''});
                    }}
                    className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.slug ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.slug && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.slug}</p>
                  )}
                </div>

                {/* Parent Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    دسته‌بندی والد
                  </label>
                  <select
                    value={editingCategory.parent || ''}
                    onChange={(e) => setEditingCategory({ 
                      ...editingCategory, 
                      parent: e.target.value || null 
                    })}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">بدون والد (دسته اصلی)</option>
                    {categories
                      .filter(cat => cat._id !== editingCategory._id && !cat.parent)
                      .map(cat => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    رنگ
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={editingCategory.color}
                      onChange={(e) => {
                        setEditingCategory({ ...editingCategory, color: e.target.value });
                        if (formErrors.color) setFormErrors({...formErrors, color: ''});
                      }}
                      className="w-12 h-10 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      value={editingCategory.color}
                      onChange={(e) => {
                        setEditingCategory({ ...editingCategory, color: e.target.value });
                        if (formErrors.color) setFormErrors({...formErrors, color: ''});
                      }}
                      className={`flex-1 px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.color ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {formErrors.color && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.color}</p>
                  )}
                </div>

                {/* Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ترتیب نمایش
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingCategory.order}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      setEditingCategory({ ...editingCategory, order: value });
                      if (formErrors.order) setFormErrors({...formErrors, order: ''});
                    }}
                    className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.order ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.order && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.order}</p>
                  )}
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    مسیر تصویر
                  </label>
                  <input
                    type="text"
                    value={editingCategory.images}
                    onChange={(e) => setEditingCategory({ ...editingCategory, images: e.target.value })}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="/images/categories/default.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    مسیر تصویر ذخیره شده در پایگاه داده
                  </p>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    توضیحات
                  </label>
                  <textarea
                    value={editingCategory.description}
                    onChange={(e) => {
                      setEditingCategory({ ...editingCategory, description: e.target.value });
                      if (formErrors.description) setFormErrors({...formErrors, description: ''});
                    }}
                    rows={3}
                    className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>اختیاری</span>
                    <span>{editingCategory.description.length}/500</span>
                  </div>
                  {formErrors.description && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>
                  )}
                </div>

                {/* SEO Fields */}
                <div className="sm:col-span-2 border-t pt-4 mt-2">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">تنظیمات SEO</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        عنوان متا
                      </label>
                      <input
                        type="text"
                        value={editingCategory.seo?.metaTitle || ''}
                        onChange={(e) => {
                          setEditingCategory({
                            ...editingCategory,
                            seo: { 
                              ...editingCategory.seo, 
                              metaTitle: e.target.value 
                            }
                          });
                          if (formErrors.metaTitle) setFormErrors({...formErrors, metaTitle: ''});
                        }}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                          formErrors.metaTitle ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>اختیاری</span>
                        <span>{(editingCategory.seo?.metaTitle || '').length}/70</span>
                      </div>
                      {formErrors.metaTitle && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.metaTitle}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        توضیحات متا
                      </label>
                      <textarea
                        value={editingCategory.seo?.metaDescription || ''}
                        onChange={(e) => {
                          setEditingCategory({
                            ...editingCategory,
                            seo: { 
                              ...editingCategory.seo, 
                              metaDescription: e.target.value 
                            }
                          });
                          if (formErrors.metaDescription) setFormErrors({...formErrors, metaDescription: ''});
                        }}
                        rows={2}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                          formErrors.metaDescription ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>اختیاری</span>
                        <span>{(editingCategory.seo?.metaDescription || '').length}/160</span>
                      </div>
                      {formErrors.metaDescription && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.metaDescription}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 sm:gap-6 pt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingCategory.isActive}
                      onChange={(e) => setEditingCategory({ ...editingCategory, isActive: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">فعال</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingCategory.showOnHomepage}
                      onChange={(e) => setEditingCategory({ ...editingCategory, showOnHomepage: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">نمایش در صفحه اصلی</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleEditCategory}
                  disabled={actionLoading}
                  className={`flex-1 py-2.5 rounded-lg font-semibold text-sm sm:text-base flex items-center justify-center gap-2 ${
                    actionLoading 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white`}
                >
                  {actionLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      در حال به‌روزرسانی...
                    </>
                  ) : 'به‌روزرسانی دسته‌بندی'}
                </button>
                <button
                  onClick={() => {
                    setEditingCategory(null);
                    setFormErrors({});
                  }}
                  disabled={actionLoading}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 sm:px-6 py-2.5 rounded-lg font-semibold transition-colors text-sm sm:text-base"
                >
                  انصراف
                </button>
              </div>
            </div>
          )}

          {/* Categories List */}
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
                            <div className="text-sm text-gray-500 truncate max-w-xs">{category.description}</div>
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
                          onClick={() => handleEditCategoryClick(category)}
                          disabled={actionLoading}
                          className="text-blue-600 hover:text-blue-900 ml-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          ویرایش
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category._id)}
                          disabled={actionLoading}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        onClick={() => handleEditCategoryClick(category)}
                        disabled={actionLoading}
                        className="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ویرایش
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
                        disabled={actionLoading}
                        className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <p className="text-gray-900 text-xs line-clamp-2">{category.description}</p>
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
    </div>
  );
}