import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/dashboard/Header';
import BottomNav from '../components/dashboard/BottomNav';

const DashboardLayout = () => {
  return (
    /* 
       KIOSK SHELL: Fixed h-screen, no scrolling on the main container.
       The overflow is handled internally by each page if needed, but 
       designed to stay 100% within the 1080p viewport.
    */
    <div className="h-screen w-full flex flex-col overflow-hidden theme-transition bg-panel select-none">
      
      {/* 1. TOP HEADER (Industrial Glass) */}
      <div className="w-full shrink-0 z-50">
        <Header />
      </div>

      {/* 2. MAIN VIEWPORT (The 'Frosted' Canvas) */}
      <main className="flex-1 w-full relative overflow-hidden flex flex-col">
        {/*
           Every page injected via <Outlet /> inherits the kiosk constraints.
           We add a subtle entry animation here for consistent UX.
        */}
        <div className="flex-1 w-full overflow-y-auto no-scrollbar px-6 py-4 animate-kiosk-entry">
          <Outlet />
        </div>
      </main>

      {/* 3. ENHANCED BOTTOM NAVIGATION */}
      <div className="w-full shrink-0 relative z-50 pb-8">
        <BottomNav />
      </div>
      
    </div>
  );
};

export default DashboardLayout;