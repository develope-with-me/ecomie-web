import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
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
} from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import {
    Users, Calendar, Target, FileText, Heart, Home, LogOut,
    Plus, Edit, Trash2, BookOpen, Shield, Eye, UserCog, X
} from 'lucide-react';
import { isNonNullArray } from "@/lib/utils";

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

    // Expanded / viewed items
    const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
    const [expandedChallengeId, setExpandedChallengeId] = useState<string | null>(null);

    // Session form state
    const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
    const [editingSession, setEditingSession] = useState<Session | null>(null);
    const [sessionName, setSessionName] = useState('');
    const [sessionDescription, setSessionDescription] = useState('');
    const [sessionStartDate, setSessionStartDate] = useState('');
    const [sessionEndDate, setSessionEndDate] = useState('');
    const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(SessionStatus.UPCOMING);

    // Challenge form state
    const [challengeDialogOpen, setChallengeDialogOpen] = useState(false);
    const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
    const [challengeName, setChallengeName] = useState('');
    const [challengeDescription, setChallengeDescription] = useState('');
    const [challengeTarget, setChallengeTarget] = useState('');
    const [challengeType, setChallengeType] = useState<ChallengeType | null>(ChallengeType.INDIVIDUAL);
    const [challengeSessionId, setChallengeSessionId] = useState('');

    // User form state
    const [userDialogOpen, setUserDialogOpen] = useState(false);
    const [viewUserDialogOpen, setViewUserDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [viewingUser, setViewingUser] = useState<User | null>(null);
    const [userFirstName, setUserFirstName] = useState('');
    const [userLastName, setUserLastName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userRole, setUserRole] = useState<string>(UserRole.USER);
    const [userPhoneNumber, setUserPhoneNumber] = useState('');
    const [userCountry, setUserCountry] = useState('');
    const [userRegion, setUserRegion] = useState('');
    const [userCity, setUserCity] = useState('');

    // Subscription form state
    const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);
    const [viewSubscriptionDialogOpen, setViewSubscriptionDialogOpen] = useState(false);
    const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
    const [viewingSubscription, setViewingSubscription] = useState<Subscription | null>(null);
    const [subscriptionUserId, setSubscriptionUserId] = useState('');
    const [subscriptionChallengeId, setSubscriptionChallengeId] = useState('');
    const [subscriptionTarget, setSubscriptionTarget] = useState('');

    // Report form state
    const [reportDialogOpen, setReportDialogOpen] = useState(false);
    const [viewReportDialogOpen, setViewReportDialogOpen] = useState(false);
    const [editingReport, setEditingReport] = useState<ChallengeReport | null>(null);
    const [viewingReport, setViewingReport] = useState<ChallengeReport | null>(null);
    const [reportSessionId, setReportSessionId] = useState('');
    const [reportUserId, setReportUserId] = useState('');
    const [reportEvangelized, setReportEvangelized] = useState('');
    const [reportConverts, setReportConverts] = useState('');
    const [reportFollowedUp, setReportFollowedUp] = useState('');
    const [reportDifficulties, setReportDifficulties] = useState('');
    const [reportRemark, setReportRemark] = useState('');

    // View dialogs for Session and Challenge
    const [viewSessionDialogOpen, setViewSessionDialogOpen] = useState(false);
    const [viewingSession, setViewingSession] = useState<Session | null>(null);
    const [viewChallengeDialogOpen, setViewChallengeDialogOpen] = useState(false);
    const [viewingChallenge, setViewingChallenge] = useState<Challenge | null>(null);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                navigate('/auth');
            } else if (!isAdmin) {
                toast({
                    title: "Access Denied",
                    description: "You don't have admin privileges.",
                    variant: "destructive",
                });
                navigate('/dashboard');
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
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // --- Session helpers including expanded view handlers ---

    const toggleViewSession = (session: Session) => {
        if (expandedSessionId === session.id) {
            setExpandedSessionId(null);
            setViewingSession(null);
            setViewSessionDialogOpen(false);
        } else {
            setExpandedSessionId(session.id || null);
            setViewingSession(session);
            // keep as inline expand (not modal)
        }
    };

    const handleAddChallengeToSession = (sessionId: string | undefined) => {
        // Open challenge dialog preselecting the session
        setEditingChallenge(null);
        setChallengeName('');
        setChallengeDescription('');
        setChallengeTarget('');
        setChallengeType(ChallengeType.INDIVIDUAL);
        setChallengeSessionId(sessionId || '');
        setChallengeDialogOpen(true);
    };

    const handleChangeSessionStatus = async (sessionId: string | undefined, status: SessionStatus) => {
        if (!sessionId) return;
        try {
            await sessionApi.updateStatus(sessionId, status.toString());
            toast({ title: "Session status updated" });
            fetchAllData();
        } catch (err: any) {
            const description = isNonNullArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail;
            toast({ title: "Error", description, variant: "destructive" });
        }
    };

    const handleRemoveChallengeFromSession = async (sessionId: string | undefined, challengeId: string | undefined) => {
        if (!sessionId || !challengeId) return;
        try {
            await sessionApi.removeChallenge(sessionId, challengeId);
            toast({ title: "Challenge removed from session" });
            fetchAllData();
        } catch (err: any) {
            const description = isNonNullArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail;
            toast({ title: "Error", description, variant: "destructive" });
        }
    };

    // Session CRUD (save/edit/delete) - unchanged except some defaults
    const handleSaveSession = async () => {
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
        } catch (error: any) {
            const description =  isNonNullArray(error.invalidParams)  ? error.invalidParams[0].reason : error.detail;
            toast({ title: "Error", description: description, variant: "destructive" });
        }
    };

    const handleEditSession = (session: Session) => {
        setEditingSession(session);
        setSessionName(session.name);
        setSessionDescription(session.description || '');
        setSessionStartDate(session.startDate.split('T')[0]);
        setSessionEndDate(session.endDate.split('T')[0]);
        setSessionStatus(session.status);
        setSessionDialogOpen(true);
    };

    const handleDeleteSession = async (id: string) => {
        if (!confirm('This will also delete all challenges in this session. Continue?')) return;

        try {
            await sessionApi.delete(id);
            toast({ title: "Session Deleted" });
            fetchAllData();
        } catch (error: any) {
            const description =  isNonNullArray(error.invalidParams)  ? error.invalidParams[0].reason : error.detail;
            toast({ title: "Error", description: description, variant: "destructive" });
        }
    };

    const resetSessionForm = () => {
        setEditingSession(null);
        setSessionName('');
        setSessionDescription('');
        setSessionStartDate('');
        setSessionEndDate('');
        setSessionStatus(SessionStatus.UPCOMING);
    };

    // --- Challenge helpers including expanded view handlers ---
    const toggleViewChallenge = (challenge: Challenge) => {
        if (expandedChallengeId === challenge.id) {
            setExpandedChallengeId(null);
            setViewingChallenge(null);
        } else {
            setExpandedChallengeId(challenge.id || null);
            setViewingChallenge(challenge);
        }
    };

    const handleAddExistingChallengeToSession = async (challengeId: string | undefined, sessionId: string | undefined) => {
        if (!challengeId || !sessionId) {
            toast({ title: "Error", description: "Missing challenge or session", variant: "destructive" });
            return;
        }
        try {
            await sessionApi.addChallenge(sessionId, challengeId);
            toast({ title: "Challenge added to session" });
            fetchAllData();
        } catch (err: any) {
            const description = isNonNullArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail;
            toast({ title: "Error", description, variant: "destructive" });
        }
    };

    const handleChangeChallengeType = async (challengeId: string | undefined, type: string) => {
        if (!challengeId) return;
        try {
            await challengeApi.updateType(challengeId, type);
            toast({ title: "Challenge type updated" });
            fetchAllData();
        } catch (err: any) {
            const description = isNonNullArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail;
            toast({ title: "Error", description, variant: "destructive" });
        }
    };

    const handleSaveChallenge = async () => {
        try {
            const challengeData = {
                name: challengeName,
                description: challengeDescription || null,
                target: parseInt(challengeTarget) || 0,
                type: challengeType,
            };

            if (editingChallenge) {
                const genericResponse = await challengeApi.update(editingChallenge.id!, challengeData);
                if (challengeSessionId && genericResponse.success) {
                    await sessionApi.addChallenge(challengeSessionId, editingChallenge.id!);
                }
                toast({ title: "Challenge Updated" });
            } else {
                const genericResponse = await challengeApi.create(challengeData);
                if (challengeSessionId && genericResponse.success) {
                    await sessionApi.addChallenge(challengeSessionId, genericResponse.data!.id!);
                }
                toast({ title: "Challenge Created" });
            }

            setChallengeDialogOpen(false);
            resetChallengeForm();
            fetchAllData();
        } catch (error: any) {
            const description =  isNonNullArray(error.invalidParams)  ? error.invalidParams[0].reason : error.detail;
            toast({ title: "Error", description: description, variant: "destructive" });
        }
    };

    const handleEditChallenge = (challenge: Challenge) => {
        setEditingChallenge(challenge);
        setChallengeName(challenge.name);
        setChallengeDescription(challenge.description || '');
        setChallengeTarget(challenge.target.toString());
        setChallengeType(challenge.type);
        setChallengeSessionId(challenge.sessions?.[0]?.id || '');
        setChallengeDialogOpen(true);
    };

    const handleDeleteChallenge = async (id: string) => {
        if (!confirm('This will also delete all subscriptions to this challenge. Continue?')) return;

        try {
            await challengeApi.delete(id);
            toast({ title: "Challenge Deleted" });
            fetchAllData();
        } catch (error: any) {
            const description = isNonNullArray(error.invalidParams)  ? error.invalidParams[0].reason : error.detail;
            toast({ title: "Error", description: description, variant: "destructive" });
        }
    };

    const resetChallengeForm = () => {
        setEditingChallenge(null);
        setChallengeName('');
        setChallengeDescription('');
        setChallengeTarget('');
        setChallengeType(ChallengeType.INDIVIDUAL);
        setChallengeSessionId('');
    };

    // --- User CRUD helpers ---
    const handleSaveUser = async () => {
        try {
            if (editingUser) {
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
            } else {
                await userApi.create({
                    firstName: userFirstName,
                    lastName: userLastName,
                    email: userEmail,
                    password: userPhoneNumber,
                });

                // No create endpoint shown in original api.ts - if you have one, call it here.
                toast({ title: "Create user not implemented in API", description: "Use backend create endpoint", variant: "destructive" });
            }
            setUserDialogOpen(false);
            resetUserForm();
            fetchAllData();
        } catch (error: any) {
            const description = isNonNullArray(error.invalidParams) ? error.invalidParams[0].reason : error.detail;
            toast({ title: "Error", description: description, variant: "destructive" });
        }
    };

    const handleEditUser = (userProfile: User) => {
        setEditingUser(userProfile);
        setUserFirstName(userProfile.firstName || '');
        setUserLastName(userProfile.lastName || '');
        setUserEmail(userProfile.email || '');
        setUserRole(userProfile.role?.toString() || UserRole.USER);
        setUserPhoneNumber(userProfile.phoneNumber || '');
        setUserCountry(userProfile.country || '');
        setUserRegion(userProfile.region || '');
        setUserCity(userProfile.city || '');
        setUserDialogOpen(true);
    };

    const handleViewUser = (userProfile: User) => {
        setViewingUser(userProfile);
        setViewUserDialogOpen(true);
    };

    const handleDeleteUser = async (userId: string | null | undefined) => {
        if (!userId) return;
        try {
            await userApi.deleteUser(userId);
            toast({ title: "User Deleted" });
            fetchAllData();
        } catch (error: any) {
            const description = isNonNullArray(error.invalidParams) ? error.invalidParams[0].reason : error.detail;
            toast({ title: "Error", description: description, variant: "destructive" });
        }
    };

    const resetUserForm = () => {
        setEditingUser(null);
        setUserFirstName('');
        setUserLastName('');
        setUserEmail('');
        setUserRole(UserRole.USER);
        setUserPhoneNumber('');
        setUserCountry('');
        setUserRegion('');
        setUserCity('');
    };

    const handleSubscribeUser = (userProfile: User) => {
        setSubscriptionUserId(userProfile.id || '');
        setSubscriptionChallengeId('');
        setSubscriptionTarget('');
        setEditingSubscription(null);
        setSubscriptionDialogOpen(true);
    };

    // --- Subscription helpers ---
    const handleSaveSubscription = async () => {
        try {
            const subscriptionData: SubscriptionBody = {
                target: parseInt(subscriptionTarget) || 0,
                challengeId: subscriptionChallengeId,
            };

            if (editingSubscription) {
                await subscriptionApi.update(editingSubscription.id!, subscriptionData);
                toast({ title: "Subscription Updated" });
            } else {
                await subscriptionApi.createForUser(subscriptionUserId, subscriptionData);
                toast({ title: "Subscription Created" });
            }

            setSubscriptionDialogOpen(false);
            resetSubscriptionForm();
            fetchAllData();
        } catch (error: any) {
            const description = isNonNullArray(error.invalidParams) ? error.invalidParams[0].reason : error.detail;
            toast({ title: "Error", description: description, variant: "destructive" });
        }
    };

    const handleEditSubscription = (subscription: Subscription) => {
        setEditingSubscription(subscription);
        setSubscriptionUserId(subscription.userId);
        setSubscriptionChallengeId(subscription.challengeId);
        setSubscriptionTarget(subscription.target.toString());
        setSubscriptionDialogOpen(true);
    };

    const handleViewSubscription = (subscription: Subscription) => {
        setViewingSubscription(subscription);
        setViewSubscriptionDialogOpen(true);
    };

    const handleDeleteSubscription = async (id: string) => {
        try {
            await subscriptionApi.delete(id);
            toast({ title: "Subscription Deleted" });
            fetchAllData();
        } catch (error: any) {
            const description = isNonNullArray(error.invalidParams) ? error.invalidParams[0].reason : error.detail;
            toast({ title: "Error", description: description, variant: "destructive" });
        }
    };

    const resetSubscriptionForm = () => {
        setEditingSubscription(null);
        setSubscriptionUserId('');
        setSubscriptionChallengeId('');
        setSubscriptionTarget('');
    };

    // --- Report helpers ---
    const handleSaveReport = async () => {
        try {
            const reportData: ReportRequestBody = {
                numberEvangelizedTo: parseInt(reportEvangelized) || 0,
                numberOfNewConverts: parseInt(reportConverts) || 0,
                numberFollowedUp: parseInt(reportFollowedUp) || 0,
                difficulties: reportDifficulties || undefined,
                remark: reportRemark || undefined,
            };

            if (editingReport) {
                await reportApi.updateForUser(editingReport.id!, reportData);
                toast({ title: "Report Updated" });
            } else {
                await reportApi.createForUser(reportUserId, reportSessionId, reportData);
                toast({ title: "Report Created" });
            }

            setReportDialogOpen(false);
            resetReportForm();
            fetchAllData();
        } catch (error: any) {
            const description = isNonNullArray(error.invalidParams) ? error.invalidParams[0].reason : error.detail;
            toast({ title: "Error", description: description, variant: "destructive" });
        }
    };

    const handleEditReport = (report: ChallengeReport) => {
        setEditingReport(report);
        setReportSessionId(report.subscriptionId);
        setReportEvangelized(report.numberEvangelizedTo.toString());
        setReportConverts(report.numberOfNewConverts.toString());
        setReportFollowedUp(report.numberFollowedUp.toString());
        setReportDifficulties(report.difficulties || '');
        setReportRemark(report.remark || '');
        setReportDialogOpen(true);
    };

    const handleViewReport = (report: ChallengeReport) => {
        setViewingReport(report);
        setViewReportDialogOpen(true);
    };

    const handleDeleteReport = async (id: string) => {
        try {
            await reportApi.delete(id);
            toast({ title: "Report Deleted" });
            fetchAllData();
        } catch (error: any) {
            const description = isNonNullArray(error.invalidParams) ? error.invalidParams[0].reason : error.detail;
            toast({ title: "Error", description: description, variant: "destructive" });
        }
    };

    const resetReportForm = () => {
        setEditingReport(null);
        setReportSessionId('');
        setReportUserId('');
        setReportEvangelized('');
        setReportConverts('');
        setReportFollowedUp('');
        setReportDifficulties('');
        setReportRemark('');
    };

    const getErrorDescription = (error: any) => {
        return isNonNullArray(error.invalidParams) ? error.invalidParams[0].reason : error.detail;
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
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
            {/* Header */}
            <header className="bg-primary shadow-gentle">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-divine rounded-full flex items-center justify-center">
                            <Shield className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold text-primary-foreground">Admin Panel</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="text-primary-foreground hover:bg-primary-foreground/10">
                            <Home className="w-4 h-4 mr-2" />
                            Home
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="text-primary-foreground hover:bg-primary-foreground/10">
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
                                            <DialogTitle>{editingSession ? 'Edit Session' : 'Create Session'}</DialogTitle>
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
                                                    <Select value={sessionStatus?.toString() || SessionStatus.UPCOMING} onValueChange={setSessionStatus}>
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
                                                    {editingSession ? 'Update Session' : 'Create Session'}
                                                </Button>
                                            </DialogFooter>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {sessions.map(session => (
                                <Card key={session.id} className="shadow-gentle hover:shadow-md transition-shadow">
                                    <CardContent className="py-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="font-semibold text-lg">{session.name}</h3>
                                                    <Badge variant={session.status === SessionStatus.ONGOING ? 'default' : 'secondary'}>
                                                        {session.status?.toString()}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{session.description}</p>
                                                <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-muted-foreground">
                            📅 {new Date(session.startDate).toLocaleDateString()} - {new Date(session.endDate).toLocaleDateString()}
                          </span>
                                                    {session.challenges && (
                                                        <span className="text-xs text-muted-foreground">
                              🎯 {session.challenges.length} challenges
                            </span>
                                                    )}
                                                </div>

                                                {/* Expanded session details */}
                                                {expandedSessionId === session.id && (
                                                    <div className="mt-4 border-t pt-4 space-y-4">
                                                        <div className="flex gap-2">
                                                            <Button size="sm" onClick={() => handleAddChallengeToSession(session.id)}>
                                                                <Plus className="w-4 h-4 mr-2" /> Add Challenge
                                                            </Button>
                                                            <Select value={session.status.toString() || SessionStatus.UPCOMING.toString()} onValueChange={(val) => handleChangeSessionStatus(session.id, val as SessionStatus)}>
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

                                                        <div>
                                                            <h4 className="font-semibold text-sm mb-2">Challenges in this session</h4>
                                                            <div className="space-y-2">
                                                                {session.challenges && session.challenges.length > 0 ? (
                                                                    session.challenges.map(ch => (
                                                                        <div key={ch.id} className="flex items-center justify-between bg-muted/10 p-2 rounded">
                                                                            <div>
                                                                                <div className="font-medium">{ch.name}</div>
                                                                                <div className="text-xs text-muted-foreground">
                                                                                    {ch.type?.toString()} · Target: {ch.target}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex gap-2">
                                                                                <Button size="sm" variant="ghost" onClick={() => toggleViewChallenge(ch)}>
                                                                                    <Eye className="w-4 h-4" />
                                                                                </Button>
                                                                                <Button size="sm" variant="ghost" onClick={() => handleRemoveChallengeFromSession(session.id, ch.id)}>
                                                                                    <X className="w-4 h-4 text-destructive" />
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <div className="text-xs text-muted-foreground">No challenges assigned.</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
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
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="sm" title="Delete">
                                                                <Trash2 className="w-4 h-4 text-destructive" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete Session</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This will delete the session "{session.name}" and all associated data. This action cannot be undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeleteSession(session.id!)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {sessions.length === 0 && (
                                <Card className="shadow-gentle">
                                    <CardContent className="py-12 text-center">
                                        <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground">No sessions created yet.</p>
                                        <p className="text-sm text-muted-foreground">Click "Add Session" to create your first session.</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </TabsContent>

                    {/* Challenges Tab */}
                    <TabsContent value="challenges">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Challenges ({challenges.length})</h2>
                            <Dialog open={challengeDialogOpen} onOpenChange={setChallengeDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button onClick={resetChallengeForm}>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Challenge
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{editingChallenge ? 'Edit Challenge' : 'Create Challenge'}</DialogTitle>
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
                                                    {sessions.map(s => (
                                                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button onClick={handleSaveChallenge} className="w-full">
                                            {editingChallenge ? 'Update' : 'Create'}
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="space-y-4">
                            {challenges.map(challenge => {
                                const session = sessions.find(s =>
                                    challenge.sessions && challenge.sessions.some(cs => cs.id === s.id)
                                );
                                return (
                                    <Card key={challenge.id} className="shadow-gentle">
                                        <CardContent className="py-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold">{challenge.name}</h3>
                                                    <p className="text-sm text-muted-foreground">{challenge.description}</p>
                                                    <div className="flex items-center gap-4 mt-2">
                                                        <Badge variant="outline">{challenge.type?.toString()}</Badge>
                                                        <span className="text-xs text-muted-foreground">Target: {challenge.target}</span>
                                                        {session && (
                                                            <span className="text-xs text-muted-foreground">Session: {session.name}</span>
                                                        )}
                                                    </div>

                                                    {/* Expanded challenge details */}
                                                    {expandedChallengeId === challenge.id && (
                                                        <div className="mt-4 border-t pt-4 space-y-3">
                                                            <div className="flex gap-2">
                                                                <Select value={challengeType?.toString()} onValueChange={(val) => handleChangeChallengeType(challenge.id, val)}>
                                                                    <SelectTrigger>
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value={ChallengeType.NORMAL}>Normal</SelectItem>
                                                                        <SelectItem value={ChallengeType.EVENT}>Event</SelectItem>
                                                                        <SelectItem value={ChallengeType.INDIVIDUAL}>Individual</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                <Select value={challengeSessionId} onValueChange={setChallengeSessionId}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Add to session" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {sessions.map(s => (
                                                                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <Button size="sm" onClick={() => handleAddExistingChallengeToSession(challenge.id, challengeSessionId)}>
                                                                    Add to Session
                                                                </Button>
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                Created: {challenge.createdOn || 'n/a'} · Updated: {challenge.updatedOn || 'n/a'}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => toggleViewChallenge(challenge)}>
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleEditChallenge(challenge)}>
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteChallenge(challenge.id!)}>
                                                        <Trash2 className="w-4 h-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                            {challenges.length === 0 && (
                                <p className="text-center text-muted-foreground py-8">No challenges created yet.</p>
                            )}
                        </div>
                    </TabsContent>

                    {/* Users Tab */}
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
                            {users.map(userProfile => (
                                <Card key={userProfile.id} className="shadow-gentle">
                                    <CardContent className="py-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold">{userProfile.firstName} {userProfile.lastName}</h3>
                                                <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => handleViewUser(userProfile)} title="View">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleEditUser(userProfile)} title="Edit">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(userProfile.id)}>
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </Button>
                                                <Button size="sm" onClick={() => handleSubscribeUser(userProfile)}>
                                                    Subscribe
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* View User Dialog */}
                        <Dialog open={viewUserDialogOpen} onOpenChange={setViewUserDialogOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>User Details</DialogTitle>
                                </DialogHeader>
                                <div className="py-2">
                                    <div className="text-sm"><strong>Name:</strong> {viewingUser?.firstName} {viewingUser?.lastName}</div>
                                    <div className="text-sm"><strong>Email:</strong> {viewingUser?.email}</div>
                                    <div className="text-sm"><strong>Role:</strong> {viewingUser?.role.toString()}</div>
                                    <div className="text-sm"><strong>Phone:</strong> {viewingUser?.phoneNumber}</div>
                                    <div className="text-sm"><strong>Location:</strong> {viewingUser?.city}, {viewingUser?.region}, {viewingUser?.country}</div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={() => setViewUserDialogOpen(false)}>Close</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </TabsContent>

                    {/* Subscriptions Tab */}
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
                            {subscriptions.map(sub => {
                                const challenge = challenges.find(c => c.id === sub.challengeId);
                                const userProfile = users.find(u => u.id === sub.userId);
                                return (
                                    <Card key={sub.id} className="shadow-gentle">
                                        <CardContent className="py-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-semibold">{userProfile?.firstName || 'Unknown'} → {challenge?.name || 'Unknown'}</h3>
                                                    <p className="text-sm text-muted-foreground">Target: {sub.target}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => handleViewSubscription(sub)}>
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleEditSubscription(sub)}>
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteSubscription(sub.id!)}>
                                                        <Trash2 className="w-4 h-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* View Subscription Dialog */}
                        <Dialog open={viewSubscriptionDialogOpen} onOpenChange={setViewSubscriptionDialogOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Subscription Details</DialogTitle>
                                </DialogHeader>
                                <div className="py-2">
                                    <div className="text-sm"><strong>User:</strong> {viewingSubscription ? users.find(u => u.id === viewingSubscription.userId)?.firstName : ''}</div>
                                    <div className="text-sm"><strong>Challenge:</strong> {viewingSubscription ? challenges.find(c => c.id === viewingSubscription.challengeId)?.name : ''}</div>
                                    <div className="text-sm"><strong>Target:</strong> {viewingSubscription?.target}</div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={() => setViewSubscriptionDialogOpen(false)}>Close</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </TabsContent>

                    {/* Reports Tab */}
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
                            {reports.map(report => (
                                <Card key={report.id} className="shadow-gentle">
                                    <CardContent className="py-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="grid grid-cols-3 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-muted-foreground">Evangelized:</span> {report.numberEvangelizedTo}
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Converts:</span> {report.numberOfNewConverts}
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Followed up:</span> {report.numberFollowedUp}
                                                    </div>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-2">Date: {report.reportDate}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="sm" onClick={() => handleViewReport(report)}>
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleEditReport(report)}>
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteReport(report.id!)}>
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* View Report Dialog */}
                        <Dialog open={viewReportDialogOpen} onOpenChange={setViewReportDialogOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Report Details</DialogTitle>
                                </DialogHeader>
                                <div className="py-2">
                                    <div className="text-sm"><strong>Evangelized:</strong> {viewingReport?.numberEvangelizedTo}</div>
                                    <div className="text-sm"><strong>Converts:</strong> {viewingReport?.numberOfNewConverts}</div>
                                    <div className="text-sm"><strong>Followed up:</strong> {viewingReport?.numberFollowedUp}</div>
                                    <div className="text-sm"><strong>Difficulties:</strong> {viewingReport?.difficulties}</div>
                                    <div className="text-sm"><strong>Remark:</strong> {viewingReport?.remark}</div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={() => setViewReportDialogOpen(false)}>Close</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </TabsContent>
                </Tabs>
            </main>

            {/* Reuse existing dialogs for create/edit user, challenge, subscription, report */}
            {/* User dialog */}
            <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingUser ? 'Edit User' : 'Create User'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>First name</Label>
                                <Input value={userFirstName} onChange={(e) => setUserFirstName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Last name</Label>
                                <Input value={userLastName} onChange={(e) => setUserLastName(e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Role</Label>
                                <Select value={userRole} onValueChange={setUserRole}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={UserRole.USER}>User</SelectItem>
                                        <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                                        <SelectItem value={UserRole.SUPER_ADMIN}>Super Admin</SelectItem>
                                        <SelectItem value={UserRole.ECOMIEST}>Ecomiest</SelectItem>
                                        <SelectItem value={UserRole.COACH}>Coach</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Phone</Label>
                                <Input value={userPhoneNumber} onChange={(e) => setUserPhoneNumber(e.target.value)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Country</Label>
                                <Input value={userCountry} onChange={(e) => setUserCountry(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Region</Label>
                                <Input value={userRegion} onChange={(e) => setUserRegion(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>City</Label>
                                <Input value={userCity} onChange={(e) => setUserCity(e.target.value)} />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button onClick={handleSaveUser} className="w-full">{editingUser ? 'Update User' : 'Create User'}</Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Challenge dialog is already included in the markup earlier via Dialog open state */}
            {/* Subscription dialog */}
            <Dialog open={subscriptionDialogOpen} onOpenChange={setSubscriptionDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingSubscription ? 'Edit Subscription' : 'Create Subscription'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>User</Label>
                            <Select value={subscriptionUserId} onValueChange={setSubscriptionUserId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a user" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map(u => <SelectItem key={u.id} value={u.id}>{u.firstName} {u.lastName}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Challenge</Label>
                            <Select value={subscriptionChallengeId} onValueChange={setSubscriptionChallengeId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a challenge" />
                                </SelectTrigger>
                                <SelectContent>
                                    {challenges.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Target</Label>
                            <Input type="number" value={subscriptionTarget} onChange={(e) => setSubscriptionTarget(e.target.value)} />
                        </div>

                        <DialogFooter>
                            <Button onClick={handleSaveSubscription} className="w-full">{editingSubscription ? 'Update' : 'Create'}</Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Report dialog */}
            <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingReport ? 'Edit Report' : 'Create Report'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Subscription</Label>
                            <Select value={reportSessionId} onValueChange={setReportSessionId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select subscription/session" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subscriptions.map(s => <SelectItem key={s.id} value={s.id}>{s.name || s.id}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Evangelized</Label>
                                <Input type="number" value={reportEvangelized} onChange={(e) => setReportEvangelized(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Converts</Label>
                                <Input type="number" value={reportConverts} onChange={(e) => setReportConverts(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Followed up</Label>
                                <Input type="number" value={reportFollowedUp} onChange={(e) => setReportFollowedUp(e.target.value)} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Difficulties</Label>
                            <Textarea value={reportDifficulties} onChange={(e) => setReportDifficulties(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Remark</Label>
                            <Textarea value={reportRemark} onChange={(e) => setReportRemark(e.target.value)} />
                        </div>

                        <DialogFooter>
                            <Button onClick={handleSaveReport} className="w-full">{editingReport ? 'Update' : 'Create'}</Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Admin;