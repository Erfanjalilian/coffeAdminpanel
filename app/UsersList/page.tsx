// app/pages/users/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface Address {
  name: string;
  postalCode: string;
  province: string;
  city: string;
  street: string;
  _id: string;
}

interface User {
  _id: string;
  phone: string;
  username: string;
  roles: string[];
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Pagination {
  page: number;
  limit: number;
  totalPage: number;
  totalUsers: number;
}

interface ApiResponse {
  status: number;
  success: boolean;
  data: {
    users: User[];
    pagination: Pagination;
  };
}

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search term
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.phone.includes(searchTerm) ||
        (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.addresses && user.addresses.some(address => 
          address.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          address.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
          address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          address.postalCode.includes(searchTerm)
        )) ||
        user.roles.some(role => role.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://coffee-shop-backend-k3un.onrender.com/api/v1/user');
      
      if (!response.ok) {
        throw new Error('خطا در دریافت اطلاعات کاربران');
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.success && data.data.users) {
        setUsers(data.data.users);
        setFilteredUsers(data.data.users);
      } else {
        throw new Error('خطا در فرمت داده‌ها');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (!confirm(`آیا از حذف کاربر "${username}" مطمئن هستید؟`)) {
      return;
    }

    try {
      setDeleteLoading(userId);
      const response = await fetch(`https://coffee-shop-backend-k3un.onrender.com/api/v1/user/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('خطا در حذف کاربر');
      }

      // Remove user from local state
      setUsers(users.filter(user => user._id !== userId));
      
      alert('کاربر با موفقیت حذف شد');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'خطا در حذف کاربر');
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  const getPostalCode = (addresses: Address[]) => {
    if (!addresses || addresses.length === 0) {
      return 'آدرسی ثبت نشده';
    }
    return addresses[0].postalCode || 'کد پستی ثبت نشده';
  };

  const getRoleText = (roles: string[]) => {
    return roles.includes('ADMIN') ? 'ادمین' : 'کاربر';
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
          <div className="text-red-700 mb-3">{error}</div>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
        
        {/* Header */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">لیست کاربران</h1>
              <p className="text-gray-600 mt-2 text-xs sm:text-sm lg:text-base">مدیریت و مشاهده اطلاعات کاربران سیستم</p>
            </div>
            <div className="text-sm text-gray-600 bg-gray-100 px-3 sm:px-4 py-2 rounded-lg">
              تعداد کاربران: {filteredUsers.length}
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                جستجو در کاربران
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="جستجو بر اساس شماره تلفن، نام کاربری، آدرس یا نقش..."
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
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 sm:px-6 py-3 rounded-lg font-semibold transition-colors text-sm"
              >
                پاک کردن
              </button>
            </div>
          </div>
          {searchTerm && (
            <div className="mt-4 text-sm text-gray-600">
              <span>نتایج جستجو برای </span>
              <span className="font-semibold">"{searchTerm}"</span>
              <span> : {filteredUsers.length} کاربر یافت شد</span>
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-center min-w-[120px]">
                    نام کاربری
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-center min-w-[130px]">
                    شماره تلفن
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-center min-w-[100px]">
                    نقش
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-center min-w-[120px]">
                    کد پستی
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-center min-w-[140px]">
                    حساب‌های بانکی
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-center min-w-[120px]">
                    تاریخ ایجاد
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-center min-w-[150px]">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 text-sm text-gray-900 text-center align-middle min-w-[120px]">
                      <div className="flex justify-center items-center">
                        {user.username || 'نام کاربری ثبت نشده'}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 text-center align-middle min-w-[130px]">
                      <div className="flex justify-center items-center">
                        {user.phone}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-center align-middle min-w-[100px]">
                      <div className="flex justify-center items-center">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          user.roles.includes('ADMIN') 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {getRoleText(user.roles)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 text-center align-middle min-w-[120px]">
                      <div className="flex justify-center items-center">
                        {getPostalCode(user.addresses)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 text-center align-middle min-w-[140px]">
                      <div className="flex justify-center items-center">
                        <span className="text-gray-400">--</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 text-center align-middle min-w-[120px]">
                      <div className="flex justify-center items-center">
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-center align-middle min-w-[150px]">
                      <div className="flex justify-center items-center gap-3">
                        {user.addresses && user.addresses.length > 0 && (
                          <button
                            onClick={() => setSelectedAddress(user.addresses[0])}
                            className="text-blue-600 hover:text-blue-900 transition-colors text-sm px-2 py-1 rounded border border-blue-200 hover:border-blue-300"
                          >
                            مشاهده آدرس
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user._id, user.username || user.phone)}
                          disabled={deleteLoading === user._id}
                          className="text-red-600 hover:text-red-900 disabled:text-red-300 disabled:cursor-not-allowed transition-colors text-sm px-2 py-1 rounded border border-red-200 hover:border-red-300"
                        >
                          {deleteLoading === user._id ? 'در حال حذف...' : 'حذف'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden">
            {filteredUsers.map((user) => (
              <div key={user._id} className="border-b border-gray-200 p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                <div className="space-y-4">
                  {/* User Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">
                        {user.username || 'نام کاربری ثبت نشده'}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">{user.phone}</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.roles.includes('ADMIN') 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {getRoleText(user.roles)}
                    </span>
                  </div>

                  {/* User Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 block">کد پستی:</span>
                      <span className="text-gray-900">{getPostalCode(user.addresses)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">تاریخ ایجاد:</span>
                      <span className="text-gray-900">{formatDate(user.createdAt)}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500 block">حساب بانکی:</span>
                      <span className="text-gray-400">--</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    {user.addresses && user.addresses.length > 0 && (
                      <button
                        onClick={() => setSelectedAddress(user.addresses[0])}
                        className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg font-medium transition-colors text-sm"
                      >
                        مشاهده آدرس
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteUser(user._id, user.username || user.phone)}
                      disabled={deleteLoading === user._id}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 disabled:text-red-300 disabled:cursor-not-allowed px-3 py-2 rounded-lg font-medium transition-colors text-sm"
                    >
                      {deleteLoading === user._id ? 'در حال حذف...' : 'حذف کاربر'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              {searchTerm ? (
                <>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">کاربری یافت نشد</h3>
                  <p className="text-gray-500 mb-6 text-sm sm:text-base">هیچ کاربری با عبارت "{searchTerm}" پیدا نشد.</p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base inline-flex items-center gap-2"
                  >
                    نمایش تمام کاربران
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">کاربری وجود ندارد</h3>
                  <p className="text-gray-500 text-sm sm:text-base">هنوز هیچ کاربری در سیستم ثبت نشده است.</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Address Modal */}
        {selectedAddress && (
          <div 
            className="fixed inset-0 flex items-center justify-center p-4 z-50 backdrop-blur-sm" 
            dir="rtl"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
          >
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full border border-gray-200 mx-2">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">آدرس کامل کاربر</h3>
              </div>
              <div className="px-4 sm:px-6 py-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500">نام تحویل‌گیرنده</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedAddress.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">استان</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedAddress.province}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">شهر</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedAddress.city}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">خیابان و پلاک</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedAddress.street}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">کد پستی</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedAddress.postalCode}</p>
                </div>
              </div>
              <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex justify-start">
                <button
                  onClick={() => setSelectedAddress(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}