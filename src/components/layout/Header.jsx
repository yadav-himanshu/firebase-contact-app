import { useAuth } from "../../hooks/useAuth";
import { Button } from "../common/Button";
import { LogOut, Bell, Search as SearchIcon, Menu, Trash2, CheckCircle2, UserPlus, FileEdit, Star } from "lucide-react";
import { Input } from "../common/Input";
import { useState } from "react";
import { useNotification } from "../../context/NotificationContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn";

import { Link } from "react-router-dom";

const Header = ({ searchQuery, setSearchQuery, toggleSidebar }) => {
    const { currentUser, logout } = useAuth();
    const { activities, unreadCount, markAllAsRead, clearActivities } = useNotification();
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    const getNotificationMessage = (activity) => {
        switch (activity.type) {
            case 'added': return `Added new contact: ${activity.name}`;
            case 'updated': return `Updated contact details: ${activity.name}`;
            case 'deleted': return `Deleted contact: ${activity.name}`;
            case 'favorited': return `Starred contact: ${activity.name}`;
            case 'unfavorited': return `Unstarred contact: ${activity.name}`;
            case 'request': return `New access request from ${activity.name}`;
            case 'approved': return `${activity.name} approved your access request`;
            default: return `Activity related to ${activity.name}`;
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'added': return 'text-green-500 bg-green-500/10';
            case 'deleted': return 'text-destructive bg-destructive/10';
            case 'request': return 'text-orange-500 bg-orange-500/10';
            case 'approved': return 'text-primary bg-primary/10';
            default: return 'text-primary bg-primary/10';
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case "added": return <UserPlus size={14} className="text-green-500" />;
            case "updated": return <FileEdit size={14} className="text-blue-500" />;
            case "deleted": return <Trash2 size={14} className="text-destructive" />;
            case "favorited": return <Star size={14} className="text-yellow-500 fill-yellow-500" />;
            case "unfavorited": return <Star size={14} className="text-muted-foreground" />;
            default: return <Bell size={14} />;
        }
    };

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-4 md:px-6 shadow-sm z-30 relative">
            <div className="flex flex-1 items-center gap-3 md:gap-4">
                {/* Toggle Sidebar Button for Mobile */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="lg:hidden shrink-0"
                >
                    <Menu size={20} />
                </Button>

                {/* Search */}
                <div className="relative max-w-sm md:max-w-md flex-1">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="pl-9 bg-muted/50 focus-visible:bg-background h-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4 ml-4">
                <div className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-muted-foreground relative"
                        onClick={() => {
                            setIsNotifOpen(!isNotifOpen);
                            if (!isNotifOpen) markAllAsRead();
                        }}
                    >
                        <Bell size={18} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full border border-card" />
                        )}
                    </Button>

                    <AnimatePresence>
                        {isNotifOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsNotifOpen(false)}
                                />
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl border bg-card p-4 shadow-xl z-50 overflow-hidden"
                                >
                                    <div className="flex items-center justify-between mb-4 px-1">
                                        <h3 className="font-semibold text-sm">Recent Activity</h3>
                                        <button
                                            onClick={clearActivities}
                                            className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground hover:text-foreground"
                                        >
                                            Clear
                                        </button>
                                    </div>

                                    <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                                        {activities.length === 0 ? (
                                            <div className="p-8 text-center">
                                                <CheckCircle2 size={32} className="mx-auto text-muted-foreground/30 mb-2" />
                                                <p className="text-xs text-muted-foreground">Everything caught up!</p>
                                            </div>
                                        ) : (
                                            activities.map((activity) => (
                                                <div key={activity.id} className="flex gap-3 items-start p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                                    <div className={cn("mt-0.5 shrink-0 p-1.5 rounded-lg", getNotificationColor(activity.type))}>
                                                        {getIcon(activity.type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs leading-normal font-medium text-foreground">
                                                            {getNotificationMessage(activity)}
                                                        </p>
                                                        <p className="text-[10px] text-muted-foreground/70 mt-1">
                                                            {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                <Link
                    to="/settings"
                    className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium shrink-0 hover:bg-primary/30 transition-colors"
                    title="Profile Settings"
                >
                    {currentUser?.email?.charAt(0).toUpperCase() || "U"}
                </Link>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => logout()}
                    title="Logout"
                    className="text-muted-foreground hover:text-destructive shrink-0"
                >
                    <LogOut size={18} />
                </Button>
            </div>
        </header>
    );
};

export default Header;
