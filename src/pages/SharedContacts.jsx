import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { contactService } from "../services/contact.service";
import { toast } from "react-toastify";
import { Loader2, Users } from "lucide-react";
import ContactCard from "../components/ContactCard";

const SharedContacts = () => {
    const { userId } = useParams();
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchSharedContacts = async () => {
        try {
            setLoading(true);
            const data = await contactService.getContacts(userId, searchQuery);
            setContacts(data);
        } catch (error) {
            toast.error("Failed to fetch shared contacts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSharedContacts();
    }, [userId, searchQuery]);

    return (
        <DashboardLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Users size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">
                            Shared Contacts
                        </h2>
                        <p className="text-sm text-muted-foreground">Viewing contacts shared with you by another user.</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : contacts.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center bg-card">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Users className="text-muted-foreground" size={24} />
                    </div>
                    <h3 className="text-lg font-medium">No shared contacts</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                        This user hasn't added any contacts yet, or you don't have permission to view them.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {contacts.map((contact) => (
                        <ContactCard
                            key={contact.id}
                            contact={contact}
                            isReadOnly={true}
                        />
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
};

export default SharedContacts;
