import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { MobileMockup } from '../components/MobileMockup';
import { usePreview } from '../context/PreviewContext';

export const MainLayout = () => {
  const { profilePreview, linksPreview } = usePreview();

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-6 lg:p-6 pb-20 font-sans antialiased text-slate-900 selection:bg-primary-200">
      <div className="max-w-[1440px] mx-auto space-y-6">
        <Header />
        
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Mobile Mockup Preview (Hidden on small screens) */}
          <div className="hidden lg:flex lg:col-span-5 xl:col-span-4 bg-white rounded-3xl p-6 min-h-[800px] h-[calc(100vh-140px)] items-center justify-center sticky top-32 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100">
            <MobileMockup profile={profilePreview} links={linksPreview} />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-3xl p-6 md:p-10 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100 min-h-[800px] h-[calc(100vh-140px)] overflow-y-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
