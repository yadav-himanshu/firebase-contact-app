import { collection, doc, addDoc, updateDoc, deleteDoc, getDocs, query, where, orderBy, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const COLLECTION_NAME = "contacts";

export const contactService = {
    // Add a new contact
    addContact: async (userId, contactData) => {
        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...contactData,
                userId,
                isFavorite: false,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            return { id: docRef.id, ...contactData };
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // Get all contacts for a specific user
    getContacts: async (userId, searchQuery = "") => {
        try {
            let q = query(
                collection(db, COLLECTION_NAME),
                where("userId", "==", userId)
            );

            const snapshot = await getDocs(q);
            let contacts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Sort by createdAt desc client-side to avoid index requirement
            contacts.sort((a, b) => {
                const timeA = a.createdAt?.seconds || 0;
                const timeB = b.createdAt?.seconds || 0;
                return timeB - timeA;
            });

            // Client-side search for simplicity and better text-matching
            if (searchQuery) {
                return contacts.filter(contact =>
                    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            return contacts;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // Update a contact
    updateContact: async (contactId, contactData) => {
        try {
            const contactRef = doc(db, COLLECTION_NAME, contactId);
            await updateDoc(contactRef, {
                ...contactData,
                updatedAt: serverTimestamp(),
            });
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // Delete a contact
    deleteContact: async (contactId) => {
        try {
            const contactRef = doc(db, COLLECTION_NAME, contactId);
            await deleteDoc(contactRef);
        } catch (error) {
            throw new Error(error.message);
        }
    },

    // Toggle favorite
    toggleFavorite: async (contactId, currentStatus) => {
        try {
            const contactRef = doc(db, COLLECTION_NAME, contactId);
            await updateDoc(contactRef, {
                isFavorite: !currentStatus,
                updatedAt: serverTimestamp(),
            });
            return !currentStatus;
        } catch (error) {
            throw new Error(error.message);
        }
    }
};
