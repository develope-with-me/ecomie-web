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
import { useTranslation } from "react-i18next";
import {
    Users,
    Calendar,
    Target,
    FileText,
    Heart,
    Plus,
    Edit,
    Trash2,
    BookOpen,
    Eye,
    X, LayoutDashboard,
} from "lucide-react";
import { isNonNullArray, formatDate, computeUserName } from "@/lib/utils";
import SessionDetails from "@/components/SessionDetails";
import ChallengeDetails from "@/components/ChallengeDetails";
import ConfirmRemoveDialog from "@/components/ConfirmRemoveDialog";
import Validators from "@/components/Validators";
import UserDetails from "@/components/UserDetails";
import ReportsCalendar from "@/components/ReportsCalendar";
import Header from "@/components/home/Header";

const Admin = () => {
    const { user, isAdmin, signOut, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { t } = useTranslation();

    const [users, setUsers] = useState<User[]>([]);
    const [ongoingSessionUsers, setOngoingSessionUsers] = useState<User[]>([]);
    const [ongoingSessionSubscriptions, setOngoingSessionSubscriptions] = useState<Subscription[]>([]);
    const [ongoingSession, setOngoingSession] = useState<Session | null>(null);
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
    const [userAvatar, setUserAvatar] = useState<File | null>(null);
    const [userAvatarPreview, setUserAvatarPreview] = useState<string | null>(null);

    // Subscription
    const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);
    const [viewSubscriptionDialogOpen, setViewSubscriptionDialogOpen] = useState(false);
    const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
    const [viewingSubscription, setViewingSubscription] = useState<Subscription | null>(null);
    const [subscriptionUserId, setSubscriptionUserId] = useState("");
    const [subscriptionChallengeId, setSubscriptionChallengeId] = useState("");
    const [subscriptionTarget, setSubscriptionTarget] = useState("");
    const [userName, setUserName] = useState("");
    const [concernedUser, setConcernedUser] = useState<User | null>(null);
    const [concernedSession, setConcernedSession] = useState<Session | null>(null);
    const [concernedSubscription, setConcernedSubscription] = useState<Subscription | null>(null);
    const [concernedChallenge, setConcernedChallenge] = useState<Challenge | null>(null);

    // Report
    const [reportDialogOpen, setReportDialogOpen] = useState(false);
    const [viewReportDialogOpen, setViewReportDialogOpen] = useState(false);
    const [editingReport, setEditingReport] = useState<ChallengeReport | null>(null);
    const [viewingReport, setViewingReport] = useState<ChallengeReport | null>(null);
    // Updated: allow selecting both session and user in report form
    const [reportSubscriptionId, setReportSubscriptionId] = useState("");
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
                    title: t("admin.accessDenied"),
                    description: t("admin.noAdminPrivileges"),
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
            const fetchUsers = userApi.getAllUsers().catch((err) => {
                console.error("Failed to fetch users:", err);
                return []; // or another fallback value like []
            });

            const fetchSessions = sessionApi.getAll().catch((err) => {
                console.error("Failed to fetch sessions:", err);
                return []; // or another fallback value like []
            });

            const fetchChallenges = challengeApi.getAll().catch((err) => {
                console.error("Failed to fetch challenges:", err);
                return []; // or another fallback value like []
            });

            const fetchSubscriptions = subscriptionApi.getAll().catch((err) => {
                console.error("Failed to fetch subscriptions:", err);
                return []; // or another fallback value like []
            });

            const fetchReports = reportApi.getAll().catch((err) => {
                console.error("Failed to fetch reports:", err);
                return []; // or another fallback value like []
            });

            const fetchOngoingSession = sessionApi.getOngoingSession().catch((err) => {
                console.error("Failed to fetch ongoing session:", err);
                return null; // or another fallback value like []
            });

            const fetchOngoingSessionUsers = userApi.getOngoingSessionUsers().catch((err) => {
                console.error("Failed to fetch ongoing session users:", err);
                return []; // or another fallback value like []
            });

            const fetchOngoingSessionSubscriptions = subscriptionApi.getAll(true).catch((err) => {
                console.error("Failed to fetch ongoing session subscriptions:", err);
                return []; // or another fallback value like []
            });

            // Use Promise.all to run all fetch operations concurrently
            const [
                usersRes,
                sessionsRes,
                challengesRes,
                subsRes,
                reportsRes,
                ongoingSessionRes,
                ongoingSessionUsersRes,
                ongoingSessionSubscriptionRes,
            ] = await Promise.all([
                fetchUsers,
                fetchSessions,
                fetchChallenges,
                fetchSubscriptions,
                fetchReports,
                fetchOngoingSession,
                fetchOngoingSessionUsers,
                fetchOngoingSessionSubscriptions,
            ]);

            // Set states with the potentially null values
            setUsers(usersRes);
            setSessions(sessionsRes);
            setChallenges(challengesRes);
            setSubscriptions(subsRes);
            setReports(reportsRes);
            setOngoingSession(ongoingSessionRes);
            setOngoingSessionUsers(ongoingSessionUsersRes);
            setOngoingSessionSubscriptions(ongoingSessionSubscriptionRes);
        } catch (err) {
            console.error(err);
            toast({ title: t("common.error"), description: t("admin.failedToLoadData"), variant: "destructive" });
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
            toast({ title: t("admin.sessionStatusUpdated") });
            fetchAllData();
        } catch (err: any) {
            toast({ title: "Error", description: isNonNullArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail, variant: "destructive" });
        }
    };

    const handleRemoveChallengeFromSession = async (sessionId?: string, challengeId?: string) => {
        if (!sessionId || !challengeId) return;
        try {
            await sessionApi.removeChallenge(sessionId, challengeId);
            toast({ title: t("admin.challengeRemovedFromSession") });
            fetchAllData();
        } catch (err: any) {
            toast({ title: "Error", description: isNonNullArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail, variant: "destructive" });
        }
    };

    const handleSaveSession = async () => {
        // validation
        if (!Validators.required(sessionName)) {
            toast({ title: t("common.error"), description: t("admin.name") + " is required", variant: "destructive" });
            return;
        }
        if (!Validators.isDate(sessionStartDate) || !Validators.isDate(sessionEndDate)) {
            toast({ title: t("common.error"), description: t("admin.startDate") + " and " + t("admin.endDate") + " must be valid", variant: "destructive" });
            return;
        }
        if (new Date(sessionStartDate) > new Date(sessionEndDate)) {
            toast({ title: t("common.error"), description: t("admin.startDate") + " cannot be after " + t("admin.endDate"), variant: "destructive" });
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
                toast({ title: t("admin.sessionUpdated") });
            } else {
                await sessionApi.create(sessionData);
                toast({ title: t("admin.sessionCreated") });
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
            toast({ title: t("admin.sessionDeleted") });
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
            toast({ title: t("common.error"), description: t("admin.selectSession"), variant: "destructive" });
            return;
        }
        try {
            await sessionApi.addChallenge(sessionId, challengeId);
            toast({ title: t("admin.challengeAddedToSession") });
            fetchAllData();
        } catch (err: any) {
            toast({ title: "Error", description: isNonNullArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail, variant: "destructive" });
        }
    };

    const handleChangeChallengeType = async (challengeId?: string, type?: string) => {
        if (!challengeId || !type) return;
        try {
            await challengeApi.updateType(challengeId, type);
            toast({ title: t("admin.challengeTypeUpdated") });
            fetchAllData();
        } catch (err: any) {
            toast({ title: "Error", description: isNonNullArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail, variant: "destructive" });
        }
    };

    const handleSaveChallenge = async () => {
        if (!Validators.required(challengeName)) {
            toast({ title: t("common.error"), description: t("admin.name") + " is required", variant: "destructive" });
            return;
        }
        if (!Validators.isPositiveInteger(challengeTarget)) {
            toast({ title: t("common.error"), description: t("admin.target") + " must be a non-negative integer", variant: "destructive" });
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
                toast({ title: t("admin.challengeUpdated") });
            } else {
                const resp = await challengeApi.create(challengeData);
                if (challengeSessionId && resp.success) {
                    await sessionApi.addChallenge(challengeSessionId, resp.data!.id!);
                }
                toast({ title: t("admin.challengeCreated") });
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
            toast({ title: t("admin.challengeDeleted") });
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
                toast({ title: t("common.error"), description: t("common.firstName") + ", " + t("common.lastName") + ", " + t("common.email") + " and " + t("admin.password") + " are required", variant: "destructive" });
                return;
            }
            // simple email check
            if (!/^\S+@\S+\.\S+$/.test(userEmail)) {
                toast({ title: t("common.error"), description: t("common.email") + " is invalid", variant: "destructive" });
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
                toast({ title: t("admin.userCreated") });
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
            toast({ title: t("common.error"), description: t("common.firstName") + " and " + t("common.lastName") + " are required", variant: "destructive" });
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
                avatar: userAvatar,
            });
            if (editingUser.role !== userRole) {
                await userApi.assignNewRole(userEmail, userRole);
            }
            toast({ title: t("admin.userUpdated") });
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
            toast({ title: t("admin.userDeleted") });
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
        setUserAvatar(null);
        setUserAvatarPreview(null);
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
            toast({ title: t("common.error"), description: t("admin.user") + " and " + t("admin.challenges") + " are required", variant: "destructive" });
            return;
        }
        if (!Validators.isPositiveInteger(subscriptionTarget)) {
            toast({ title: t("common.error"), description: t("admin.target") + " must be a non-negative integer", variant: "destructive" });
            return;
        }
        try {
            const body: SubscriptionBody = {
                target: parseInt(subscriptionTarget, 10) || 0,
                challengeId: subscriptionChallengeId,
            };
            if (editingSubscription) {
                await subscriptionApi.update(editingSubscription.id!, body);
                toast({ title: t("admin.subscriptionUpdated") });
            } else {
                await subscriptionApi.createForUser(subscriptionUserId, body);
                toast({ title: t("admin.subscriptionCreated") });
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
        setSubscriptionUserId(s?.user?.id);
        setSubscriptionChallengeId(s?.challenge?.id);
        setSubscriptionTarget(s.target.toString());
        setSubscriptionDialogOpen(true);
    };

    const handleViewSubscription = (s: Subscription) => {
        const ses = sessions.find(se => se.id === s.session?.id);
        setConcernedSession(ses);
        const chl = challenges.find(c => c.id === s.challenge?.id);
        setConcernedChallenge(chl)
        const usr = users.find(u => u.id === s.user?.id);
        const userName = usr?.firstName && usr?.lastName ? `${usr?.firstName} ${usr?.lastName}`
            : usr?.firstName ? usr?.firstName
                : usr?.lastName ? usr?.lastName : "UNKNOWN USER";
        setConcernedUser(usr);
        setUserName(userName);
        setViewingSubscription(s);
        setViewSubscriptionDialogOpen(true);
    };

    const handleDeleteSubscription = async (id?: string) => {
        if (!id) return;
        try {
            await subscriptionApi.delete(id);
            toast({ title: t("admin.subscriptionDeleted") });
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
            toast({ title: t("common.error"), description: "Numeric report fields must be non-negative integers", variant: "destructive" });
            return;
        }
        if (!Validators.required(reportUserId) || !Validators.required(reportSubscriptionId)) {
            toast({ title: t("common.error"), description: t("admin.user") + " and session selection required", variant: "destructive" });
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
                toast({ title: t("admin.reportUpdated") });
            } else {
                // createForUser expects (userId, sessionId, data)
                await reportApi.createForUser(reportUserId, reportSubscriptionId, body);
                toast({ title: t("admin.reportCreated") });
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
        setReportSubscriptionId(r.subscription?.id);
        setReportUserId(r.subscription?.user?.id || "");
        setReportEvangelized(r.numberEvangelizedTo.toString());
        setReportConverts(r.numberOfNewConverts.toString());
        setReportFollowedUp(r.numberFollowedUp.toString());
        setReportDifficulties(r.difficulties || "");
        setReportRemark(r.remark || "");
        setReportDialogOpen(true);
    };

    function handleViewReportForCalendar(r: ChallengeReport) {
        const ses = sessions.find(s => s.id === r.subscription?.session?.id);
        setConcernedSession(ses);
        const sub = subscriptions.find(s => s.id === r.subscription?.id);
        setConcernedSubscription(sub);
        const chl = challenges.find(c => c.id === r.subscription?.challenge?.id);
        setConcernedChallenge(chl);
        const usr = users.find(u => u.id === r.subscription?.user?.id);
        const userName = usr?.firstName && usr?.lastName ? `${usr?.firstName} ${usr?.lastName}`
            : usr?.firstName ? usr?.firstName
                : usr?.lastName ? usr?.lastName : "UNKNOWN USER";
        setUserName(userName);
        setConcernedUser(usr);
        setViewingReport(r);
    }

    const handleViewReport = (r: ChallengeReport) => {
        handleViewReportForCalendar(r);
        setViewReportDialogOpen(true);
    };

    const handleDeleteReport = async (id?: string) => {
        if (!id) return;
        try {
            await reportApi.delete(id);
            toast({ title: t("admin.reportDeleted") });
            fetchAllData();
        } catch (err: any) {
            toast({ title: "Error", description: isNonNullArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail, variant: "destructive" });
        }
    };

    const resetReportForm = () => {
        setEditingReport(null);
        setViewingReport(null);
        setReportSubscriptionId("");
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
                <div className="animate-pulse text-primary">{t("common.loading")}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-heavenly">
            <Header hideNav />

            <main className="container mx-auto px-2 sm:px-4 pt-20 sm:pt-24 pb-8">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-6 sm:mb-8">{t("admin.title")}</h1>

                <Tabs defaultValue="sessions" className="w-full">
                    <TabsList className="grid w-full max-w-3xl grid-cols-5 mb-6 sm:mb-8 gap-1 sm:gap-0">
                        <TabsTrigger value="sessions" className="text-[10px] sm:text-xs md:text-sm px-1 py-1 sm:py-2">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1 hidden sm:inline" />
                            <span className="hidden lg:inline">{t("admin.sessions")}</span>
                            <span className="sm:hidden">Sess</span>
                        </TabsTrigger>
                        <TabsTrigger value="challenges" className="text-[10px] sm:text-xs md:text-sm px-1 py-1 sm:py-2">
                            <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1 hidden sm:inline" />
                            <span className="hidden lg:inline">{t("admin.challenges")}</span>
                            <span className="sm:hidden">Chal</span>
                        </TabsTrigger>
                        <TabsTrigger value="users" className="text-[10px] sm:text-xs md:text-sm px-1 py-1 sm:py-2">
                            <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1 hidden sm:inline" />
                            <span className="hidden lg:inline">{t("admin.users")}</span>
                            <span className="sm:hidden">Usr</span>
                        </TabsTrigger>
                        <TabsTrigger value="subscriptions" className="text-[10px] sm:text-xs md:text-sm px-1 py-1 sm:py-2">
                            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1 hidden sm:inline" />
                            <span className="hidden lg:inline">{t("admin.subscriptions")}</span>
                            <span className="sm:hidden">Subs</span>
                        </TabsTrigger>
                        <TabsTrigger value="reports" className="text-[10px] sm:text-xs md:text-sm px-1 py-1 sm:py-2">
                            <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1 hidden sm:inline" />
                            <span className="hidden lg:inline">{t("admin.reports")}</span>
                            <span className="sm:hidden">Rprt</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Sessions Tab */}
                    <TabsContent value="sessions">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg sm:text-xl font-semibold">{t("admin.sessions")} ({sessions.length})</h2>
                            <div className="flex gap-2">
                                <Dialog open={sessionDialogOpen} onOpenChange={setSessionDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button size="sm" onClick={resetSessionForm}>
                                            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                            <span className="sm:hidden">{t("admin.add")}</span>
                                            <span className="hidden sm:inline">{t("admin.addSession")}</span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>{editingSession ? t("admin.editSession") : t("admin.createSession")}</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label>{t("admin.name")}</Label>
                                                <Input value={sessionName} onChange={(e) => setSessionName(e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>{t("admin.description")}</Label>
                                                <Textarea value={sessionDescription} onChange={(e) => setSessionDescription(e.target.value)} />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                <div className="space-y-2">
                                                    <Label>{t("admin.startDate")}</Label>
                                                    <Input type="date" value={sessionStartDate} onChange={(e) => setSessionStartDate(e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>{t("admin.endDate")}</Label>
                                                    <Input type="date" value={sessionEndDate} onChange={(e) => setSessionEndDate(e.target.value)} />
                                                </div>
                                            </div>
                                            {editingSession && (
                                                <div className="space-y-2">
                                                    <Label>{t("admin.status")}</Label>
                                                    <Select value={sessionStatus.toString() || SessionStatus.INACTIVE.toString()} onValueChange={setSessionStatus}>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value={SessionStatus.UPCOMING}>{t("admin.upcoming")}</SelectItem>
                                                            <SelectItem value={SessionStatus.ONGOING}>{t("admin.ongoing")}</SelectItem>
                                                            <SelectItem value={SessionStatus.PAUSED}>{t("admin.paused")}</SelectItem>
                                                            <SelectItem value={SessionStatus.ENDED}>{t("admin.ended")}</SelectItem>
                                                            <SelectItem value={SessionStatus.INACTIVE}>{t("admin.inactive")}</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}
                                            <DialogFooter>
                                                <Button onClick={handleSaveSession} className="w-full">
                                                    {editingSession ? t("admin.updateSession") : t("admin.createSession")}
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
                                    <CardContent className="py-3 sm:py-4">
                                        <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                                            <div className="flex-1 w-full">
                                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                                    <h3
                                                        className="font-semibold text-base sm:text-lg cursor-pointer"
                                                        onClick={() => openSessionDetailsModal(session)}
                                                    >
                                                        {session.name}
                                                    </h3>
                                                    <Badge variant={session.status === SessionStatus.ONGOING ? "default" : "secondary"} className="text-xs">
                                                        {session.status?.toString()}
                                                    </Badge>
                                                </div>
                                                <p
                                                    className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2 cursor-pointer"
                                                    onClick={() => openSessionDetailsModal(session)}
                                                >
                                                    {session.description}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs text-muted-foreground">
                                                  <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    { formatDate(new Date(session.startDate).toLocaleDateString()) } - { formatDate(new Date(session.endDate).toLocaleDateString()) }
                                                  </span>
                                                    {session.challenges && (
                                                        <span className="flex items-center gap-1">
                                                            <Target className="w-3 h-3" />
                                                            {session.challenges.length} ch
                                                        </span>
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

                                            <div className="flex sm:flex-col gap-1 w-full sm:w-auto justify-end">
                                                <div className="flex gap-1 justify-end">
                                                    <Button variant="ghost" size="sm" onClick={() => toggleViewSession(session)} title="View">
                                                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleEditSession(session)} title="Edit">
                                                        <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    </Button>
                                                    <ConfirmRemoveDialog
                                                        trigger={<Button variant="ghost" size="sm" title="Delete"><Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-destructive" /></Button>}
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
                                    <DialogTitle>{t("admin.sessionDetails")}</DialogTitle>
                                </DialogHeader>
                                <div className="py-2">
                                    {viewingSession && (
                                            <div className="py-2">
                                                <div className="text-sm"><strong>{t("admin.name")}:</strong> {viewingSession?.name} </div>
                                                <div className="text-sm"><strong>{t("admin.description")}:</strong> {viewingSession?.description}</div>
                                                <div className="text-sm"><strong>{t("admin.status")}:</strong> {viewingSession?.status?.toString()}</div>
                                                <div className="text-sm"><strong>{t("admin.numberOfChallenges")}:</strong> {viewingSession?.challenges?.length}</div>
                                                <div className="text-sm"><strong>{t("admin.startDate")}:</strong> {formatDate(viewingSession?.startDate)}</div>
                                                <div className="text-sm"><strong>{t("admin.endDate")}:</strong> {formatDate(viewingSession?.endDate)}</div>
                                                <div className="text-sm"><strong>{t("admin.createdOn")}:</strong> {formatDate(viewingSession?.createdOn)} </div>
                                                <div className="text-sm"><strong>{t("admin.updatedOn")}:</strong> {formatDate(viewingSession?.updatedOn)} </div>
                                            </div>
                                    )}
                                </div>
                                <DialogFooter>
                                    <Button onClick={() => setViewSessionDialogOpen(false)}>{t("admin.close")}</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </TabsContent>

                    {/* Challenges */}
                    <TabsContent value="challenges">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                            <h2 className="text-lg sm:text-xl font-semibold">{t("admin.challenges")} ({challenges.length})</h2>
                            <div className="flex gap-2">
                                <Dialog open={challengeDialogOpen} onOpenChange={setChallengeDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button size="sm" onClick={resetChallengeForm}>
                                            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> 
                                            <span className="sm:hidden">{t("admin.add")}</span>
                                            <span className="hidden sm:inline">{t("admin.addChallenge")}</span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>{editingChallenge ? t("admin.editChallenge") : t("admin.createChallenge")}</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label>{t("admin.name")}</Label>
                                                <Input value={challengeName} onChange={(e) => setChallengeName(e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>{t("admin.description")}</Label>
                                                <Textarea value={challengeDescription} onChange={(e) => setChallengeDescription(e.target.value)} />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                <div className="space-y-2">
                                                    <Label>{t("admin.targetSouls")}</Label>
                                                    <Input type="number" value={challengeTarget} onChange={(e) => setChallengeTarget(e.target.value)} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>{t("admin.type")}</Label>
                                                    <Select value={challengeType?.toString()} onValueChange={setChallengeType}>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value={ChallengeType.NORMAL}>{t("admin.normal")}</SelectItem>
                                                            <SelectItem value={ChallengeType.EVENT}>{t("admin.event")}</SelectItem>
                                                            <SelectItem value={ChallengeType.INDIVIDUAL}>{t("admin.individual")}</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>{t("admin.session")}</Label>
                                                <Select value={challengeSessionId} onValueChange={setChallengeSessionId}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t("admin.selectSession")} />
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
                                                    {editingChallenge ? t("admin.updateChallenge") : t("admin.createChallenge")}
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
                                        <CardContent className="py-3 sm:py-4">
                                            <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                                                <div className="flex-1 w-full">
                                                    <h3
                                                        className="font-semibold cursor-pointer text-base sm:text-lg"
                                                        onClick={() => openChallengeDetailsModal(challenge)}
                                                    >
                                                        {challenge.name}
                                                    </h3>
                                                    <p
                                                        className="text-xs sm:text-sm text-muted-foreground line-clamp-2"
                                                        onClick={() => openChallengeDetailsModal(challenge)}
                                                    >
                                                        {challenge.description}
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                                                        <Badge variant="outline" className="text-xs">{challenge.type?.toString()}</Badge>
                                                        <span className="text-xs text-muted-foreground">Target: {challenge.target}</span>
                                                        {session && <span className="text-xs text-muted-foreground truncate max-w-[100px] sm:max-w-none">Session: {session.name}</span>}
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

                                                <div className="flex sm:flex-col gap-1 w-full sm:w-auto justify-end">
                                                    <div className="flex gap-1 justify-end">
                                                        <Button variant="ghost" size="sm" onClick={() => toggleViewChallenge(challenge)}>
                                                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm" onClick={() => handleEditChallenge(challenge)}>
                                                            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                                                        </Button>
                                                        <ConfirmRemoveDialog
                                                            trigger={<Button variant="ghost" size="sm"><Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-destructive" /></Button>}
                                                            title={`Delete "${challenge.name}"`}
                                                            description={`This will delete the challenge and related subscriptions. Continue?`}
                                                            confirmLabel="Delete"
                                                            onConfirm={() => handleDeleteChallenge(challenge.id)}
                                                        />
                                                    </div>
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
                                    <DialogTitle>{t("admin.challengeDetails")}</DialogTitle>
                                </DialogHeader>
                                <div className="py-2">

                                    {viewingChallenge && (
                                    <div className="py-2">
                                        <div className="text-sm"><strong>{t("admin.name")}:</strong> {viewingChallenge?.name} </div>
                                        <div className="text-sm"><strong>{t("admin.description")}:</strong> {viewingChallenge?.description}</div>
                                        <div className="text-sm"><strong>{t("admin.type")}:</strong> {viewingChallenge?.type?.toString()}</div>
                                        <div className="text-sm"><strong>{t("admin.target")}:</strong> {viewingChallenge?.target}</div>
                                        <div className="text-sm"><strong>{t("admin.numberOfSessions")}:</strong> {viewingChallenge?.sessions?.length}</div>
                                        <div className="text-sm"><strong>{t("admin.createdOn")}:</strong> {formatDate(viewingChallenge?.createdOn)} </div>
                                        <div className="text-sm"><strong>{t("admin.updatedOn")}:</strong> {formatDate(viewingChallenge?.updatedOn)} </div>
                                    </div>
                                    )}
                                </div>
                                <DialogFooter>
                                    <Button onClick={() => setViewChallengeDialogOpen(false)}>{t("admin.close")}</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </TabsContent>

                    {/* Users */}
                    <TabsContent value="users">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                            <h2 className="text-lg sm:text-xl font-semibold">{t("admin.users")} ({users.length})</h2>
                            <div className="flex gap-2">
                                <Button size="sm" onClick={() => { resetUserForm(); setUserDialogOpen(true); }}>
                                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> 
                                    <span className="sm:hidden">{t("admin.add")}</span>
                                    <span className="hidden sm:inline">{t("admin.addUser")}</span>
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {users.map((u) => (
                                <div key={u.id}>
                                    <Card className="shadow-gentle">
                                        <CardContent className="py-3 sm:py-4">
                                            <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                                                <div onClick={() => openUserDetailsModal(u)} className="cursor-pointer w-full">
                                                    <h3 className="font-semibold text-base sm:text-lg">{u.firstName} {u.lastName}</h3>
                                                    <p className="text-xs sm:text-sm text-muted-foreground truncate max-w-[200px] sm:max-w-none">{u.email}</p>
                                                </div>
                                                <div className="flex flex-wrap gap-1 sm:gap-2 w-full sm:w-auto justify-end">
                                                    <Button variant="ghost" size="sm" onClick={() => toggleViewUser(u)}>
                                                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleEditUser(u)}>
                                                        <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    </Button>
                                                    <ConfirmRemoveDialog
                                                        trigger={<Button variant="ghost" size="sm"><Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-destructive" /></Button>}
                                                        title={`Delete "${u.firstName} ${u.lastName}"`}
                                                        description={`This will delete the user. Continue?`}
                                                        confirmLabel="Delete"
                                                        onConfirm={() => handleDeleteUser(u.id)}
                                                    />
                                                    <Button size="sm" onClick={() => handleSubscribeUser(u)} className="text-xs sm:text-sm px-2 sm:px-4">{t("admin.subscribe")}</Button>
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
                                                            toast({ title: t("admin.roleUpdated") });
                                                            fetchAllData();
                                                        } catch (err: any) {
                                                            toast({ title: "Error", description: isNonNullArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail, variant: "destructive" });
                                                        }
                                                    }}
                                                    onToggleBlock={async () => {
                                                        try {
                                                            await userApi.toggleBlock(u.id!);
                                                            toast({ title: t("admin.userBlockStateToggled") });
                                                            fetchAllData();
                                                        } catch (err: any) {
                                                            toast({ title: "Error", description: isNonNullArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail, variant: "destructive" });
                                                        }
                                                    }}
                                                    onEnableUser={async () => {
                                                        try {
                                                            await userApi.enableUser(u.id!);
                                                            toast({ title: t("admin.userEnabled") });
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
                                <DialogHeader><DialogTitle>{t("admin.userDetails")}</DialogTitle></DialogHeader>
                                <div className="py-2">
                                    <div className="text-sm"><strong>{t("admin.name")}:</strong> {computeUserName(viewingUser)} </div>
                                    <div className="text-sm"><strong>{t("admin.email")}:</strong> {viewingUser?.email}</div>
                                    <div className="text-sm"><strong>{t("admin.role")}:</strong> {viewingUser?.role?.toString()}</div>
                                    <div className="text-sm"><strong>{t("admin.phone")}:</strong> {viewingUser?.phoneNumber}</div>
                                    <div className="text-sm"><strong>{t("admin.location")}:</strong> {viewingUser?.city}, {viewingUser?.region}, {viewingUser?.country}</div>
                                    <div className="text-sm"><strong>{t("admin.enabled")}:</strong> {viewingUser?.accountEnabled ? t("admin.yes") : t("admin.no")} </div>
                                    <div className="text-sm"><strong>{t("admin.blocked")}:</strong> {viewingUser?.accountBlocked ? t("admin.yes") : t("admin.no")} </div>
                                    <div className="text-sm"><strong>{t("admin.createdOn")}:</strong> {formatDate(viewingUser?.createdOn)} </div>
                                    <div className="text-sm"><strong>{t("admin.updatedOn")}:</strong> {formatDate(viewingUser?.updatedOn)} </div>
                                </div>
                                <DialogFooter><Button onClick={() => setViewUserDialogOpen(false)}>{t("admin.close")}</Button></DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </TabsContent>

                    {/* Subscriptions */}
                    <TabsContent value="subscriptions">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                            <h2 className="text-lg sm:text-xl font-semibold">{t("admin.subscriptions")} ({subscriptions.length})</h2>
                            <div className="flex gap-2">
                                <Button size="sm" onClick={() => { resetSubscriptionForm(); setSubscriptionDialogOpen(true); }}>
                                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> 
                                    <span className="sm:hidden">{t("admin.add")}</span>
                                    <span className="hidden sm:inline">{t("admin.addSubscription")}</span>
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {subscriptions.map((sub) => {
                                const ses = sessions.find((s) => s.id === sub.session?.id);
                                const chl = challenges.find((c) => c.id === sub.challenge?.id);
                                const usr = users.find((u) => u?.id === sub.user?.id);
                                const userName = usr?.firstName && usr?.lastName ? `${usr?.firstName} ${usr?.lastName}`
                                    : usr?.firstName ? usr?.firstName
                                        : usr?.lastName ? usr?.lastName : "UNKNOWN USER";
                                return (
<Card key={sub.id} className="shadow-gentle">
                                        <CardContent className="py-3 sm:py-4">
                                            <div className="flex flex-col sm:flex-row items-start justify-between gap-3">

                                                <div className="flex-1 w-full">
                                                    <h3 className="font-semibold cursor-pointer text-sm sm:text-base">
                                                        {computeUserName(usr)} → Pledge: {sub?.target}
                                                    </h3>
                                                    <p className="flex items-center gap-4 mt-1 sm:mt-2 text-xs text-muted-foreground">
                                                        { (usr && usr?.email) ? usr.email : computeUserName(usr)}
                                                    </p>
                                                    <p className="flex items-center gap-4 mt-1 sm:mt-2 text-xs">
                                                        Session: {ses.name}
                                                    </p>
                                                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 sm:mt-2">
                                                        <span className="text-xs text-muted-foreground">Challenge: {chl.name}</span>
                                                        {sub.challenge && <span className="text-xs text-muted-foreground">target: {sub.target}</span>}
                                                    </div>
                                                    <div className="flex items-center gap-4 mt-1 sm:mt-2">
                                                        <Badge variant="outline" className="text-xs">ON</Badge>
                                                        <span className="text-xs text-muted-foreground"> {formatDate(sub.createdOn)}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1 sm:gap-2 w-full sm:w-auto justify-end">
                                                    <Button variant="ghost" size="sm" onClick={() => handleViewSubscription(sub)}><Eye className="w-3 h-3 sm:w-4 sm:h-4" /></Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleEditSubscription(sub)}><Edit className="w-3 h-3 sm:w-4 sm:h-4" /></Button>
                                                    <ConfirmRemoveDialog
                                                        trigger={<Button variant="ghost" size="sm"><Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-destructive" /></Button>}
                                                        title={`Delete subscription`}
                                                        description={`Delete subscription for ${usr?.firstName || "Unknown"}?`}
                                                        confirmLabel="Delete"
                                                        onConfirm={() => handleDeleteSubscription(sub.id)}
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
                                <DialogHeader><DialogTitle>{t("admin.subscriptionDetails")}</DialogTitle></DialogHeader>
                                <div className="py-2">
                                    <div className="text-sm"><strong>{t("admin.user")}:</strong> {computeUserName(viewingSubscription ? viewingSubscription?.user : null)}</div>
                                    <div className="text-sm"><strong>{t("admin.email")}:</strong> { (viewingSubscription?.user && viewingSubscription?.user?.email) ? viewingSubscription?.user.email : computeUserName(viewingSubscription?.user)}</div>
                                    <div className="text-sm"><strong>{t("admin.session")}:</strong> {viewingSubscription ? viewingSubscription.session?.name : ""}</div>
                                    <div className="text-sm"><strong>{t("admin.challenges")}:</strong> {viewingSubscription ? viewingSubscription.challenge?.name : ""}</div>
                                    <div className="text-sm"><strong>{t("admin.commitment")}:</strong> {viewingSubscription?.target}</div>
                                    <div className="text-sm"><strong>{t("admin.target")}:</strong> { viewingSubscription?.challenge?.target}</div>
                                    <div className="text-sm"><strong>{t("admin.subscribedOn")}:</strong> {formatDate(viewingSubscription?.createdOn)}</div>
                                    <div className="text-sm"><strong>{t("admin.updatedOn")}:</strong> {formatDate(viewingSubscription?.updatedOn)}</div>
                                </div>
                                <DialogFooter><Button onClick={() => setViewSubscriptionDialogOpen(false)}>{t("admin.close")}</Button></DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </TabsContent>

                    {/* Reports */}
                    <TabsContent value="reports">
                        <ReportsCalendar 
                            reports={reports}
                            authUserIsAdmin={isAdmin}
                            title={t("admin.allReports")}
                            onViewReport={handleViewReportForCalendar}
                            onEditReport={handleEditReport}
                            defaultView="year"
                        />
                        
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-6 mb-4">
                            <h2 className="text-lg sm:text-xl font-semibold">{t("admin.reportsList")} ({reports.length})</h2>
                            <div className="flex gap-2">
                                <Button size="sm" onClick={() => { resetReportForm(); setReportDialogOpen(true); }}>
                                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> 
                                    <span className="sm:hidden">{t("admin.add")}</span>
                                    <span className="hidden sm:inline">{t("admin.addReport")}</span>
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="hidden lg:block">
                                <Card key={"reportHeader"} className="shadow-gentle">
                                    <CardContent className="flex justify-between py-4">
                                        <div className="flex-grow grid grid-cols-12 gap-2">
                                                <div className="col-span-1 font-bold text-xs">User</div>
                                                <div className="col-span-2 font-bold text-xs">Email</div>
                                                <div className="col-span-1 font-bold text-xs">Session</div>
                                                <div className="col-span-1 font-bold text-xs">Challenge</div>
                                                <div className="col-span-1 font-bold text-xs">Pledge</div>
                                                <div className="col-span-1 font-bold text-xs">Target</div>
                                                <div className="col-span-1 font-bold text-xs">Evangelized</div>
                                                <div className="col-span-1 font-bold text-xs">Converts</div>
                                                <div className="col-span-1 font-bold text-xs">Followed up</div>
                                                <div className="col-span-1 font-bold text-xs">Reported On</div>
                                        </div>
                                        <div className="w-24"></div>
                                    </CardContent>
                                </Card>
                            </div>

                            {reports.map((r) => {
                                const ses = sessions.find((s) => s?.id === r.subscription?.session?.id);
                                const chl = challenges.find((c) => c?.id === r.subscription?.challenge?.id);
                                const sub = subscriptions.find((s) => s?.id === r.subscription?.id);
                                const usr = users.find((u) => u?.id === r.subscription?.user?.id);
                                return (

                                    <Card key={r.id} className="shadow-gentle">
                                        <CardContent className="py-3 sm:py-4">
                                            {/* Desktop view - grid */}
                                            <div className="hidden lg:grid grid-cols-12 gap-2 items-center">
                                                <div className="text-xs col-span-1 truncate">
                                                    {computeUserName(usr)}
                                                </div>
                                                <div className="text-xs col-span-2 truncate">
                                                    { (usr && usr?.email) ? usr.email : computeUserName(usr)}
                                                </div>
                                                <div className="text-xs col-span-1 truncate">
                                                    {ses?.name}
                                                </div>
                                                <div className="text-xs col-span-1 truncate">
                                                    {chl?.name}
                                                </div>
                                                <div className="text-xs col-span-1">
                                                    {sub?.target}
                                                </div>
                                                <div className="text-xs col-span-1">
                                                    {chl?.target}
                                                </div>
                                                <div className="text-xs col-span-1">
                                                    {r.numberEvangelizedTo}
                                                </div>
                                                <div className="text-xs col-span-1">
                                                    {r.numberOfNewConverts}
                                                </div>
                                                <div className="text-xs col-span-1">
                                                    {r.numberFollowedUp}
                                                </div>
                                                <div className="text-xs col-span-1">
                                                    {formatDate(r.createdOn)}
                                                </div>
                                                <div className="col-span-1 flex justify-end gap-1">
                                                    <Button variant="ghost" size="sm" onClick={() => handleViewReport(r)}>
                                                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleEditReport(r)}>
                                                        <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    </Button>
                                                    <ConfirmRemoveDialog
                                                        trigger={
                                                            <Button variant="ghost" size="sm">
                                                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-destructive" />
                                                            </Button>
                                                        }
                                                        title={`Delete report`}
                                                        description={`Delete this report?`}
                                                        confirmLabel="Delete"
                                                        onConfirm={() => handleDeleteReport(r.id)}
                                                    />
                                                </div>
                                            </div>

                                            {/* Mobile view - stacked */}
                                            <div className="lg:hidden space-y-2">
                                                <div className="flex justify-between items-start">
                                                    <div className="text-sm font-medium truncate">{computeUserName(usr)}</div>
                                                    <div className="text-xs text-muted-foreground">{formatDate(r.createdOn)}</div>
                                                </div>
                                                <div className="text-xs text-muted-foreground truncate">{ (usr && usr?.email) ? usr.email : computeUserName(usr)}</div>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                                                    <div><span className="text-muted-foreground">Session:</span> {ses?.name}</div>
                                                    <div><span className="text-muted-foreground">Challenge:</span> {chl?.name}</div>
                                                    <div><span className="text-muted-foreground">Pledge:</span> {sub?.target}</div>
                                                    <div><span className="text-muted-foreground">Target:</span> {chl?.target}</div>
                                                    <div><span className="text-muted-foreground">Evangelized:</span> {r.numberEvangelizedTo}</div>
                                                    <div><span className="text-muted-foreground">Converts:</span> {r.numberOfNewConverts}</div>
                                                    <div className="col-span-2 flex justify-end gap-1">
                                                        <Button variant="ghost" size="sm" onClick={() => handleViewReport(r)}>
                                                            <Eye className="w-3 h-3" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm" onClick={() => handleEditReport(r)}>
                                                            <Edit className="w-3 h-3" />
                                                        </Button>
                                                        <ConfirmRemoveDialog
                                                            trigger={
                                                                <Button variant="ghost" size="sm">
                                                                    <Trash2 className="w-3 h-3 text-destructive" />
                                                                </Button>
                                                            }
                                                            title={`Delete report`}
                                                            description={`Delete this report?`}
                                                            confirmLabel="Delete"
                                                            onConfirm={() => handleDeleteReport(r.id)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        <Dialog open={viewReportDialogOpen} onOpenChange={setViewReportDialogOpen}>
                            <DialogContent>
                                <DialogHeader><DialogTitle>{t("admin.reportDetails")}</DialogTitle></DialogHeader>
                                <div className="py-2">
                                    <div className="text-sm"><strong>{t("admin.user")}:</strong> {computeUserName(concernedUser)}</div>
                                    <div className="text-sm"><strong>{t("admin.email")}:</strong> { (concernedUser && concernedUser?.email) ? concernedUser?.email : computeUserName(concernedUser)}</div>
                                    <div className="text-sm"><strong>{t("admin.session")}:</strong> {concernedSession ? concernedSession?.name : ""}</div>
                                    <div className="text-sm"><strong>{t("admin.challenges")}:</strong> {concernedChallenge ? concernedChallenge?.name : ""}</div>
                                    <div className="text-sm"><strong>{t("admin.pledge")}:</strong> {concernedSubscription?.target}</div>
                                    <div className="text-sm"><strong>{t("admin.target")}:</strong> {concernedChallenge?.target}</div>
                                    <div className="text-sm"><strong>{t("admin.evangelized")}:</strong> {viewingReport?.numberEvangelizedTo}</div>
                                    <div className="text-sm"><strong>{t("admin.converts")}:</strong> {viewingReport?.numberOfNewConverts}</div>
                                    <div className="text-sm"><strong>{t("admin.followedUp")}:</strong> {viewingReport?.numberFollowedUp}</div>
                                    <div className="text-sm"><strong>{t("admin.difficulties")}:</strong> {viewingReport?.difficulties}</div>
                                    <div className="text-sm"><strong>{t("admin.remark")}:</strong> {viewingReport?.remark}</div>
                                    <div className="text-sm"><strong>{t("admin.createdOn")}:</strong> {formatDate(viewingReport?.createdOn)} </div>
                                    <div className="text-sm"><strong>{t("admin.updatedOn")}:</strong> {formatDate(viewingReport?.updatedOn)} </div>
                                </div>
                                <DialogFooter><Button onClick={() => setViewReportDialogOpen(false)}>{t("admin.close")}</Button></DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </TabsContent>
                </Tabs>
            </main>

            {/* Reused dialogs: user, challenge, subscription, report */}
            {/* User dialog */}
            <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}  >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingUser ? t("admin.editUser") : t("admin.createUser")}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>{t("admin.firstName")}</Label>
                                <Input value={userFirstName} onChange={(e) => setUserFirstName(e.target.value)} />
                            </div>
                            <div>
                                <Label>{t("admin.lastName")}</Label>
                                <Input value={userLastName} onChange={(e) => setUserLastName(e.target.value)} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>{t("admin.email")}</Label>
                            <Input value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                        </div>

                        {!editingUser && (
                            <div className="space-y-2">
                                <Label>{t("admin.password")}</Label>
                                <Input type="password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} />
                            </div>
                        )}

                        {editingUser && (
                                <>
                                    <div className="space-y-2">
                                        <Label>{t("admin.profilePicture")}</Label>
                                    <Input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setUserAvatar(file);
                                                setUserAvatarPreview(URL.createObjectURL(file));
                                            }
                                        }} 
                                    />
                                    {userAvatarPreview && (
                                        <div className="mt-2">
                                            <img 
                                                src={userAvatarPreview} 
                                                alt="Avatar preview" 
                                                className="w-20 h-20 rounded-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>{t("admin.role")}</Label>
                                        <Select value={userRole} onValueChange={setUserRole}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={UserRole.USER}>{t("admin.userRole.user")}</SelectItem>
                                                <SelectItem value={UserRole.ADMIN}>{t("admin.userRole.admin")}</SelectItem>
                                                <SelectItem value={UserRole.SUPER_ADMIN}>{t("admin.userRole.superAdmin")}</SelectItem>
                                                <SelectItem value={UserRole.ECOMIEST}>{t("admin.userRole.ecomiest")}</SelectItem>
                                                <SelectItem value={UserRole.COACH}>{t("admin.userRole.coach")}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label>{t("admin.phone")}</Label>
                                        <Input value={userPhoneNumber} onChange={(e) => setUserPhoneNumber(e.target.value)} />
                                    </div>
                                </div>
                            </>
                        )}

                        {editingUser && (
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label>{t("admin.country")}</Label>
                                    <Input value={userCountry} onChange={(e) => setUserCountry(e.target.value)} />
                                </div>
                                <div>
                                    <Label>{t("admin.region")}</Label>
                                    <Input value={userRegion} onChange={(e) => setUserRegion(e.target.value)} />
                                </div>
                                <div>
                                    <Label>{t("admin.city")}</Label>
                                    <Input value={userCity} onChange={(e) => setUserCity(e.target.value)} />
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            <Button onClick={handleSaveUser} className="w-full">{editingUser ? t("admin.updateUser") : t("admin.createUser")}</Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Challenge dialog */}
            <Dialog open={challengeDialogOpen} onOpenChange={setChallengeDialogOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{editingChallenge ? t("admin.editChallenge") : t("admin.createChallenge")}</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2"><Label>{t("admin.name")}</Label><Input value={challengeName} onChange={(e) => setChallengeName(e.target.value)} /></div>
                        <div className="space-y-2"><Label>{t("admin.description")}</Label><Textarea value={challengeDescription} onChange={(e) => setChallengeDescription(e.target.value)} /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>{t("admin.targetSouls")}</Label><Input type="number" value={challengeTarget} onChange={(e) => setChallengeTarget(e.target.value)} /></div>
                            <div className="space-y-2"><Label>{t("admin.type")}</Label>
                                <Select value={challengeType?.toString()} onValueChange={setChallengeType}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={ChallengeType.NORMAL}>{t("admin.normal")}</SelectItem>
                                        <SelectItem value={ChallengeType.EVENT}>{t("admin.event")}</SelectItem>
                                        <SelectItem value={ChallengeType.INDIVIDUAL}>{t("admin.individual")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>{t("admin.session")}</Label>
                            <Select value={challengeSessionId} onValueChange={setChallengeSessionId}>
                                <SelectTrigger><SelectValue placeholder={t("admin.selectSession")} /></SelectTrigger>
                                <SelectContent>{sessions.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <DialogFooter><Button onClick={handleSaveChallenge} className="w-full">{editingChallenge ? t("admin.updateChallenge") : t("admin.createChallenge")}</Button></DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Subscription dialog */}
            <Dialog open={subscriptionDialogOpen} onOpenChange={setSubscriptionDialogOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{editingSubscription ? t("admin.editSubscription") : t("admin.createSubscription")}</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>{t("admin.user")}</Label>
                            <Select value={subscriptionUserId} onValueChange={setSubscriptionUserId}>
                                <SelectTrigger><SelectValue placeholder={t("admin.selectUser")} /></SelectTrigger>
                                <SelectContent>{users.map(u => <SelectItem key={u.id} value={u.id}> {computeUserName(u)}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>{t("admin.challenges")}</Label>
                            <Select value={subscriptionChallengeId} onValueChange={setSubscriptionChallengeId}>
                                <SelectTrigger><SelectValue placeholder={t("admin.selectChallenge")} /></SelectTrigger>
                                <SelectContent>{ ongoingSession?.challenges.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2"><Label>{t("admin.target")}</Label><Input type="number" value={subscriptionTarget} onChange={(e) => setSubscriptionTarget(e.target.value)} /></div>
                        <DialogFooter><Button onClick={handleSaveSubscription} className="w-full">{editingSubscription ? t("admin.updateSubscription") : t("admin.createSubscription")}</Button></DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Report dialog - now includes selects for session and user */}
            <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{editingReport ? t("admin.editReport") : t("admin.createReport")}</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">

                        <div className="space-y-2">
                            <Label>{t("admin.user")}</Label>
                            <Select value={reportUserId} onValueChange={setReportUserId}>
                                <SelectTrigger><SelectValue placeholder={t("admin.selectUser")} /></SelectTrigger>
                                <SelectContent>{ongoingSessionUsers.map(u => <SelectItem key={u.id} value={u.id}>{u.firstName} {u.lastName}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>{t("admin.challenges")}</Label>
                            <Select value={reportSubscriptionId} onValueChange={setReportSubscriptionId}>
                                <SelectTrigger><SelectValue placeholder={t("admin.selectChallenge")} /></SelectTrigger>
                                <SelectContent>{ongoingSessionSubscriptions.filter(s => s.user?.id === reportUserId).map(s => <SelectItem key={s.id} value={s.id}>{s.challenge?.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2"><Label>{t("admin.evangelized")}</Label><Input type="number" value={reportEvangelized} onChange={(e) => setReportEvangelized(e.target.value)} /></div>
                            <div className="space-y-2"><Label>{t("admin.converts")}</Label><Input type="number" value={reportConverts} onChange={(e) => setReportConverts(e.target.value)} /></div>
                            <div className="space-y-2"><Label>{t("admin.followedUp")}</Label><Input type="number" value={reportFollowedUp} onChange={(e) => setReportFollowedUp(e.target.value)} /></div>
                        </div>

                        <div className="space-y-2"><Label>{t("admin.difficulties")}</Label><Textarea value={reportDifficulties} onChange={(e) => setReportDifficulties(e.target.value)} /></div>
                        <div className="space-y-2"><Label>{t("admin.remark")}</Label><Textarea value={reportRemark} onChange={(e) => setReportRemark(e.target.value)} /></div>

                        <DialogFooter><Button onClick={handleSaveReport} className="w-full">{editingReport ? t("admin.updateReport") : t("admin.createReport")}</Button></DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Admin;