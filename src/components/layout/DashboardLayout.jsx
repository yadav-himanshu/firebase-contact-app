import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout = ({ children, searchQuery, setSearchQuery }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Close sidebar when navigating on mobile
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Sidebar Component */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Header with Sidebar Toggle */}
                <Header
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />

                <main className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-6">
                    <div className="mx-auto max-w-6xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
