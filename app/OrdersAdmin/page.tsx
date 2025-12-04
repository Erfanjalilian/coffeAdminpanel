'use client';

import { useState, useEffect } from 'react';

interface Coordinates {
  lat: string;
  lng: string;
}

interface ShippingAddress {
  coordinates: Coordinates;
  postalCode: string;
  address: string;
  cityId: number;
}

interface User {
  _id: string;
  phone: string;
  username: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Product {
  seo: {
    keywords: string[];
  };
  weight: number;
  ingredients: string;
  benefits: string;
  howToUse: string;
  hasWarranty: boolean;
  warrantyDuration: number;
  warrantyDescription: string;
  recommended: boolean;
  relatedProducts: string[];
  _id: string;
  name: string;
  slug: string;
  description: string;
  positiveFeature: string;
  category: string;
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
  reviews: number;
  isPrime: boolean;
  isPremium: boolean;
  features: string[];
  image: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  userReviews: any[];
  priceAfterDiscount: number;
  id: string;
}

interface OrderItem {
  product: Product | null;
  quantity: number;
  priceAtTimeOfAdding: number;
  _id: string;
}

interface Order {
  shippingAddress: ShippingAddress;
  _id: string;
  user: User;
  items: OrderItem[];
  status: string;
  authority: string;
  __v: number;
  createdAt?: string;
  updatedAt?: string;
}

interface OrdersResponse {
  status: number;
  success: boolean;
  data: {
    orders: Order[];
    pagination: {
      page: number;
      limit: number;
      totalPage: number;
      totalسفارش‌ها: number;
    };
  };
}

export default function OrdersAdmin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order =>
        order.authority.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.phone.includes(searchTerm) ||
        order.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => 
          item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingAddress.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  }, [searchTerm, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://coffee-shop-backend-k3un.onrender.com/api/v1/order');
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data: OrdersResponse = await response.json();
      setOrders(data.data.orders);
      setFilteredOrders(data.data.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      
      alert('وضعیت سفارش با موفقیت به‌روزرسانی شد');
    } catch (err) {
      alert('خطا در به‌روزرسانی وضعیت سفارش');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  const calculateOrderTotal = (items: OrderItem[]) => {
    return items.reduce((total, item) => total + (item.priceAtTimeOfAdding * item.quantity), 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'PROCESSING': 'در حال پردازش',
      'SHIPPED': 'ارسال شده',
      'DELIVERED': 'تحویل داده شده',
      'CANCELLED': 'لغو شده'
    };
    return statusMap[status] || status;
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">مدیریت سفارشات</h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">مدیریت و پیگیری سفارشات مشتریان</p>
            </div>
            <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">
              کل سفارشات: {orders.length}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                جستجو در سفارشات
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="جستجو بر اساس کد سفارش، شماره تماس، محصول، آدرس یا وضعیت..."
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
              <span> : {filteredOrders.length} سفارش یافت شد</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              لیست سفارشات ({filteredOrders.length})
            </h2>
          </div>

          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    کد سفارش
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    مشتری
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    محصولات
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    مبلغ کل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    وضعیت
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    آدرس
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.authority}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.user.phone}</div>
                      <div className="text-sm text-gray-500">{order.user.username}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.items.map((item, index) => (
                          <div key={item._id} className="mb-1">
                            <span className="font-medium">{item.product?.name || "محصول حذف شده"}</span>
                            <span className="text-gray-500 text-xs mr-2">({item.quantity} عدد)</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">
                        {formatPrice(calculateOrderTotal(order.items))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className={`text-sm px-3 py-1 rounded-full font-medium ${getStatusColor(order.status)} border-0 focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="PROCESSING">در حال پردازش</option>
                        <option value="SHIPPED">ارسال شده</option>
                        <option value="DELIVERED">تحویل داده شده</option>
                        <option value="CANCELLED">لغو شده</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {order.shippingAddress.address}
                      </div>
                      <div className="text-sm text-gray-500">
                        کد پستی: {order.shippingAddress.postalCode}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-900 ml-4"
                      >
                        جزئیات
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden">
            {filteredOrders.map((order) => (
              <div key={order._id} className="border-b border-gray-200 p-6 hover:bg-gray-50 transition-colors">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{order.authority}</h3>
                      <p className="text-sm text-gray-500 mt-1">{order.user.phone}</p>
                    </div>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(order.status)} border-0 focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="PROCESSING">در حال پردازش</option>
                      <option value="SHIPPED">ارسال شده</option>
                      <option value="DELIVERED">تحویل داده شده</option>
                      <option value="CANCELLED">لغو شده</option>
                    </select>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">محصولات:</h4>
                    {order.items.map((item) => (
                      <div key={item._id} className="flex justify-between items-center py-1">
                        <span className="text-sm text-gray-900">
                          {item.product?.name || "محصول حذف شده"}
                          <span className="text-gray-500 text-xs mr-2">({item.quantity} عدد)</span>
                        </span>
                        <span className="text-sm text-gray-600">
                          {formatPrice(item.priceAtTimeOfAdding * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <div>
                      <span className="text-sm font-medium text-gray-700">مبلغ کل: </span>
                      <span className="text-sm font-bold text-green-600">
                        {formatPrice(calculateOrderTotal(order.items))}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">آدرس:</h4>
                    <p className="text-sm text-gray-600">{order.shippingAddress.address}</p>
                    <p className="text-xs text-gray-500 mt-1">کد پستی: {order.shippingAddress.postalCode}</p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                    >
                      مشاهده جزئیات
                    </button>
                    <button className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm">
                      حذف سفارش
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">جزئیات سفارش</h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">کد سفارش</h3>
                      <p className="text-lg font-semibold text-gray-900">{selectedOrder.authority}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">وضعیت</h3>
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusText(selectedOrder.status)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">اطلاعات مشتری</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">شماره تماس</h4>
                        <p className="text-gray-900">{selectedOrder.user.phone}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">نام کاربری</h4>
                        <p className="text-gray-900">{selectedOrder.user.username}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">آدرس ارسال</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-900">{selectedOrder.shippingAddress.address}</p>
                      <div className="mt-2 text-sm text-gray-500">
                        <span>کد پستی: {selectedOrder.shippingAddress.postalCode}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">محصولات سفارش</h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item) => (
                        <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="bg-gray-200 w-12 h-12 rounded flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{item.product?.name || "محصول حذف شده"}</h4>
                              <p className="text-sm text-gray-500">تعداد: {item.quantity}</p>
                            </div>
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-gray-900">{formatPrice(item.priceAtTimeOfAdding * item.quantity)}</p>
                            <p className="text-sm text-gray-500">هر عدد: {formatPrice(item.priceAtTimeOfAdding)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>مبلغ کل سفارش:</span>
                      <span className="text-green-600">{formatPrice(calculateOrderTotal(selectedOrder.items))}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {filteredOrders.length === 0 && !loading && (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {searchTerm ? (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-2">سفارشی یافت نشد</h3>
                <p className="text-gray-500 mb-6">هیچ سفارشی با عبارت "{searchTerm}" پیدا نشد.</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                >
                  نمایش تمام سفارشات
                </button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-2">سفارشی وجود ندارد</h3>
                <p className="text-gray-500">هنوز هیچ سفارشی ثبت نشده است.</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}