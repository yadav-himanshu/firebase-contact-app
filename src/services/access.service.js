import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    updateDoc,
    setDoc,
    doc,
    serverTimestamp,
    deleteDoc,
    orderBy
} from "firebase/firestore";
import { db } from "../config/firebase";

const REQUESTS_COLLECTION = "accessRequests";
const SHARED_COLLECTION = "sharedAccess";

export const accessService = {
    // Request access to another user's contacts
    async requestAccess(fromUser, toEmail, addNotification) {
        if (fromUser.email === toEmail) throw new Error("You cannot request access to your own contacts");

        // Check if target user exists
        const userQ = query(collection(db, "users"), where("email", "==", toEmail));
        const userSnapshot = await getDocs(userQ);
        if (userSnapshot.empty) throw new Error("User with this email not found on ContactHub");
        const targetUser = userSnapshot.docs[0].data();

        // Check if a request already exists
        const q = query(
            collection(db, REQUESTS_COLLECTION),
            where("fromUserId", "==", fromUser.uid),
            where("toUserEmail", "==", toEmail)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) throw new Error("Request already sent to this user");

        const docRef = await addDoc(collection(db, REQUESTS_COLLECTION), {
            fromUserId: fromUser.uid,
            fromEmail: fromUser.email,
            fromName: fromUser.displayName || fromUser.email.split('@')[0],
            toUserEmail: toEmail,
            toUserId: targetUser.uid,
            status: "pending",
            timestamp: serverTimestamp()
        });

        // Notify the target user
        if (addNotification) {
            await addNotification("request", fromUser.displayName || fromUser.email, targetUser.uid);
        }

        return docRef;
    },

    // Get requests sent TO the current user
    async getInboundRequests(userId) {
        const q = query(
            collection(db, REQUESTS_COLLECTION),
            where("toUserId", "==", userId),
            where("status", "==", "pending")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => (b.timestamp?.toDate() || 0) - (a.timestamp?.toDate() || 0));
    },

    // Approve or Reject a request
    async respondToRequest(request, status, ownerUser, addNotification) {
        const requestRef = doc(db, REQUESTS_COLLECTION, request.id);
        await updateDoc(requestRef, { status });

        if (status === "approved") {
            // Create a shared access record with deterministic ID for security rules
            const shareId = `${request.fromUserId}_${ownerUser.uid}`;
            await setDoc(doc(db, SHARED_COLLECTION, shareId), {
                id: shareId,
                ownerId: ownerUser.uid,
                ownerEmail: ownerUser.email,
                ownerName: ownerUser.displayName || ownerUser.email.split('@')[0],
                viewerId: request.fromUserId,
                viewerEmail: request.fromEmail,
                timestamp: serverTimestamp()
            });

            if (addNotification) {
                await addNotification("approved", ownerUser.displayName || ownerUser.email, request.fromUserId);
            }
        }
    },

    // Get users who have shared their contacts WITH the current user
    async getSharedWithMe(userId) {
        const q = query(
            collection(db, SHARED_COLLECTION),
            where("viewerId", "==", userId)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // Get users the current user IS sharing contacts WITH
    async getPeopleIShareWith(userId) {
        const q = query(
            collection(db, SHARED_COLLECTION),
            where("ownerId", "==", userId)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // Revoke access
    async revokeAccess(shareId) {
        await deleteDoc(doc(db, SHARED_COLLECTION, shareId));
    }
};
