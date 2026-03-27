import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../hooks/useAuth";
import { contactService } from "../services/contact.service";
import { toast } from "react-toastify";
import { Users, Star, Share2, Plus, Loader2 } from "lucide-react";
import { Button } from "../components/common/Button";
import ContactCard from "../components/ContactCard";
import Modal from "../components/common/Modal";
import ContactForm from "../components/ContactForm";
import { useNotification } from "../context/NotificationContext";
import { accessService } from "../services/access.service";
import { cn } from "../utils/cn";

const Dashboard = () => {
    const { currentUser } = useAuth();
    const { addActivity } = useNotification();
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const [stats, setStats] = useState({ total: 0, favorites: 0, shared: 0 });

    const fetchContacts = async (action, name) => {
        if (!currentUser) return;
        if (action && name) {
            addActivity(action, name);
        }
        try {
            setLoading(true);
            const data = await contactService.getContacts(currentUser.uid, searchQuery);
            setContacts(data);
        } catch (error) {
            toast.error("Failed to fetch contacts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchContacts();
        }, 300);
        return () => clearTimeout(timer);
    }, [currentUser, searchQuery]);

    // Update stats based on contacts and shared data
    useEffect(() => {
        const total = contacts.length;
        const favorites = contacts.filter(c => c.isFavorite).length;
        setStats(prev => ({ ...prev, total, favorites }));
    }, [contacts]);

    useEffect(() => {
        if (currentUser) {
            accessService.getSharedWithMe(currentUser.uid).then(data => {
                setStats(prev => ({ ...prev, shared: data.length }));
            }).catch(() => { });
        }
    }, [currentUser]);

    const handleEdit = (contact) => {
        setEditingContact(contact);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingContact(null);
        setIsModalOpen(true);
    };

    return (
        <DashboardLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 translate-y-[-10px] animate-in fade-in slide-in-from-top-4 duration-500">
                {[
                    { label: "Total Contacts", value: stats.total, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
                    { label: "Favorites", value: stats.favorites, icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10" },
                    { label: "Shared with Me", value: stats.shared, icon: Share2, color: "text-purple-500", bg: "bg-purple-500/10" },
                ].map((stat, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl border bg-card shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                        <div className={cn("p-3 rounded-lg relative z-10", stat.bg)}>
                            <stat.icon className={cn("h-5 w-5", stat.color)} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                        <div className={cn("absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 transition-transform", stat.color)}>
                            <stat.icon size={80} strokeWidth={1} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">My Contacts</h2>
                    <p className="text-sm text-muted-foreground">Manage your personal and professional network.</p>
                </div>
                <Button className="gap-2" onClick={handleAdd}>
                    <Plus size={16} />
                    Add Contact
                </Button>
            </div>

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : contacts.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center bg-card">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                        <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium">No contacts found</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">
                        {searchQuery ? "Try adjusting your search query." : "Get started by adding a new contact."}
                    </p>
                    {!searchQuery && (
                        <Button variant="outline" onClick={handleAdd}>Add First Contact</Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {contacts.map((contact) => (
                        <ContactCard
                            key={contact.id}
                            contact={contact}
                            onUpdate={fetchContacts}
                            onEdit={handleEdit}
                        />
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingContact ? "Edit Contact" : "Add New Contact"}
            >
                <ContactForm
                    contact={editingContact}
                    onClose={() => setIsModalOpen(false)}
                    onUpdate={fetchContacts}
                />
            </Modal>
        </DashboardLayout>
    );
};

export default Dashboard;
