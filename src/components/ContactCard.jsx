import { User, Phone, Mail, Star, Pencil, Trash2, Copy, Check } from "lucide-react";
import { contactService } from "../services/contact.service";
import { toast } from "react-toastify";
import { useState } from "react";
import { Button } from "./common/Button";
import { cn } from "../utils/cn";
import { motion } from "framer-motion";

const ContactCard = ({ contact, onUpdate, onEdit }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isFavToggle, setIsFavToggle] = useState(false);
    const [copiedField, setCopiedField] = useState(null);

    const copyToClipboard = (text, field) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        toast.success(`${field} copied to clipboard!`, { autoClose: 1000 });
        setTimeout(() => setCopiedField(null), 2000);
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this contact?")) return;
        try {
            setIsDeleting(true);
            await contactService.deleteContact(contact.id);
            toast.success("Contact deleted successfully");
            onUpdate("deleted", contact.name);
        } catch (error) {
            toast.error("Failed to delete contact");
            setIsDeleting(false);
        }
    };

    const toggleFavorite = async () => {
        try {
            setIsFavToggle(true);
            const newStatus = await contactService.toggleFavorite(contact.id, contact.isFavorite);
            onUpdate(newStatus ? "favorited" : "unfavorited", contact.name);
        } catch (error) {
            toast.error("Failed to update favorite status");
        } finally {
            setIsFavToggle(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            layout
            className="group relative flex flex-col rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md h-full"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-medium text-primary uppercase">
                        {contact.name?.charAt(0) || "U"}
                    </div>
                    <div>
                        <h3 className="font-semibold tracking-tight text-card-foreground line-clamp-1 text-lg">
                            {contact.name}
                        </h3>
                        <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground uppercase font-medium tracking-wider">Contact</span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={toggleFavorite}
                    disabled={isFavToggle}
                    className={cn(
                        "p-2 rounded-full transition-colors",
                        contact.isFavorite ? "text-yellow-400 hover:bg-yellow-400/10" : "text-muted-foreground hover:bg-muted"
                    )}
                >
                    <Star size={20} className={cn(contact.isFavorite && "fill-current")} />
                </button>
            </div>

            <div className="mt-5 space-y-3 flex-1">
                {/* Email */}
                {contact.email && (
                    <div className="flex items-center justify-between group/field text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail size={14} />
                            <span className="line-clamp-1">{contact.email}</span>
                        </div>
                        <button
                            onClick={() => copyToClipboard(contact.email, "Email")}
                            className="p-1 hover:bg-muted rounded opacity-0 group-hover/field:opacity-100 transition-opacity"
                        >
                            {copiedField === "Email" ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                        </button>
                    </div>
                )}

                {/* Phone */}
                {contact.phone && (
                    <div className="flex items-center justify-between group/field text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone size={14} />
                            <span>{contact.phone}</span>
                        </div>
                        <button
                            onClick={() => copyToClipboard(contact.phone, "Phone")}
                            className="p-1 hover:bg-muted rounded opacity-0 group-hover/field:opacity-100 transition-opacity"
                        >
                            {copiedField === "Phone" ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                        </button>
                    </div>
                )}

                {/* Notes */}
                {contact.notes && (
                    <div className="mt-4 rounded-lg bg-muted/30 p-3 text-xs text-muted-foreground leading-relaxed">
                        <p className="font-semibold uppercase tracking-tight mb-1 opacity-60">Notes</p>
                        {contact.notes}
                    </div>
                )}
            </div>

            {/* Persistent Actions */}
            <div className="mt-6 pt-4 border-t flex items-center justify-end gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 gap-1.5 text-xs font-semibold"
                    onClick={() => onEdit(contact)}
                >
                    <Pencil size={13} />
                    Edit
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 gap-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    <Trash2 size={13} />
                    {isDeleting ? "..." : "Delete"}
                </Button>
            </div>
        </motion.div>
    );
};

export default ContactCard;
