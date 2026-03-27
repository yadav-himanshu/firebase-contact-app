import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { toast } from "react-toastify";
import {
    User, Mail, Lock, ShieldCheck, Share2,
    Send, UserCheck, UserMinus, Clock
} from "lucide-react";
import { accessService } from "../services/access.service";
import { cn } from "../utils/cn";

import { useNotification } from "../context/NotificationContext";

const Settings = () => {
    const { currentUser, updateUserProfile, updateUserEmail, updateUserPassword } = useAuth();
    const { addActivity } = useNotification();
    const [activeTab, setActiveTab] = useState("profile");

    // Profile state
    const [displayName, setDisplayName] = useState(currentUser?.displayName || "");
    const [email, setEmail] = useState(currentUser?.email || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Sharing state
    const [shareEmail, setShareEmail] = useState("");
    const [inboundRequests, setInboundRequests] = useState([]);
    const [sharedWithMe, setSharedWithMe] = useState([]);
    const [activeShares, setActiveShares] = useState([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (activeTab === "sharing") {
            fetchSharingData();
        }
    }, [activeTab]);

    const fetchSharingData = async () => {
        try {
            const [reqs, mine, others] = await Promise.all([
                accessService.getInboundRequests(currentUser.uid),
                accessService.getSharedWithMe(currentUser.uid),
                accessService.getPeopleIShareWith(currentUser.uid)
            ]);
            setInboundRequests(reqs);
            setSharedWithMe(mine);
            setActiveShares(others);
        } catch (error) {
            toast.error("Failed to fetch sharing information");
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await updateUserProfile({ displayName });
            toast.success("Profile updated!");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCredentials = async (e) => {
        e.preventDefault();
        if (!email && !password) return;

        try {
            setLoading(true);

            if (email && email !== currentUser.email) {
                await updateUserEmail(email);
            }

            if (password) {
                if (password !== confirmPassword) {
                    throw new Error("Passwords do not match");
                }
                await updateUserPassword(password);
            }

            toast.success("Security credentials updated!");
            setPassword("");
            setConfirmPassword("");
        } catch (error) {
            if (error.code === "auth/requires-recent-login") {
                toast.error("Please log out and sign in again to verify your identity.");
            } else {
                toast.error(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRequestAccess = async (e) => {
        e.preventDefault();
        if (!shareEmail) return;
        try {
            setLoading(true);
            await accessService.requestAccess(currentUser, shareEmail, addActivity);
            toast.success(`Request sent to ${shareEmail}`);
            setShareEmail("");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResponse = async (request, status) => {
        try {
            await accessService.respondToRequest(request, status, currentUser, addActivity);
            toast.success(status === "approved" ? "Access granted!" : "Request rejected");
            fetchSharingData();
        } catch (error) {
            toast.error("Operation failed");
        }
    };

    const handleRevoke = async (shareId) => {
        try {
            await accessService.revokeAccess(shareId);
            toast.success("Access revoked");
            fetchSharingData();
        } catch (error) {
            toast.error("Failed to revoke access");
        }
    };

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Settings</h2>
                <p className="text-sm text-muted-foreground">Manage your account and contact sharing preferences.</p>
            </div>

            <div className="flex gap-1 mb-8 p-1 bg-muted/50 rounded-lg w-fit">
                <button
                    onClick={() => setActiveTab("profile")}
                    className={cn(
                        "px-4 py-2 text-sm font-medium rounded-md transition-all",
                        activeTab === "profile" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    Account Profile
                </button>
                <button
                    onClick={() => setActiveTab("sharing")}
                    className={cn(
                        "px-4 py-2 text-sm font-medium rounded-md transition-all",
                        activeTab === "sharing" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    Contact Sharing
                </button>
            </div>

            <div className="max-w-3xl space-y-8">
                {activeTab === "profile" ? (
                    <>
                        {/* Profile Section */}
                        <section className="rounded-xl border bg-card p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-6 text-primary">
                                <User size={20} />
                                <h3 className="text-lg font-semibold text-foreground">Public Profile</h3>
                            </div>
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-1.5 block">Display Name</label>
                                    <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                                </div>
                                <Button type="submit" disabled={loading} size="sm">Save Profile</Button>
                            </form>
                        </section>

                        <section className="rounded-xl border bg-card p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-6 text-primary">
                                <Lock size={20} />
                                <h3 className="text-lg font-semibold text-foreground">Security</h3>
                            </div>

                            {/* Conditional Display for Social Login */}
                            {currentUser?.providerData[0]?.providerId === "google.com" ? (
                                <div className="flex items-start gap-3 rounded-lg bg-primary/5 p-4 border border-primary/10">
                                    <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                                    <div className="text-xs text-muted-foreground leading-relaxed">
                                        <p className="font-semibold text-foreground mb-1">Google Account Protection</p>
                                        Your account is secured via Google. Email and password management is handled through your Google Account settings.
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleUpdateCredentials} className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block">Email Address</label>
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="New email address"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium mb-1.5 block">New Password</label>
                                            <Input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium mb-1.5 block">Confirm Password</label>
                                            <Input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 bg-muted/50 p-3 rounded-lg mb-4">
                                        <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                                        <p className="text-[10px] text-muted-foreground italic">
                                            Recent login required. If you experience errors, please log out and back in.
                                        </p>
                                    </div>
                                    <Button type="submit" disabled={loading} size="sm">Update Credentials</Button>
                                </form>
                            )}
                        </section>
                    </>
                ) : (
                    <>
                        {/* Sharing Request Section */}
                        <section className="rounded-xl border bg-card p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-6 text-primary">
                                <Share2 size={20} />
                                <h3 className="text-lg font-semibold text-foreground">Request Access</h3>
                            </div>
                            <form onSubmit={handleRequestAccess} className="flex gap-3">
                                <div className="flex-1">
                                    <Input
                                        type="email"
                                        placeholder="User's email address..."
                                        value={shareEmail}
                                        onChange={(e) => setShareEmail(e.target.value)}
                                    />
                                </div>
                                <Button type="submit" disabled={loading} className="gap-2">
                                    <Send size={16} />
                                    Request
                                </Button>
                            </form>
                            <p className="mt-3 text-xs text-muted-foreground">The user will receive an inbound request to approve or deny.</p>
                        </section>

                        {/* Inbound Requests */}
                        {inboundRequests.length > 0 ? (
                            <section className="rounded-xl border bg-card p-6 shadow-sm">
                                <div className="flex items-center gap-2 mb-4 text-orange-500">
                                    <Clock size={20} />
                                    <h3 className="text-lg font-semibold text-foreground">Inbound Requests</h3>
                                </div>
                                <div className="space-y-3">
                                    {inboundRequests.map(req => (
                                        <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary uppercase">
                                                    {req.fromEmail.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">{req.fromEmail}</p>
                                                    <p className="text-[10px] text-muted-foreground">Wants to view your contacts</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" onClick={() => handleResponse(req, "approved")} className="h-8 px-3">Accept</Button>
                                                <Button size="sm" variant="ghost" onClick={() => handleResponse(req, "rejected")} className="h-8 px-3 text-destructive">Decline</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ) : (
                            <section className="rounded-xl border bg-card p-6 shadow-sm">
                                <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                                    <Clock size={20} />
                                    <h3 className="text-lg font-semibold">No Pending Requests</h3>
                                </div>
                                <p className="text-sm text-muted-foreground italic text-center py-2">No one has requested access to your contacts yet.</p>
                            </section>
                        )}

                        {/* Active Shares (People you grant access to) */}
                        <section className="rounded-xl border bg-card p-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-4 text-green-500">
                                <UserCheck size={20} />
                                <h3 className="text-lg font-semibold text-foreground">You are sharing with</h3>
                            </div>
                            {activeShares.length === 0 ? (
                                <p className="text-sm text-muted-foreground italic text-center py-4">You haven't granted access to anyone yet.</p>
                            ) : (
                                <div className="space-y-2">
                                    {activeShares.map(share => (
                                        <div key={share.id} className="flex items-center justify-between p-3 rounded-lg border">
                                            <span className="text-sm font-medium">{share.viewerEmail}</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive h-8 px-2 gap-2"
                                                onClick={() => handleRevoke(share.id)}
                                            >
                                                <UserMinus size={14} />
                                                Revoke
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Settings;
