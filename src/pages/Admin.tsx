import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import {
    sessionApi,
    challengeApi,
    subscriptionApi,
    reportApi,
    userApi,
    Session,
    Challenge,
    Subscription,
    ChallengeReport,
    SessionStatus,
    ChallengeType,
    UserRole,
    User,
    ReportRequestBody,
    SubscriptionBody,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
    Users,
    Calendar,
    Target,
    FileText,
    Heart,
    Home,
    LogOut,
    Plus,
    Edit,
    Trash2,
    BookOpen,
    Shield,
    Eye,
    X,
} from "lucide-react";
import { isNonNullArray } from "@/lib/utils";
import SessionDetails from "@/components/SessionDetails";
import ChallengeDetails from "@/components/ChallengeDetails";
import ConfirmRemoveDialog from "@/components/ConfirmRemoveDialog";
import Validators from "@/components/Validators";
import UserDetails from "@/components/UserDetails";

const Admin = () => {
    const { user, isAdmin, signOut, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [users, setUsers] = useState<User[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [reports, setReports] = useState<ChallengeReport[]>([]);
    const [loading, setLoading] = useState(true);

    // New: modal controls for viewing session and challenge
    const [viewSessionDialogOpen, setViewSessionDialogOpen] = useState(false);
    const [viewingSession, setViewingSession] = useState<Session | null>(null);

    const [viewChallengeDialogOpen, setViewChallengeDialogOpen] = useState(false);
    const [viewingChallenge, setViewingChallenge] = useState<Challenge | null>(null);

    const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
    const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
    const [expandedChallengeId, setExpandedChallengeId] = useState<string | null>(null);

    // Session (existing)
    const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
    const [editingSession, setEditingSession] = useState<Session | null>(null);
    const [sessionName, setSessionName] = useState("");
    const [sessionDescription, setSessionDescription] = useState("");
    const [sessionStartDate, setSessionStartDate] = useState("");
    const [sessionEndDate, setSessionEndDate] = useState("");
    const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(SessionStatus.INACTIVE);

    // Challenge
    const [challengeDialogOpen, setChallengeDialogOpen] = useState(false);
    const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
    const [challengeName, setChallengeName] = useState("");
    const [challengeDescription, setChallengeDescription] = useState("");
    const [challengeTarget, setChallengeTarget] = useState("");
    const [challengeType, setChallengeType] = useState<ChallengeType | null>(ChallengeType.INDIVIDUAL);
    const [challengeSessionId, setChallengeSessionId] = useState("");

    // User
    const [userDialogOpen, setUserDialogOpen] = useState(false);
    const [viewUserDialogOpen, setViewUserDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [viewingUser, setViewingUser] = useState<User | null>(null);
    const [userFirstName, setUserFirstName] = useState("");
    const [userLastName, setUserLastName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [userRole, setUserRole] = useState<string>(UserRole.USER);
    const [userPhoneNumber, setUserPhoneNumber] = useState("");
    const [userCountry, setUserCountry] = useState("");
    const [userRegion, setUserRegion] = useState("");
    const [userCity, setUserCity] = useState("");

    // Subscription
    const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);
    const [viewSubscriptionDialogOpen, setViewSubscriptionDialogOpen] = useState(false);
    const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
    const [viewingSubscription, setViewingSubscription] = useState<Subscription | null>(null);
    const [subscriptionUserId, setSubscriptionUserId] = useState("");
    const [subscriptionChallengeId, setSubscriptionChallengeId] = useState("");
    const [subscriptionTarget, setSubscriptionTarget] = useState("");

    // Report
    const [reportDialogOpen, setReportDialogOpen] = useState(false);
    const [viewReportDialogOpen, setViewReportDialogOpen] = useState(false);
    const [editingReport, setEditingReport] = useState<ChallengeReport | null>(null);
    const [viewingReport, setViewingReport] = useState<ChallengeReport | null>(null);
    // Updated: allow selecting both session and user in report form
    const [reportSessionId, setReportSessionId] = useState("");
    const [reportUserId, setReportUserId] = useState("");
    const [reportEvangelized, setReportEvangelized] = useState("");
    const [reportConverts, setReportConverts] = useState("");
    const [reportFollowedUp, setReportFollowedUp] = useState("");
    const [reportDifficulties, setReportDifficulties] = useState("");
    const [reportRemark, setReportRemark] = useState("");

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                navigate("/auth");
            } else if (!isAdmin) {
                toast({
                    title: "Access Denied",
                    description: "You don't have admin privileges.",
                    variant: "destructive",
                });
                navigate("/dashboard");
            } else {
                fetchAllData();
            }
        }
    }, [user, isAdmin, authLoading, navigate]);

    const fetchAllData = async () => {
        try {
            const [usersRes, sessionsRes, challengesRes, subsRes, reportsRes] = await Promise.all([
                userApi.getAllUsers(),
                sessionApi.getAll(),
                challengeApi.getAll(),
                subscriptionApi.getAll(),
                reportApi.getAll(),
            ]);
            setUsers(usersRes);
            setSessions(sessionsRes);
            setChallenges(challengesRes);
            setSubscriptions(subsRes);
            setReports(reportsRes);
        } catch (err) {
            console.error(err);
            toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    // ---------- Sessions ----------
    // Clicking name/description should open modal with details
    const openSessionDetailsModal = (session: Session) => {
        setViewingSession(session);
        setViewSessionDialogOpen(true);
    };

    const toggleViewSession = (session: Session) => {
        setExpandedSessionId(expandedSessionId === session.id ? null : (session.id || null));
    };

    const handleAddChallengeToSession = (sessionId?: string) => {
        setEditingChallenge(null);
        setChallengeName("");
        setChallengeDescription("");
        setChallengeTarget("");
        setChallengeType(ChallengeType.INDIVIDUAL);
        setChallengeSessionId(sessionId || "");
        setChallengeDialogOpen(true);
    };

    const handleChangeSessionStatus = async (sessionId?: string, status?: SessionStatus) => {
        if (!sessionId || !status) return;
        try {
            await sessionApi.updateStatus(sessionId, status.toString());
            toast({ title: "Session status updated" });
            fetchAllData();
        } catch (err: any) {
            toast({ title: "Error", description: isNonNullArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail, variant: "destructive" });
        }
    };

    const handleRemoveChallengeFromSession = async (sessionId?: string, challengeId?: string) => {
        if (!sessionId || !challengeId) return;
        try {
            await sessionApi.removeChallenge(sessionId, challengeId);
            toast({ title: "Challenge removed from session" });
            fetchAllData();
        } catch (err: any) {
            toast({ title: "Error", description: isNonNullArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail, variant: "destructive" });
        }
    };

    const handleSaveSession = async () => {
        // validation
        if (!Validators.required(sessionName)) {
            toast({ title: "Validation Error", description: "Session name is required", variant: "destructive" });
            return;
        }
        if (!Validators.isDate(sessionStartDate) || !Validators.isDate(sessionEndDate)) {
            toast({ title: "Validation Error", description: "Start and end dates must be valid", variant: "destructive" });
            return;
        }
        if (new Date(sessionStartDate) > new Date(sessionEndDate)) {
            toast({ title: "Validation Error", description: "Start date cannot be after end date", variant: "destructive" });
            return;
        }

        try {
            const sessionData = {
                name: sessionName,
                description: sessionDescription || null,
                startDate: `${sessionStartDate}T00:00:00`,
                endDate: `${sessionEndDate}T00:00:00`,
                status: sessionStatus,
            };
            if (editingSession) {
                await sessionApi.update(editingSession.id!, sessionData);
                toast({ title: "Session Updated" });
            } else {
                await sessionApi.create(sessionData);
                toast({ title: "Session Created" });
            }
            setSessionDialogOpen(false);
            resetSessionForm();
            fetchAllData();
        } catch (err: any) {
            toast({ title: "Error", description: isNonNullArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail, variant: "destructive" });
        }
    };

    const handleEditSession = (session: Session) => {
        setEditingSession(session);
        setSessionName(session.name);
        setSessionDescription(session.description || "");
        setSessionStartDate(session.startDate.split("T")[0]);
        setSessionEndDate(session.endDate.split("T")[0]);
        setSessionStatus(session.status);
        setSessionDialogOpen(true);
    };

    const handleDeleteSession = async (id?: string) => {
        if (!id) return;
        try {
            await sessionApi.delete(id);
            toast({ title: "Session Deleted" });
            fetchAllData();
        } catch (err: any) {
            toast({ title: "Error", description: isNonNullArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail, variant: "destructive" });
        }
    };

    const resetSessionForm = () => {
        setEditingSession(null);
        setSessionName("");
        setSessionDescription("");
        setSessionStartDate("");
        setSessionEndDate("");
        setSessionStatus(null);
    };

    // ---------- Challenges ----------
    // Clicking name/description should open modal with details
    const openChallengeDetailsModal = (challenge: Challenge) => {
        setViewingChallenge(challenge);
        setViewChallengeDialogOpen(true);
    };

    const toggleViewChallenge = (challenge: Challenge) => {
        setExpandedChallengeId(expandedChallengeId === challenge.id ? null : (challenge.id || null));
    };

    const handleAddExistingChallengeToSession = async (challengeId?: string, sessionId?: string) => {
        if (!challengeId || !sessionId) {
            toast({ title: "Error", description: "Select a session first", variant: "destructive" });
            return;
        }
        try {
            await sessionApi.addChallenge(sessionId, challengeId);
            toast({ title: "Challenge added to session" });
            fetchAllData();
        } catch (err: any) {
            toast({ title: "Error", description: isNonNullArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail, variant: "destructive" });
        }
    };

    const handleChangeChallengeType = async (challengeId?: string, type?: string) => {
        if (!challengeId || !type) return;
        try {
            await challengeApi.updateType(challengeId, type);
            toast({ title: "Challenge type updated" });
            fetchAllData();
        } catch (err: any) {
            toast({ title: "Error", description: isNonNullArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail, variant: "destructive" });
        }
    };

    const handleSaveChallenge = async () => {
        if (!Validators.required(challengeName)) {
            toast({ title: "Validation Error", description: "Challenge name is required", variant: "destructive" });
            return;
        }
        if (!Validators.isPositiveInteger(challengeTarget)) {
            toast({ title: "Validation Error", description: "Target must be a non-negative integer", variant: "destructive" });
            return;
        }

        try {
            const challengeData = {
                name: challengeName,
                description: challengeDescription || null,
                target: parseInt(challengeTarget) || 0,
                type: challengeType,
            };
            if (editingChallenge) {
                const resp = await challengeApi.update(editingChallenge.id!, challengeData);
                if (challengeSessionId && resp.success) {
                    await sessionApi.addChallenge(challengeSessionId, editingChallenge.id!);
                }
                toast({ title: "Challenge Updated" });
            } else {
                const resp = await challengeApi.create(challengeData);
                if (challengeSessionId && resp.success) {
                    await sessionApi.addChallenge(challengeSessionId, resp.data!.id!);
                }
                toast({ title: "Challenge Created" });
            }
            setChallengeDialogOpen(false);
            resetChallengeForm();
            fetchAllData();
        } catch (err: any) {
            toast({ title: "Error", description: isNonNullArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail, variant: "destructive" });
        }
    };

    const handleEditChallenge = (challenge: Challenge) => {
        setEditingChallenge(challenge);
        setChallengeName(challenge.name);
        setChallengeDescription(challenge.description || "");
        setChallengeTarget(challenge.target.toString());
        setChallengeType(challenge.type);
        setChallengeSessionId(challenge.sessions?.[0]?.id || "");
        setChallengeDialogOpen(true);
    };

    const handleDeleteChallenge = async (id?: string) => {
        if (!id) return;
        try {
            await challengeApi.delete(id);
            toast({ title: "Challenge Deleted" });
            fetchAllData();
        } catch (err: any) {
            toast({ title: "Error", description: isNonNullArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail, variant: "destructive" });
        }
    };

    const resetChallengeForm = () => {
        setEditingChallenge(null);
        setChallengeName("");
        setChallengeDescription("");
        setChallengeTarget("");
        setChallengeType(ChallengeType.INDIVIDUAL);
        setChallengeSessionId("");
    };

    // ---------- Users ----------
    const handleSaveUser = async () => {
        // If editingUser is null -> creating new user
        if (!editingUser) {
            // creation validation
            if (!Validators.required(userFirstName) || !Validators.required(userLastName) || !Validators.required(userEmail) || !Validators.required(userPassword)) {
                toast({ title: "Validation Error", description: "First name, last name, email and password are required", variant: "destructive" });
                return;
            }
            // simple email check
            if (!/^\S+@\S+\.\S+$/.test(userEmail)) {
                toast({ title: "Validation Error", description: "Email is invalid", variant: "destructive" });
                return;
            }

            try {
                // use RegisterRequest shape expected by userApi.create
                const payload = {
                    firstName: userFirstName,
                    lastName: userLastName,
                    email: userEmail,
                    password: userPassword,
                };
                await userApi.create(payload);
                toast({ title: "User Created" });
                setUserDialogOpen(false);
                resetUserForm();
                fetchAllData();
            } catch (err: any) {
                toast({ title: "Error", description: Array.isArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail, variant: "destructive" });
            }
            return;
        }

        // existing update flow when editingUser is set
        if (!Validators.required(userFirstName) || !Validators.required(userLastName)) {
            toast({ title: "Validation Error", description: "First and last name are required", variant: "destructive" });
            return;
        }

        try {
            await userApi.updateUserProfile(editingUser.id!, {
                firstName: userFirstName,
                lastName: userLastName,
                phoneNumber: userPhoneNumber,
                country: userCountry,
                region: userRegion,
                city: userCity,
            });
            if (editingUser.role !== userRole) {
                await userApi.assignNewRole(userEmail, userRole);
            }
            toast({ title: "User Updated" });
            setUserDialogOpen(false);
            resetUserForm();
            fetchAllData();
        } catch (err: any) {
            toast({ title: "Error", description: Array.isArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail, variant: "destructive" });
        }
    };

    const handleEditUser = (userProfile: User) => {
        setEditingUser(userProfile);
        setUserFirstName(userProfile.firstName || "");
        setUserLastName(userProfile.lastName || "");
        setUserEmail(userProfile.email || "");
        setUserRole(userProfile.role?.toString() || UserRole.USER);
        setUserPhoneNumber(userProfile.phoneNumber || "");
        setUserCountry(userProfile.country || "");
        setUserRegion(userProfile.region || "");
        setUserCity(userProfile.city || "");
        setUserDialogOpen(true);
    };

    let isUserEnabled = true;
    let isUserBlocked = false;
    // Clicking name/description should open modal with details
    const openUserDetailsModal = (u: User) => {
        setViewingUser(u);
        isUserEnabled = !!user.accountEnabled;
        isUserBlocked = !!user.accountBlocked;
        setViewUserDialogOpen(true);
    };



    const toggleViewUser = (user: User) => {
        setExpandedUserId(expandedUserId === user.id ? null : (user.id || null));
    };

    // New: expand/collapse user details in place via UserDetails component
    const handleToggleUserDetails = (u: User) => {
        // If already viewing this user, collapse it
        if (viewingUser && viewingUser.id === u.id) {
            setViewingUser(null);
            return;
        }
        // otherwise set viewing user (will render UserDetails)
        setViewingUser(u);
    };

    const handleViewUser = (u: User) => {
        // Eye toggles inline details
        handleToggleUserDetails(u);
    };

    const handleDeleteUser = async (id?: string) => {
        if (!id) return;
        try {
            await userApi.deleteUser(id);
            toast({ title: "User Deleted" });
            fetchAllData();
        } catch (err: any) {
            toast({ title: "Error", description: isNonNullArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail, variant: "destructive" });
        }
    };

    const resetUserForm = () => {
        setEditingUser(null);
        setUserFirstName("");
        setUserLastName("");
        setUserEmail("");
        setUserRole(UserRole.USER);
        setUserPhoneNumber("");
        setUserCountry("");
        setUserRegion("");
        setUserCity("");
        setUserPassword("");
    };

    const handleSubscribeUser = (userProfile: User) => {
        setSubscriptionUserId(userProfile.id || "");
        setSubscriptionChallengeId("");
        setSubscriptionTarget("");
        setEditingSubscription(null);
        setSubscriptionDialogOpen(true);
    };

    // ---------- Subscriptions ----------
    const handleSaveSubscription = async () => {
        if (!Validators.required(subscriptionUserId) || !Validators.required(subscriptionChallengeId)) {
            toast({ title: "Validation Error", description: "User and challenge are required", variant: "destructive" });
            return;
        }
        if (!Validators.isPositiveInteger(subscriptionTarget)) {
            toast({ title: "Validation Error", description: "Target must be a non-negative integer", variant: "destructive" });
            return;
        }
        try {
            const body: SubscriptionBody = {
                target: parseInt(subscriptionTarget, 10) || 0,
                challengeId: subscriptionChallengeId,
            };
            if (editingSubscription) {
                await subscriptionApi.update(editingSubscription.id!, body);
                toast({ title: "Subscription Updated" });
            } else {
                await subscriptionApi.createForUser(subscriptionUserId, body);
                toast({ title: "Subscription Created" });
            }
            setSubscriptionDialogOpen(false);
            resetSubscriptionForm();
            fetchAllData();
        } catch (err: any) {
            toast({ title: "Error", description: isNonNullArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail, variant: "destructive" });
        }
    };

    const handleEditSubscription = (s: Subscription) => {
        setEditingSubscription(s);
        setSubscriptionUserId(s.userId);
        setSubscriptionChallengeId(s.challengeId);
        setSubscriptionTarget(s.target.toString());
        setSubscriptionDialogOpen(true);
    };

    const handleViewSubscription = (s: Subscription) => {
        setViewingSubscription(s);
        setViewSubscriptionDialogOpen(true);
    };

    const handleDeleteSubscription = async (id?: string) => {
        if (!id) return;
        try {
            await subscriptionApi.delete(id);
            toast({ title: "Subscription Deleted" });
            fetchAllData();
        } catch (err: any) {
            toast({ title: "Error", description: isNonNullArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail, variant: "destructive" });
        }
    };

    const resetSubscriptionForm = () => {
        setEditingSubscription(null);
        setSubscriptionUserId("");
        setSubscriptionChallengeId("");
        setSubscriptionTarget("");
    };

    // ---------- Reports ----------
    // Modified to allow selecting session and user in add/update form.
    const handleSaveReport = async () => {
        if (!Validators.isPositiveInteger(reportEvangelized) || !Validators.isPositiveInteger(reportConverts) || !Validators.isPositiveInteger(reportFollowedUp)) {
            toast({ title: "Validation Error", description: "Numeric report fields must be non-negative integers", variant: "destructive" });
            return;
        }
        if (!Validators.required(reportUserId) || !Validators.required(reportSessionId)) {
            toast({ title: "Validation Error", description: "User and session selection required", variant: "destructive" });
            return;
        }
        try {
            const body: ReportRequestBody = {
                numberEvangelizedTo: parseInt(reportEvangelized, 10) || 0,
                numberOfNewConverts: parseInt(reportConverts, 10) || 0,
                numberFollowedUp: parseInt(reportFollowedUp, 10) || 0,
                difficulties: reportDifficulties || undefined,
                remark: reportRemark || undefined,
            };
            if (editingReport) {
                await reportApi.updateForUser(editingReport.id!, body);
                toast({ title: "Report Updated" });
            } else {
                // createForUser expects (userId, sessionId, data)
                await reportApi.createForUser(reportUserId, reportSessionId, body);
                toast({ title: "Report Created" });
            }
            setReportDialogOpen(false);
            resetReportForm();
            fetchAllData();
        } catch (err: any) {
            toast({ title: "Error", description: isNonNullArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail, variant: "destructive" });
        }
    };

    const handleEditReport = (r: ChallengeReport) => {
        setEditingReport(r);
        setReportSessionId(r.subscriptionId);
        setReportUserId(r.subscription?.userId || "");
        setReportEvangelized(r.numberEvangelizedTo.toString());
        setReportConverts(r.numberOfNewConverts.toString());
        setReportFollowedUp(r.numberFollowedUp.toString());
        setReportDifficulties(r.difficulties || "");
        setReportRemark(r.remark || "");
        setReportDialogOpen(true);
    };

    const handleViewReport = (r: ChallengeReport) => {
        setViewingReport(r);
        setViewReportDialogOpen(true);
    };

    const handleDeleteReport = async (id?: string) => {
        if (!id) return;
        try {
            await reportApi.delete(id);
            toast({ title: "Report Deleted" });
            fetchAllData();
        } catch (err: any) {
            toast({ title: "Error", description: isNonNullArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail, variant: "destructive" });
        }
    };

    const resetReportForm = () => {
        setEditingReport(null);
        setViewingReport(null);
        setReportSessionId("");
        setReportUserId("");
        setReportEvangelized("");
        setReportConverts("");
        setReportFollowedUp("");
        setReportDifficulties("");
        setReportRemark("");
    };

    const handleSignOut = async () => {
        await signOut();
        navigate("/");
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-heavenly">
                <div className="animate-pulse text-primary">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-heavenly">
            <header className="bg-primary shadow-gentle">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-divine rounded-full flex items-center justify-center">
                            <Shield className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold text-primary-foreground">Admin Panel</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-primary-foreground hover:bg-primary-foreground/10">
                            <Home className="w-4 h-4 mr-2" />
                            Home
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="text-primary-foreground hover:bg-primary-foreground/10">
                            <Heart className="w-4 h-4 mr-2" />
                            Dashboard
                        </Button>
                        <Button variant="heavenly" size="sm" onClick={handleSignOut}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-foreground mb-8">Administration</h1>

                <Tabs defaultValue="sessions" className="w-full">
                    <TabsList className="grid w-full max-w-3xl grid-cols-5 mb-8">
                        <TabsTrigger value="sessions" className="text-xs sm:text-sm">
                            <Calendar className="w-4 h-4 mr-1 hidden sm:inline" />
                            Sessions
                        </TabsTrigger>
                        <TabsTrigger value="challenges" className="text-xs sm:text-sm">
                            <Target className="w-4 h-4 mr-1 hidden sm:inline" />
                            Challenges
                        </TabsTrigger>
                        <TabsTrigger value="users" className="text-xs sm:text-sm">
                            <Users className="w-4 h-4 mr-1 hidden sm:inline" />
                            Users
                        </TabsTrigger>
                        <TabsTrigger value="subscriptions" className="text-xs sm:text-sm">
                            <BookOpen className="w-4 h-4 mr-1 hidden sm:inline" />
                            Subs
                        </TabsTrigger>
                        <TabsTrigger value="reports" className="text-xs sm:text-sm">
                            <FileText className="w-4 h-4 mr-1 hidden sm:inline" />
                            Reports
                        </TabsTrigger>
                    </TabsList>

                    {/* Sessions Tab */}
                    <TabsContent value="sessions">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Sessions ({sessions.length})</h2>
                            <div className="flex gap-2">
                                <Dialog open={sessionDialogOpen} onOpenChange={setSessionDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button onClick={resetSessionForm}>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Session
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>{editingSession ? "Edit Session" : "Create Session"}</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label>Name</Label>
                                                <Input value={sessionName} onChange={(e) => setSessionName(e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Description</Label>
                                                <Textarea value={sessionDescription} onChange={(e) => setSessionDescription(e.target.value)} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Start Date</Label>
                                                    <Input type="date" value={sessionStartDate} onChange={(e) => setSessionStartDate(e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>End Date</Label>
                                                    <Input type="date" value={sessionEndDate} onChange={(e) => setSessionEndDate(e.target.value)} />
                                                </div>
                                            </div>
                                            {editingSession && (
                                                <div className="space-y-2">
                                                    <Label>Status</Label>
                                                    <Select value={sessionStatus.toString() || SessionStatus.INACTIVE.toString()} onValueChange={setSessionStatus}>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value={SessionStatus.UPCOMING}>Upcoming</SelectItem>
                                                            <SelectItem value={SessionStatus.ONGOING}>Ongoing</SelectItem>
                                                            <SelectItem value={SessionStatus.PAUSED}>Paused</SelectItem>
                                                            <SelectItem value={SessionStatus.ENDED}>Ended</SelectItem>
                                                            <SelectItem value={SessionStatus.INACTIVE}>Inactive</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}
                                            <DialogFooter>
                                                <Button onClick={handleSaveSession} className="w-full">
                                                    {editingSession ? "Update Session" : "Create Session"}
                                                </Button>
                                            </DialogFooter>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {sessions.map((session) => (
                                <Card key={session.id} className="shadow-gentle hover:shadow-md transition-shadow">
                                    <CardContent className="py-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <h3
                                                        className="font-semibold text-lg cursor-pointer"
                                                        onClick={() => openSessionDetailsModal(session)}
                                                    >
                                                        {session.name}
                                                    </h3>
                                                    <Badge variant={session.status === SessionStatus.ONGOING ? "default" : "secondary"}>
                                                        {session.status?.toString()}
                                                    </Badge>
                                                </div>
                                                <p
                                                    className="text-sm text-muted-foreground mt-1 line-clamp-2 cursor-pointer"
                                                    onClick={() => openSessionDetailsModal(session)}
                                                >
                                                    {session.description}
                                                </p>
                                                <div className="flex items-center gap-4 mt-2">
                                                  <span className="text-xs text-muted-foreground">
                                                    📅 {new Date(session.startDate).toLocaleDateString()} - {new Date(session.endDate).toLocaleDateString()}
                                                  </span>
                                                    {session.challenges && (
                                                        <span className="text-xs text-muted-foreground">🎯 {session.challenges.length} challenges</span>
                                                    )}
                                                </div>

                                                {expandedSessionId === session.id && (
                                                    <SessionDetails
                                                        session={session}
                                                        allSessions={sessions}
                                                        onAddChallenge={handleAddChallengeToSession}
                                                        onChangeStatus={handleChangeSessionStatus}
                                                        onRemoveChallenge={(sessId, chId) => handleRemoveChallengeFromSession(sessId, chId)}
                                                        onToggleViewChallenge={(ch) => toggleViewChallenge(ch)}
                                                    />
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="sm" onClick={() => toggleViewSession(session)} title="View">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleEditSession(session)} title="Edit">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <ConfirmRemoveDialog
                                                        trigger={<Button variant="ghost" size="sm" title="Delete"><Trash2 className="w-4 h-4 text-destructive" /></Button>}
                                                        title={`Delete session "${session.name}"`}
                                                        description={`This will delete the session and associated data. Continue?`}
                                                        confirmLabel="Delete"
                                                        onConfirm={() => handleDeleteSession(session.id)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Session Details Modal */}
                        <Dialog open={viewSessionDialogOpen} onOpenChange={setViewSessionDialogOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Session Details</DialogTitle>
                                </DialogHeader>
                                <div className="py-2">
                                    {viewingSession ? (
                                        <SessionDetails
                                            session={viewingSession}
                                            allSessions={sessions}
                                            onAddChallenge={handleAddChallengeToSession}
                                            onChangeStatus={handleChangeSessionStatus}
                                            onRemoveChallenge={(sessId, chId) => handleRemoveChallengeFromSession(sessId, chId)}
                                            onToggleViewChallenge={(ch) => toggleViewChallenge(ch)}
                                        />
                                    ) : (
                                        <div>No session selected</div>
                                    )}
                                </div>
                                <DialogFooter>
                                    <Button onClick={() => setViewSessionDialogOpen(false)}>Close</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </TabsContent>

                    {/* Challenges */}
                    <TabsContent value="challenges">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Challenges ({challenges.length})</h2>
                            <div className="flex gap-2">
                                <Dialog open={challengeDialogOpen} onOpenChange={setChallengeDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button onClick={resetChallengeForm}>
                                            <Plus className="w-4 h-4 mr-2" /> Add Challenge
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>{editingChallenge ? "Edit Challenge" : "Create Challenge"}</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label>Name</Label>
                                                <Input value={challengeName} onChange={(e) => setChallengeName(e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Description</Label>
                                                <Textarea value={challengeDescription} onChange={(e) => setChallengeDescription(e.target.value)} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label>Target (souls)</Label>
                                                    <Input type="number" value={challengeTarget} onChange={(e) => setChallengeTarget(e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Type</Label>
                                                    <Select value={challengeType?.toString()} onValueChange={setChallengeType}>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value={ChallengeType.NORMAL}>Normal</SelectItem>
                                                            <SelectItem value={ChallengeType.EVENT}>Event</SelectItem>
                                                            <SelectItem value={ChallengeType.INDIVIDUAL}>Individual</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Session</Label>
                                                <Select value={challengeSessionId} onValueChange={setChallengeSessionId}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a session" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {sessions.map((s) => (
                                                            <SelectItem key={s.id} value={s.id}>
                                                                {s.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <DialogFooter>
                                                <Button onClick={handleSaveChallenge} className="w-full">
                                                    {editingChallenge ? "Update" : "Create"}
                                                </Button>
                                            </DialogFooter>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {challenges.map((challenge) => {
                                const session = sessions.find((s) => challenge.sessions && challenge.sessions.some((cs) => cs.id === s.id));
                                return (
                                    <Card key={challenge.id} className="shadow-gentle">
                                        <CardContent className="py-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h3
                                                        className="font-semibold cursor-pointer"
                                                        onClick={() => openChallengeDetailsModal(challenge)}
                                                    >
                                                        {challenge.name}
                                                    </h3>
                                                    <p
                                                        className="text-sm text-muted-foreground"
                                                        onClick={() => openChallengeDetailsModal(challenge)}
                                                    >
                                                        {challenge.description}
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <Badge variant="outline">{challenge.type?.toString()}</Badge>
                                                        <span className="text-xs text-muted-foreground">Target: {challenge.target}</span>
                                                        {session && <span className="text-xs text-muted-foreground">Session: {session.name}</span>}
                                                    </div>

                                                    {expandedChallengeId === challenge.id && (
                                                        <ChallengeDetails
                                                            challenge={challenge}
                                                            sessions={sessions}
                                                            onAddToSession={handleAddExistingChallengeToSession}
                                                            onChangeType={handleChangeChallengeType}
                                                        />
                                                    )}
                                                </div>

                                                <div className="flex gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => toggleViewChallenge(challenge)}>
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleEditChallenge(challenge)}>
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <ConfirmRemoveDialog
                                                        trigger={<Button variant="ghost" size="sm"><Trash2 className="w-4 h-4 text-destructive" /></Button>}
                                                        title={`Delete "${challenge.name}"`}
                                                        description={`This will delete the challenge and related subscriptions. Continue?`}
                                                        confirmLabel="Delete"
                                                        onConfirm={() => handleDeleteChallenge(challenge.id)}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Challenge Details Modal */}
                        <Dialog open={viewChallengeDialogOpen} onOpenChange={setViewChallengeDialogOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Challenge Details</DialogTitle>
                                </DialogHeader>
                                <div className="py-2">

                                    {viewingChallenge && (
                                    <div className="py-2">
                                        <div className="text-sm"><strong>Name:</strong> {viewingChallenge?.name} </div>
                                        <div className="text-sm"><strong>Description:</strong> {viewingChallenge?.description}</div>
                                        <div className="text-sm"><strong>Type:</strong> {viewingChallenge?.type?.toString()}</div>
                                        <div className="text-sm"><strong>Target:</strong> {viewingChallenge?.target}</div>
                                        <div className="text-sm"><strong>Number of Sessions:</strong> {viewingChallenge?.sessions?.length}</div>
                                        <div className="text-sm"><strong>Created On:</strong> {viewingChallenge?.createdOn} </div>
                                        <div className="text-sm"><strong>Updated On:</strong> {viewingChallenge?.updatedOn} </div>
                                    </div>
                                    )}
                                </div>
                                <DialogFooter>
                                    <Button onClick={() => setViewChallengeDialogOpen(false)}>Close</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </TabsContent>

                    {/* Users */}
                    <TabsContent value="users">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Users ({users.length})</h2>
                            <div className="flex gap-2">
                                <Button onClick={() => { resetUserForm(); setUserDialogOpen(true); }}>
                                    <Plus className="w-4 h-4 mr-2" /> Add User
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {users.map((u) => (
                                <div key={u.id}>
                                    <Card className="shadow-gentle">
                                        <CardContent className="py-4">
                                            <div className="flex items-center justify-between">
                                                <div onClick={() => openUserDetailsModal(u)} className="cursor-pointer">
                                                    <h3 className="font-semibold">{u.firstName} {u.lastName}</h3>
                                                    <p className="text-sm text-muted-foreground">{u.email}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => toggleViewUser(u)}>
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleEditUser(u)}>
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <ConfirmRemoveDialog
                                                        trigger={<Button variant="ghost" size="sm"><Trash2 className="w-4 h-4 text-destructive" /></Button>}
                                                        title={`Delete "${u.firstName} ${u.lastName}"`}
                                                        description={`This will delete the user. Continue?`}
                                                        confirmLabel="Delete"
                                                        onConfirm={() => handleDeleteUser(u.id)}
                                                    />
                                                    <Button size="sm" onClick={() => handleSubscribeUser(u)}>Subscribe</Button>
                                                </div>
                                            </div>
                                        </CardContent>

                                        {/* Inline expanded user details (collapsible) */}
                                        {/*{viewingUser && viewingUser.id === u.id && (*/}
                                            {expandedUserId === u.id && (
                                            <div className="border-t px-4 py-3">
                                                <UserDetails
                                                    user={u}
                                                    onRoleChanged={async (newRole) => {
                                                        try {
                                                            await userApi.assignNewRole(u.email!, newRole);
                                                            toast({ title: "Role updated" });
                                                            fetchAllData();
                                                        } catch (err: any) {
                                                            toast({ title: "Error", description: isNonNullArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail, variant: "destructive" });
                                                        }
                                                    }}
                                                    onToggleBlock={async () => {
                                                        try {
                                                            await userApi.toggleBlock(u.id!);
                                                            toast({ title: "User block state toggled" });
                                                            fetchAllData();
                                                        } catch (err: any) {
                                                            toast({ title: "Error", description: isNonNullArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail, variant: "destructive" });
                                                        }
                                                    }}
                                                    onEnableUser={async () => {
                                                        try {
                                                            await userApi.enableUser(u.id!);
                                                            toast({ title: "User enabled" });
                                                            fetchAllData();
                                                        } catch (err: any) {
                                                            toast({ title: "Error", description: isNonNullArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail, variant: "destructive" });
                                                        }
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </Card>
                                </div>
                            ))}
                        </div>


                        <Dialog open={viewUserDialogOpen} onOpenChange={setViewUserDialogOpen}>
                            <DialogContent>
                                <DialogHeader><DialogTitle>User Details</DialogTitle></DialogHeader>
                                <div className="py-2">
                                    <div className="text-sm"><strong>Name:</strong> {viewingUser?.firstName} {viewingUser?.lastName}</div>
                                    <div className="text-sm"><strong>Email:</strong> {viewingUser?.email}</div>
                                    <div className="text-sm"><strong>Role:</strong> {viewingUser?.role?.toString()}</div>
                                    <div className="text-sm"><strong>Phone:</strong> {viewingUser?.phoneNumber}</div>
                                    <div className="text-sm"><strong>Location:</strong> {viewingUser?.city}, {viewingUser?.region}, {viewingUser?.country}</div>
                                    <div className="text-sm"><strong>Enabled:</strong> {viewingUser?.accountEnabled  ? "Yes" : "No"} </div>
                                    <div className="text-sm"><strong>Blocked:</strong> {viewingUser?.accountBlocked ? "Yes" : "No"} </div>
                                    <div className="text-sm"><strong>Created On:</strong> {viewingUser?.createdOn} </div>
                                    <div className="text-sm"><strong>Updated On:</strong> {viewingUser?.updatedOn} </div>
                                </div>
                                <DialogFooter><Button onClick={() => setViewUserDialogOpen(false)}>Close</Button></DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </TabsContent>

                    {/* Subscriptions */}
                    <TabsContent value="subscriptions">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Subscriptions ({subscriptions.length})</h2>
                            <div className="flex gap-2">
                                <Button onClick={() => { resetSubscriptionForm(); setSubscriptionDialogOpen(true); }}>
                                    <Plus className="w-4 h-4 mr-2" /> Add Subscription
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {subscriptions.map((s) => {
                                const c = challenges.find((c) => c.id === s.challengeId);
                                const u = users.find((u) => u.id === s.userId);
                                return (
                                    <Card key={s.id} className="shadow-gentle">
                                        <CardContent className="py-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-semibold">{u?.firstName || "Unknown"} → {c?.name || "Unknown"}</h3>
                                                    <p className="text-sm text-muted-foreground">Target: {s.target}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => handleViewSubscription(s)}><Eye className="w-4 h-4" /></Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleEditSubscription(s)}><Edit className="w-4 h-4" /></Button>
                                                    <ConfirmRemoveDialog
                                                        trigger={<Button variant="ghost" size="sm"><Trash2 className="w-4 h-4 text-destructive" /></Button>}
                                                        title={`Delete subscription`}
                                                        description={`Delete subscription for ${u?.firstName || "Unknown"}?`}
                                                        confirmLabel="Delete"
                                                        onConfirm={() => handleDeleteSubscription(s.id)}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        <Dialog open={viewSubscriptionDialogOpen} onOpenChange={setViewSubscriptionDialogOpen}>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Subscription Details</DialogTitle></DialogHeader>
                                <div className="py-2">
                                    <div className="text-sm"><strong>User:</strong> {viewingSubscription ? users.find(u => u.id === viewingSubscription.userId)?.firstName : ""}</div>
                                    <div className="text-sm"><strong>Challenge:</strong> {viewingSubscription ? challenges.find(c => c.id === viewingSubscription.challengeId)?.name : ""}</div>
                                    <div className="text-sm"><strong>Target:</strong> {viewingSubscription?.target}</div>
                                </div>
                                <DialogFooter><Button onClick={() => setViewSubscriptionDialogOpen(false)}>Close</Button></DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </TabsContent>

                    {/* Reports */}
                    <TabsContent value="reports">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Reports ({reports.length})</h2>
                            <div className="flex gap-2">
                                <Button onClick={() => { resetReportForm(); setReportDialogOpen(true); }}>
                                    <Plus className="w-4 h-4 mr-2" /> Add Report
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {reports.map((r) => (
                                <Card key={r.id} className="shadow-gentle">
                                    <CardContent className="py-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="grid grid-cols-3 gap-4 text-sm">
                                                    <div><span className="text-muted-foreground">Evangelized:</span> {r.numberEvangelizedTo}</div>
                                                    <div><span className="text-muted-foreground">Converts:</span> {r.numberOfNewConverts}</div>
                                                    <div><span className="text-muted-foreground">Followed up:</span> {r.numberFollowedUp}</div>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-2">Date: {r.reportDate}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => handleViewReport(r)}><Eye className="w-4 h-4" /></Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleEditReport(r)}><Edit className="w-4 h-4" /></Button>
                                                <ConfirmRemoveDialog
                                                    trigger={<Button variant="ghost" size="sm"><Trash2 className="w-4 h-4 text-destructive" /></Button>}
                                                    title={`Delete report`}
                                                    description={`Delete this report?`}
                                                    confirmLabel="Delete"
                                                    onConfirm={() => handleDeleteReport(r.id)}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <Dialog open={viewReportDialogOpen} onOpenChange={setViewReportDialogOpen}>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Report Details</DialogTitle></DialogHeader>
                                <div className="py-2">
                                    <div className="text-sm"><strong>Evangelized:</strong> {viewingReport?.numberEvangelizedTo}</div>
                                    <div className="text-sm"><strong>Converts:</strong> {viewingReport?.numberOfNewConverts}</div>
                                    <div className="text-sm"><strong>Followed up:</strong> {viewingReport?.numberFollowedUp}</div>
                                    <div className="text-sm"><strong>Difficulties:</strong> {viewingReport?.difficulties}</div>
                                    <div className="text-sm"><strong>Remark:</strong> {viewingReport?.remark}</div>
                                </div>
                                <DialogFooter><Button onClick={() => setViewReportDialogOpen(false)}>Close</Button></DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </TabsContent>
                </Tabs>
            </main>

            {/* Reused dialogs: user, challenge, subscription, report */}
            {/* User dialog */}
            <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingUser ? "Edit User" : "Create User"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>First name</Label>
                                <Input value={userFirstName} onChange={(e) => setUserFirstName(e.target.value)} />
                            </div>
                            <div>
                                <Label>Last name</Label>
                                <Input value={userLastName} onChange={(e) => setUserLastName(e.target.value)} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                        </div>

                        {!editingUser && (
                            <div className="space-y-2">
                                <Label>Password</Label>
                                <Input type="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} />
                            </div>
                        )}

                        {editingUser && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Role</Label>
                                    <Select value={userRole} onValueChange={setUserRole}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={UserRole.USER}>User</SelectItem>
                                            <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                                            <SelectItem value={UserRole.SUPER_ADMIN}>Super Admin</SelectItem>
                                            <SelectItem value={UserRole.ECOMIEST}>Ecomiest</SelectItem>
                                            <SelectItem value={UserRole.COACH}>Coach</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label>Phone</Label>
                                    <Input value={userPhoneNumber} onChange={(e) => setUserPhoneNumber(e.target.value)} />
                                </div>
                            </div>
                        )}

                        {editingUser && (
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label>Country</Label>
                                    <Input value={userCountry} onChange={(e) => setUserCountry(e.target.value)} />
                                </div>
                                <div>
                                    <Label>Region</Label>
                                    <Input value={userRegion} onChange={(e) => setUserRegion(e.target.value)} />
                                </div>
                                <div>
                                    <Label>City</Label>
                                    <Input value={userCity} onChange={(e) => setUserCity(e.target.value)} />
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            <Button onClick={handleSaveUser} className="w-full">{editingUser ? "Update User" : "Create User"}</Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Challenge dialog */}
            <Dialog open={challengeDialogOpen} onOpenChange={setChallengeDialogOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{editingChallenge ? "Edit Challenge" : "Create Challenge"}</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2"><Label>Name</Label><Input value={challengeName} onChange={(e) => setChallengeName(e.target.value)} /></div>
                        <div className="space-y-2"><Label>Description</Label><Textarea value={challengeDescription} onChange={(e) => setChallengeDescription(e.target.value)} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>Target (souls)</Label><Input type="number" value={challengeTarget} onChange={(e) => setChallengeTarget(e.target.value)} /></div>
                            <div className="space-y-2"><Label>Type</Label>
                                <Select value={challengeType?.toString()} onValueChange={setChallengeType}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={ChallengeType.NORMAL}>Normal</SelectItem>
                                        <SelectItem value={ChallengeType.EVENT}>Event</SelectItem>
                                        <SelectItem value={ChallengeType.INDIVIDUAL}>Individual</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Session</Label>
                            <Select value={challengeSessionId} onValueChange={setChallengeSessionId}>
                                <SelectTrigger><SelectValue placeholder="Select a session" /></SelectTrigger>
                                <SelectContent>{sessions.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <DialogFooter><Button onClick={handleSaveChallenge} className="w-full">{editingChallenge ? "Update" : "Create"}</Button></DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Subscription dialog */}
            <Dialog open={subscriptionDialogOpen} onOpenChange={setSubscriptionDialogOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{editingSubscription ? "Edit Subscription" : "Create Subscription"}</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>User</Label>
                            <Select value={subscriptionUserId} onValueChange={setSubscriptionUserId}>
                                <SelectTrigger><SelectValue placeholder="Select a user" /></SelectTrigger>
                                <SelectContent>{users.map(u => <SelectItem key={u.id} value={u.id}>{u.firstName} {u.lastName}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Challenge</Label>
                            <Select value={subscriptionChallengeId} onValueChange={setSubscriptionChallengeId}>
                                <SelectTrigger><SelectValue placeholder="Select a challenge" /></SelectTrigger>
                                <SelectContent>{challenges.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2"><Label>Target</Label><Input type="number" value={subscriptionTarget} onChange={(e) => setSubscriptionTarget(e.target.value)} /></div>
                        <DialogFooter><Button onClick={handleSaveSubscription} className="w-full">{editingSubscription ? "Update" : "Create"}</Button></DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Report dialog - now includes selects for session and user */}
            <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{editingReport ? "Edit Report" : "Create Report"}</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Session</Label>
                            <Select value={reportSessionId} onValueChange={setReportSessionId}>
                                <SelectTrigger><SelectValue placeholder="Select session" /></SelectTrigger>
                                <SelectContent>{sessions.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>User</Label>
                            <Select value={reportUserId} onValueChange={setReportUserId}>
                                <SelectTrigger><SelectValue placeholder="Select user" /></SelectTrigger>
                                <SelectContent>{users.map(u => <SelectItem key={u.id} value={u.id}>{u.firstName} {u.lastName}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2"><Label>Evangelized</Label><Input type="number" value={reportEvangelized} onChange={(e) => setReportEvangelized(e.target.value)} /></div>
                            <div className="space-y-2"><Label>Converts</Label><Input type="number" value={reportConverts} onChange={(e) => setReportConverts(e.target.value)} /></div>
                            <div className="space-y-2"><Label>Followed up</Label><Input type="number" value={reportFollowedUp} onChange={(e) => setReportFollowedUp(e.target.value)} /></div>
                        </div>

                        <div className="space-y-2"><Label>Difficulties</Label><Textarea value={reportDifficulties} onChange={(e) => setReportDifficulties(e.target.value)} /></div>
                        <div className="space-y-2"><Label>Remark</Label><Textarea value={reportRemark} onChange={(e) => setReportRemark(e.target.value)} /></div>

                        <DialogFooter><Button onClick={handleSaveReport} className="w-full">{editingReport ? "Update" : "Create"}</Button></DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Admin;