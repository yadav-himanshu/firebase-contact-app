import { NavLink, Link } from "react-router-dom";
import { Users, Star, Settings as SettingsIcon, LayoutDashboard, X, Share2, UserCircle } from "lucide-react";
import { cn } from "../../utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { accessService } from "../../services/access.service";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
    { name: "All Contacts", href: "/", icon: Users },
    { name: "Favorites", href: "/favorites", icon: Star },
    { name: "Settings", href: "/settings", icon: SettingsIcon },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
    const { currentUser } = useAuth();
    const [sharedWithMe, setSharedWithMe] = useState([]);

    useEffect(() => {
        if (currentUser) {
            fetchSharedData();
        }
    }, [currentUser]);

    const fetchSharedData = async () => {
        try {
            const data = await accessService.getSharedWithMe(currentUser.uid);
            setSharedWithMe(data);
        } catch (error) {
            console.error("Failed to fetch shared data");
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 transform bg-card px-4 py-6 border-r transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col h-full",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="mb-8 flex items-center justify-between px-2">
                    <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity px-2">
                        <img
                            src="/logo.png"
                            alt="ContactHub Logo"
                            className="h-9 w-9 object-contain"
                        />
                        <span className="text-2xl font-bold tracking-tight text-foreground">ContactHub</span>
                    </Link>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="rounded-full p-1 lg:hidden hover:bg-muted text-muted-foreground"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 space-y-6">
                    <div className="space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                className={({ isActive }) =>
                                    cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )
                                }
                            >
                                <item.icon size={18} />
                                {item.name}
                            </NavLink>
                        ))}
                    </div>

                    {/* Shared Contacts Section */}
                    {sharedWithMe.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 flex items-center gap-2">
                                <Share2 size={12} />
                                Shared With You
                            </h4>
                            <div className="space-y-1">
                                {sharedWithMe.map((share) => (
                                    <NavLink
                                        key={share.id}
                                        to={`/shared/${share.ownerId}`}
                                        className={({ isActive }) =>
                                            cn(
                                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                                isActive
                                                    ? "bg-primary/10 text-primary"
                                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            )
                                        }
                                    >
                                        <UserCircle size={18} />
                                        <span className="truncate">{share.ownerName || share.ownerEmail.split('@')[0]}</span>
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    )}
                </nav>

                <div className="mt-auto pt-4 border-t">
                    <div className="rounded-xl bg-muted/50 p-4">
                        <h4 className="text-sm font-medium text-foreground">Need help?</h4>
                        <p className="mt-1 text-xs text-muted-foreground">Check out our documentation for ContactHub.</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
