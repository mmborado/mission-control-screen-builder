import { useEffect, useRef, useState } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { WidgetGrid } from "./components/layout/WidgetGrid";
import { useLayoutStore } from "./store/layout";
import { Toaster } from "./components/ui/sonner";
import { Menu, X } from "lucide-react";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const setInitialLayout = useLayoutStore((state) => state.initLayout);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInitialLayout();

    function updateHeaderHeight() {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    }

    function handleResize() {
      updateHeaderHeight();

      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    }

    updateHeaderHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Toaster />
      <div className='flex flex-col min-h-screen'>
        <header
          ref={headerRef}
          className='p-6 bg-[#0d091e] text-white text-center shadow-[0_6px_8px_-2px_rgba(0,0,0,0.6)] flex items-center'>
          <h1 className='flex-1 text-left md:text-center text-2xl md:text-5xl'>
            Mission Control Screen Builder
          </h1>
          <button
            className='md:hidden p-2 rounded-md focus:outline-none focus:ring focus:ring-white'
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label='Toggle sidebar'>
            {sidebarOpen ? <X /> : <Menu />}
          </button>
        </header>

        <div className='flex overflow-hidden flex-1 relative'>
          <div
            className={
              `fixed z-50 w-64 bg-[#1c1c1e] shadow-lg transition-transform duration-300 ease-in-out md:hidden` +
              ` ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`
            }
            style={{
              top: `${headerHeight}px`,
              height: `calc(100vh - ${headerHeight}px)`,
            }}>
            <Sidebar />
          </div>

          <div className='hidden md:block md:basis-[20%] bg-[#1c1c1e]'>
            <Sidebar />
          </div>

          <main className='flex-1 min-w-0 bg-[var(--background-color)] p-6 overflow-auto md:w-[80%]'>
            <WidgetGrid />
          </main>
        </div>
      </div>
    </>
  );
}
