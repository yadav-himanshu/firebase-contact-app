import { createContext, useContext, useState, useEffect } from "react";
import {
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    orderBy,
    limit,
    serverTimestamp,
    updateDoc,
    doc,
    writeBatch
} from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../hooks/useAuth";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [activities, setActivities] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!currentUser) {
            setActivities([]);
            setUnreadCount(0);
            return;
        }

        const q = query(
            collection(db, "notifications"),
            where("userId", "==", currentUser.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newActivities = snapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    timestamp: doc.data().timestamp?.toDate() || new Date()
                }))
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, 20);

            setActivities(newActivities);
            setUnreadCount(newActivities.filter(a => !a.isRead).length);
        });

        return () => unsubscribe();
    }, [currentUser]);

    const addActivity = async (type, name, targetUserId = null) => {
        const userId = targetUserId || currentUser?.uid;
        if (!userId) return;

        try {
            await addDoc(collection(db, "notifications"), {
                userId,
                type, // 'added', 'updated', 'deleted', 'favorited', 'request', 'approved'
                name,
                isRead: false,
                timestamp: serverTimestamp()
            });
        } catch (error) {
            console.error("Failed to add notification:", error);
        }
    };

    const markAllAsRead = async () => {
        if (!currentUser) return;
        const batch = writeBatch(db);
        activities.filter(a => !a.isRead).forEach(a => {
            const ref = doc(db, "notifications", a.id);
            batch.update(ref, { isRead: true });
        });
        await batch.commit();
    };

    const clearActivities = async () => {
        // Typically we don't delete history, but we can mark all as read or just clear local state if preferred
        // For now, let's just mark all as read as "clearing"
        markAllAsRead();
    };

    return (
        <NotificationContext.Provider value={{ activities, unreadCount, addActivity, markAllAsRead, clearActivities }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
