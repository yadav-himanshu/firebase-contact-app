import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAuth } from "../hooks/useAuth";
import { contactService } from "../services/contact.service";
import { toast } from "react-toastify";
import { Loader2, Plus, Star } from "lucide-react";
import { Button } from "../components/common/Button";
import ContactCard from "../components/ContactCard";
import Modal from "../components/common/Modal";
import ContactForm from "../components/ContactForm";
import { useNotification } from "../context/NotificationContext";

const Favorites = () => {
    const { currentUser } = useAuth();
    const { addActivity } = useNotification();
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState(null);

    const fetchContacts = async (action, name) => {
        if (!currentUser) return;
        if (action && name) {
            addActivity(action, name);
        }
        try {
            setLoading(true);
            const data = await contactService.getContacts(currentUser.uid, searchQuery);
            setContacts(data.filter(c => c.isFavorite));
        } catch (error) {
            toast.error("Failed to fetch favorite contacts");
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

    const handleEdit = (contact) => {
        setEditingContact(contact);
        setIsModalOpen(true);
    };

    return (
        <DashboardLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        Favorites <Star className="fill-yellow-400 text-yellow-400" size={24} />
                    </h2>
                    <p className="text-sm text-muted-foreground">Your most important contacts.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : contacts.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center bg-card">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400/10 mb-4">
                        <Star className="h-6 w-6 text-yellow-400" />
                    </div>
                    <h3 className="text-lg font-medium">No favorites found</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-4">
                        {searchQuery ? "Try adjusting your search query." : "Mark contacts as favorites to see them here."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                title="Edit Contact"
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

export default Favorites;
