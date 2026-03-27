import { useState, useEffect } from "react";
import { Input } from "./common/Input";
import { Button } from "./common/Button";
import { contactService } from "../services/contact.service";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";

const ContactForm = ({ contact, onClose, onUpdate }) => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        notes: ""
    });

    useEffect(() => {
        if (contact) {
            setFormData({
                name: contact.name || "",
                email: contact.email || "",
                phone: contact.phone || "",
                notes: contact.notes || ""
            });
        }
    }, [contact]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) return;

        try {
            setLoading(true);
            if (contact) {
                await contactService.updateContact(contact.id, formData);
                toast.success("Contact updated successfully");
                onUpdate("updated", formData.name);
            } else {
                await contactService.addContact(currentUser.uid, formData);
                toast.success("Contact added successfully");
                onUpdate("added", formData.name);
            }
            onClose();
        } catch (error) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="mb-2 block text-sm font-medium">Name <span className="text-destructive">*</span></label>
                <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                />
            </div>
            <div>
                <label className="mb-2 block text-sm font-medium">Email</label>
                <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                />
            </div>
            <div>
                <label className="mb-2 block text-sm font-medium">Phone Number</label>
                <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                />
            </div>
            <div>
                <label className="mb-2 block text-sm font-medium">Notes</label>
                <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any additional details..."
                />
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : contact ? "Update Contact" : "Add Contact"}
                </Button>
            </div>
        </form>
    );
};

export default ContactForm;
