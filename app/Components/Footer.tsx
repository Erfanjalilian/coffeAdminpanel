// app/Components/AdminFooter.tsx - Minimal Version
'use client';

export default function AdminFooter() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-auto" dir="rtl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="text-gray-500 text-sm">
            آی کسب
          </div>
          <div className="text-gray-400 text-sm">
            توسعه دهنده : عرفان جلیلیان
          </div>
        </div>
      </div>
    </footer>
  );
}