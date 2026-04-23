import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/dashboard/Header';
import BottomNav from '../components/dashboard/BottomNav';

const DashboardLayout = () => {
  return (
    /* h-screen + flex-col keeps the header top and nav bottom perfectly fixed */
    <div className="h-screen w-full bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100 flex flex-col overflow-hidden">
      
      {/* 1. TOP HEADER (Stretches full width) */}
      <div className="w-full shrink-0">
        <Header />
      </div>

      {/* 2. MAIN VIEWPORT (No max-width, hits the edges) */}
      <main className="flex-1 w-full overflow-y-auto px-4 md:px-8 lg:px-10 py-6 custom-scrollbar">
        {/* Removing 'max-w-7xl' and 'mx-auto' allows your cards 
           to utilize 100% of the screen width. 
        */}
        <div className="w-full h-full">
          <Outlet />
        </div>
      </main>

      {/* 3. BOTTOM NAVIGATION (Full width or centered as per your component) */}
      <div className="w-full shrink-0">
        <BottomNav />
      </div>
      
    </div>
  );
};

export default DashboardLayout;