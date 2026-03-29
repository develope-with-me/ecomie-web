import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import {
    userApi,
    subscriptionApi,
    reportApi,
    challengeApi,
    sessionApi,
    User as UserType,
    Subscription,
    ChallengeReport,
    Challenge,
    Session,
    SessionStatus,
    UserRole,
    ReportRequestBody,
} from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import {
    User, LogOut, Heart, Calendar, FileText, Target,
    Plus, Edit, Trash2, Home, Shield, Eye, ChevronLeft,
    ChevronRight, ZoomIn, ZoomOut, Minimize2, Maximize2,
    Star, Crown, LayoutDashboard,
} from 'lucide-react';
import {formatDate, computeUserName, isNonNullArray} from '@/lib/utils';
import ecomieLogo from "@/images/ecomie-logo.png";
import ReportsCalendar from '@/components/ReportsCalendar';

const challengeIcons: Record<string, React.ElementType> = {
    'Faithful': Heart,
    'Devoted': Star,
    'Shepherd': Crown,
};

const challengeColors: Record<string, string> = {
    'Faithful': 'text-peaceful-green',
    'Devoted': 'text-accent',
    'Shepherd': 'text-primary',
};

const Dashboard = () => {
    const { user, isAdmin, signOut, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const isEcomiest = user?.role === UserRole.ECOMIEST;

    const [profile, setProfile] = useState<UserType | null>(null);
    const [ongoingSession, setOngoingSession] = useState<Session | null>(null);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [reports, setReports] = useState<ChallengeReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

    const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

    const [editingProfile, setEditingProfile] = useState(false);
    const [profileFirstName, setProfileFirstName] = useState('');
    const [profileLastName, setProfileLastName] = useState('');
    const [profilePhoneNumber, setProfilePhoneNumber] = useState('');
    const [profileCountry, setProfileCountry] = useState('');
    const [profileRegion, setProfileRegion] = useState('');
    const [profileCity, setProfileCity] = useState('');
    const [profileLanguage, setProfileLanguage] = useState('');
    const [profileAvatar, setProfileAvatar] = useState<File | null>(null);
    const [profileAvatarPreview, setProfileAvatarPreview] = useState<string | null>(null);

    const [viewReportDialogOpen, setViewReportDialogOpen] = useState(false);
    const [viewingReport, setViewingReport] = useState<ChallengeReport | null>(null);
    const [editReportDialogOpen, setEditReportDialogOpen] = useState(false);
    const [editingReport, setEditingReport] = useState<ChallengeReport | null>(null);
    const [addReportDialogOpen, setAddReportDialogOpen] = useState(false);
    const [newReportSubscriptionId, setNewReportSubscriptionId] = useState('');
    const [reportEvangelized, setReportEvangelized] = useState('');
    const [reportConverts, setReportConverts] = useState('');
    const [reportFollowedUp, setReportFollowedUp] = useState('');
    const [reportDifficulties, setReportDifficulties] = useState('');
    const [reportRemark, setReportRemark] = useState('');

    const [subscribeDialogOpen, setSubscribeDialogOpen] = useState(false);
    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
    const [personalTarget, setPersonalTarget] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [sessionExpanded, setSessionExpanded] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/auth');
        } else if (user) {
            fetchData();
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.profile-dropdown')) {
                setProfileDropdownOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const fetchData = async () => {
        try {
            const profileData = await userApi.getMyUserProfile();
            setProfile(profileData);
            setProfileFirstName(profileData.firstName || '');
            setProfileLastName(profileData.lastName || '');
            setProfilePhoneNumber(profileData.phoneNumber || '');
            setProfileCountry(profileData.country || '');
            setProfileRegion(profileData.region || '');
            setProfileCity(profileData.city || '');
            setProfileLanguage(profileData.language || '');

            const [ongoingSessionData, subscriptionsData, reportsData, profilePix] = await Promise.all([
                sessionApi.getOngoingSession().catch(() => null),
                subscriptionApi.getMine().catch(() => null),
                isEcomiest ? reportApi.getMine().catch(() => null) : Promise.resolve([]),
                userApi.getMyPix().catch(() => null),
            ]);

            setOngoingSession(ongoingSessionData);
            setSubscriptions(subscriptionsData ? subscriptionsData : []);
            setReports(reportsData ? reportsData : []);
            setProfilePicture(profilePix);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            await userApi.updateMyProfile({
                firstName: profileFirstName,
                lastName: profileLastName,
                phoneNumber: profilePhoneNumber,
                country: profileCountry,
                region: profileRegion,
                city: profileCity,
                language: profileLanguage,
                avatar: profileAvatar,
            });
            setProfile(prev => prev ? { 
                ...prev, 
                firstName: profileFirstName, 
                lastName: profileLastName,
                phoneNumber: profilePhoneNumber,
                country: profileCountry,
                region: profileRegion,
                city: profileCity,
                language: profileLanguage,
            } : null);
            setEditingProfile(false);
            setProfileAvatar(null);
            setProfileAvatarPreview(null);
            toast({ title: "Profile Updated", description: "Your profile has been updated successfully." });
        } catch (err: any) {
            toast({ title: "Error", description: isNonNullArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail, variant: "destructive" });
        }
    };

    const handleOpenSubscribeDialog = (challenge: Challenge) => {
        setSelectedChallenge(challenge);
        setPersonalTarget(challenge.target.toString());
        setSubscribeDialogOpen(true);
    };

    const handleSubscribe = async () => {
        if (!selectedChallenge) return;
        setSubmitting(true);
        try {
            await subscriptionApi.create({ 
                target: parseInt(personalTarget) || selectedChallenge.target, 
                challengeId: selectedChallenge.id 
            });
            toast({ title: "Subscribed", description: "You have successfully subscribed to the challenge." });
            setSubscribeDialogOpen(false);
            setSelectedChallenge(null);
            fetchData();
        } catch (err: any) {
            toast({ title: "Error", description: isNonNullArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail, variant: "destructive" });
        } finally {
            setSubmitting(false);
        }
    };

    const handleViewReport = (report: ChallengeReport) => {
        setViewingReport(report);
        setViewReportDialogOpen(true);
    };

    const handleEditReport = (report: ChallengeReport) => {
        setEditingReport(report);
        setNewReportSubscriptionId(report.subscriptionId);
        setReportEvangelized(report.numberEvangelizedTo.toString());
        setReportConverts(report.numberOfNewConverts.toString());
        setReportFollowedUp(report.numberFollowedUp.toString());
        setReportDifficulties(report.difficulties || '');
        setReportRemark(report.remark || '');
        setEditReportDialogOpen(true);
    };

    const handleSaveReport = async () => {
        if (!editingReport) return;
        try {
            const body: Partial<ReportRequestBody> = {
                numberEvangelizedTo: parseInt(reportEvangelized) || 0,
                numberOfNewConverts: parseInt(reportConverts) || 0,
                numberFollowedUp: parseInt(reportFollowedUp) || 0,
                difficulties: reportDifficulties || undefined,
                remark: reportRemark || undefined,
            };
            await reportApi.update(editingReport.id!, body);
            toast({ title: "Report Updated" });
            setEditReportDialogOpen(false);
            fetchData();
        } catch (err: any) {
            toast({ title: "Error", description: isNonNullArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail, variant: "destructive" });
        }
    };

    const handleAddReport = async () => {
        if (!newReportSubscriptionId) {
            toast({ title: "Error", description: "Please select a subscription", variant: "destructive" });
            return;
        }
        try {
            const body: ReportRequestBody = {
                numberEvangelizedTo: parseInt(reportEvangelized) || 0,
                numberOfNewConverts: parseInt(reportConverts) || 0,
                numberFollowedUp: parseInt(reportFollowedUp) || 0,
                difficulties: reportDifficulties || undefined,
                remark: reportRemark || undefined,
            };
            await reportApi.create(newReportSubscriptionId, body);
            toast({ title: "Report Created" });
            setAddReportDialogOpen(false);
            resetReportForm();
            fetchData();
        } catch (err: any) {
            toast({ title: "Error", description: isNonNullArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail, variant: "destructive" });
        }
    };

    const resetReportForm = () => {
        setEditingReport(null);
        setNewReportSubscriptionId('');
        setReportEvangelized('');
        setReportConverts('');
        setReportFollowedUp('');
        setReportDifficulties('');
        setReportRemark('');
    };

    const handleDeleteReport = async (reportId: string) => {
        try {
            await reportApi.delete(reportId);
            setReports(prev => prev.filter(r => r.id !== reportId));
            toast({ title: "Report Deleted" });
        } catch (err: any) {
            toast({ title: "Error", description: isNonNullArray(err.invalidParams) ? err.invalidParams[0].reason : err.detail, variant: "destructive" });
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const toggleSessionExpansion = (sessionId: string) => {
        setExpandedSessionId(expandedSessionId === sessionId ? null : sessionId);
    };

    const isSubscribedToChallenge = (challengeId: string | undefined) => {
        if (!challengeId) return false;
        // if(subscriptions == null) return false;
        return subscriptions.some(sub => sub.user?.id === user.id && sub.challenge?.id === challengeId);
    };

    const renderChallengeCards = (challenges: Challenge[], showSubscribeButton: boolean = true) => (
        <div className="grid md:grid-cols-3 gap-6">
            {challenges.map((challenge) => {
                const IconComponent = challengeIcons[challenge.name] || Heart;
                const colorClass = challengeColors[challenge.name] || 'text-primary';
                const subscribed = isSubscribedToChallenge(challenge.id);
                
                return (
                    <Card key={challenge.id} className="shadow-gentle hover:shadow-md transition-all">
                        <CardHeader className="text-center pb-4">
                            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
                                <IconComponent className={`w-6 h-6 ${colorClass}`} />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">{challenge.name}</h3>
                            <p className="text-sm text-muted-foreground">{challenge.description}</p>
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2">
                                <Target className="w-4 h-4" />
                                <span>Target: {challenge.target} souls</span>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Type:</span>
                                    <Badge variant="secondary">{challenge.type?.toString()}</Badge>
                                </div>
                            </div>
                            {showSubscribeButton && ongoingSession?.status === SessionStatus.ONGOING && (
                                subscribed ? (
                                    <Button variant="outline" className="w-full" disabled>
                                        Already Subscribed
                                    </Button>
                                ) : (
                                    <Button variant="cta" className="w-full" onClick={() => handleOpenSubscribeDialog(challenge)}>
                                        Subscribe
                                    </Button>
                                )
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );

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
                        <div className="w-10 h-10 bg-gradient-heavenly rounded-full flex items-center justify-center shadow-gentle">
                            <img src={ecomieLogo} className="w-full h-full" alt="ECOMIE Logo"/>
                        </div>
                        <span className="text-xl font-bold text-primary-foreground">ECOMIE</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative profile-dropdown">
                            <button 
                                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                className="flex items-center gap-2 text-primary-foreground hover:bg-primary-foreground/10 px-3 py-2 rounded-md transition-colors"
                            >
                                {profilePicture ? (
                                    <img 
                                        src={profilePicture} 
                                        alt="Profile" 
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gradient-heavenly flex items-center justify-center">
                                        <User className="w-4 h-4 text-primary" />
                                    </div>
                                )}
                                <span className="font-medium">{profileFirstName || 'User'}</span>
                            </button>
                            {profileDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border z-50">
                                    <div className="px-4 py-3 border-b">
                                        <p className="text-sm font-medium text-foreground">
                                            {profileFirstName} {profileLastName}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{profile?.email}</p>
                                    </div>
                                    <button 
                                        onClick={() => { setProfileDropdownOpen(false); navigate('/'); }}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                                    >
                                        <Home className="w-4 h-4" />
                                        Home
                                    </button>
                                    <button 
                                        onClick={() => { setProfileDropdownOpen(false); navigate('/dashboard'); }}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        Dashboard
                                    </button>
                                    {isAdmin && (
                                        <button 
                                            onClick={() => { setProfileDropdownOpen(false); navigate('/admin'); }}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                                        >
                                            <Shield className="w-4 h-4" />
                                            Admin Panel
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => {
                                            setProfileDropdownOpen(false);
                                            handleSignOut();
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-foreground mb-8">
                    Welcome, {profile?.firstName || profile?.lastName || 'Evangelist'}!
                </h1>

                <Tabs defaultValue="sessions" className="w-full">
                    <TabsList className="grid w-full max-w-2xl grid-cols-3 mb-8">
                        <TabsTrigger value="sessions" className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Sessions
                        </TabsTrigger>
                        {isEcomiest && (
                            <TabsTrigger value="reports" className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Reports
                            </TabsTrigger>
                        )}
                        <TabsTrigger value="profile" className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Profile
                        </TabsTrigger>
                    </TabsList>

                    {/* Sessions Tab */}
                    <TabsContent value="sessions">
                        <div className="space-y-6">
                            {ongoingSession && (
                                <Card className="shadow-gentle">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle>Current Session</CardTitle>
                                            <Button variant="ghost" size="sm" onClick={() => setSessionExpanded(!sessionExpanded)}>
                                                {sessionExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    {sessionExpanded && (
                                        <CardContent>
                                            <Card className="shadow-gentle mb-4">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="flex items-center gap-3 text-lg">
                                                        <Badge variant="default" className="bg-peaceful-green">{ongoingSession.status?.toString()}</Badge>
                                                        <span>{ongoingSession.name}</span>
                                                    </CardTitle>
                                                    <p className="text-sm text-muted-foreground">{ongoingSession.description}</p>
                                                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            {formatDate(ongoingSession.startDate)} - {formatDate(ongoingSession.endDate)}
                                                        </span>
                                                    </div>
                                                </CardHeader>
                                            </Card>
                                            {ongoingSession.challenges && ongoingSession.challenges.length > 0 ? (
                                                renderChallengeCards(ongoingSession.challenges)
                                            ) : (
                                                <p className="text-muted-foreground">No challenges for this session yet.</p>
                                            )}
                                        </CardContent>
                                    )}
                                </Card>
                            )}

                            {subscriptions.length > 0 && isEcomiest && (
                                <div>
                                    <h2 className="text-xl font-semibold text-foreground mb-4">My Past Subscriptions</h2>
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-5 gap-4 p-3 bg-muted rounded-t-lg font-medium text-sm">
                                            <div>Session</div>
                                            <div>Challenge</div>
                                            <div>Challenge Target</div>
                                            <div>Pledge</div>
                                            <div>Subscribed On</div>
                                        </div>
                                        {subscriptions.map(sub => (
                                            <div key={sub.id}>
                                                <div 
                                                    className="grid grid-cols-5 gap-4 p-3 bg-card rounded-lg shadow-gentle cursor-pointer hover:bg-muted/50 transition-colors"
                                                    onClick={() => toggleSessionExpansion(sub.id!)}
                                                >
                                                    <div className="font-medium truncate">{sub.session?.name || '-'}</div>
                                                    <div className="truncate">{sub.challenge?.name || '-'}</div>
                                                    <div>{sub.challenge?.target || '-'}</div>
                                                    <div>{sub.target || '-'}</div>
                                                    <div className="text-muted-foreground text-sm">{formatDate(sub.createdOn)}</div>
                                                </div>
                                                {expandedSessionId === sub.id && sub.session && (
                                                    <Card className="mt-2 shadow-gentle">
                                                        <CardHeader>
                                                            <CardTitle className="flex items-center gap-3 text-lg">
                                                                <Badge variant="secondary">{sub.session.status?.toString()}</Badge>
                                                                <span>{sub.session.name}</span>
                                                            </CardTitle>
                                                            <p className="text-muted-foreground">{sub.session.description}</p>
                                                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar className="w-4 h-4" />
                                                                    {formatDate(sub.session.startDate)} - {formatDate(sub.session.endDate)}
                                                                </span>
                                                            </div>
                                                        </CardHeader>
                                                        {sub.challenge && (
                                                            <CardContent>
                                                                {renderChallengeCards([sub.challenge], false)}
                                                            </CardContent>
                                                        )}
                                                    </Card>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    {/* Reports Tab - Only visible for ECOMIEST */}
                    {isEcomiest && (
                        <TabsContent value="reports">
                            <div className="space-y-6">
                                <ReportsCalendar 
                                    reports={reports}
                                    title="Reports Calendar"
                                    onViewReport={handleViewReport}
                                    onEditReport={handleEditReport}
                                    defaultView="year"
                                />

                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-foreground">My Reports</h2>
                                    <Dialog open={addReportDialogOpen} onOpenChange={setAddReportDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Add Report
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Submit Report</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <Label>Subscription</Label>
                                                    <select 
                                                        className="w-full p-2 border rounded-md"
                                                        value={newReportSubscriptionId}
                                                        onChange={(e) => setNewReportSubscriptionId(e.target.value)}
                                                    >
                                                        <option value="">Select a subscription</option>
                                                        {subscriptions.map(sub => (
                                                            <option key={sub.id} value={sub.id}>
                                                                {sub.challenge?.name} - {sub.session?.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Evangelized To</Label>
                                                        <Input type="number" value={reportEvangelized} onChange={(e) => setReportEvangelized(e.target.value)} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>New Converts</Label>
                                                        <Input type="number" value={reportConverts} onChange={(e) => setReportConverts(e.target.value)} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Followed Up</Label>
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
                                                    <Button onClick={handleAddReport} className="w-full">Submit Report</Button>
                                                </DialogFooter>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                {reports.length === 0 ? (
                                    <Card className="shadow-gentle">
                                        <CardContent className="py-12 text-center">
                                            <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                            <p className="text-muted-foreground">No reports submitted yet.</p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-12 gap-4 p-3 bg-muted rounded-t-lg font-medium text-sm">
                                            <div className="col-span-2">Session</div>
                                            <div className="col-span-2">Challenge</div>
                                            <div className="col-span-1">Target</div>
                                            <div className="col-span-1">Pledge</div>
                                            <div className="col-span-1">Evangelized</div>
                                            <div className="col-span-1">Converts</div>
                                            <div className="col-span-1">Follow Ups</div>
                                            <div className="col-span-2">Reported On</div>
                                            <div className="col-span-1 text-right">Actions</div>
                                        </div>
                                        {reports.map(report => (
                                            <Card key={report.id} className="shadow-gentle">
                                                <CardContent className="py-4">
                                                    <div className="grid grid-cols-12 gap-4 items-center">
                                                        <div className="col-span-2 truncate">{report.subscription?.session?.name || '-'}</div>
                                                        <div className="col-span-2 truncate">{report.subscription?.challenge?.name || '-'}</div>
                                                        <div className="col-span-1">{report.subscription?.challenge?.target || '-'}</div>
                                                        <div className="col-span-1">{report.subscription?.target || '-'}</div>
                                                        <div className="col-span-1">{report.numberEvangelizedTo || '-'}</div>
                                                        <div className="col-span-1">{report.numberOfNewConverts || '-'}</div>
                                                        <div className="col-span-1">{report.numberFollowedUp || '-'}</div>
                                                        <div className="col-span-2 text-sm text-muted-foreground">{formatDate(report.createdOn)}</div>
                                                        <div className="col-span-1 flex justify-end gap-2">
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
                                )}
                            </div>
                        </TabsContent>
                    )}

                    {/* Profile Tab */}
                    <TabsContent value="profile">
                        <Card className="max-w-2xl shadow-gentle">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Profile Information</span>
                                    {!editingProfile && (
                                        <Button variant="outline" size="sm" onClick={() => setEditingProfile(true)}>
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {editingProfile ? (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">First Name</Label>
                                                <Input id="firstName" value={profileFirstName} onChange={(e) => setProfileFirstName(e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input id="lastName" value={profileLastName} onChange={(e) => setProfileLastName(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" value={profile?.email || ''} disabled />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="avatar">Profile Picture</Label>
                                            <Input 
                                                id="avatar" 
                                                type="file" 
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setProfileAvatar(file);
                                                        setProfileAvatarPreview(URL.createObjectURL(file));
                                                    }
                                                }} 
                                            />
                                            {profileAvatarPreview && (
                                                <div className="mt-2">
                                                    <img 
                                                        src={profileAvatarPreview} 
                                                        alt="Avatar preview" 
                                                        className="w-20 h-20 rounded-full object-cover"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phoneNumber">Phone Number</Label>
                                            <Input id="phoneNumber" value={profilePhoneNumber} onChange={(e) => setProfilePhoneNumber(e.target.value)} />
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="country">Country</Label>
                                                <Input id="country" value={profileCountry} onChange={(e) => setProfileCountry(e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="region">Region</Label>
                                                <Input id="region" value={profileRegion} onChange={(e) => setProfileRegion(e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="city">City</Label>
                                                <Input id="city" value={profileCity} onChange={(e) => setProfileCity(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="language">Language</Label>
                                            <Input id="language" value={profileLanguage} onChange={(e) => setProfileLanguage(e.target.value)} />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button onClick={handleUpdateProfile}>Save Changes</Button>
                                            <Button variant="outline" onClick={() => {
                                                setEditingProfile(false);
                                                setProfileAvatar(null);
                                                setProfileAvatarPreview(null);
                                            }}>Cancel</Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="text-muted-foreground">First Name</Label>
                                                <p className="text-foreground font-medium">{profile?.firstName || '-'}</p>
                                            </div>
                                            <div>
                                                <Label className="text-muted-foreground">Last Name</Label>
                                                <p className="text-foreground font-medium">{profile?.lastName || '-'}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground">Email</Label>
                                            <p className="text-foreground font-medium">{profile?.email || '-'}</p>
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground">Phone Number</Label>
                                            <p className="text-foreground font-medium">{profile?.phoneNumber || '-'}</p>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <Label className="text-muted-foreground">Country</Label>
                                                <p className="text-foreground font-medium">{profile?.country || '-'}</p>
                                            </div>
                                            <div>
                                                <Label className="text-muted-foreground">Region</Label>
                                                <p className="text-foreground font-medium">{profile?.region || '-'}</p>
                                            </div>
                                            <div>
                                                <Label className="text-muted-foreground">City</Label>
                                                <p className="text-foreground font-medium">{profile?.city || '-'}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground">Language</Label>
                                            <p className="text-foreground font-medium">{profile?.language || '-'}</p>
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground">Role</Label>
                                            <p className="text-foreground font-medium">{profile?.role?.toString() || '-'}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>

            {/* View Report Dialog */}
            <Dialog open={viewReportDialogOpen} onOpenChange={setViewReportDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Report Details</DialogTitle>
                    </DialogHeader>
                    {viewingReport && (
                        <div className="space-y-3 py-4">
                            <div className="text-sm"><strong>Session:</strong> {viewingReport.subscription?.session?.name || '-'}</div>
                            <div className="text-sm"><strong>Challenge:</strong> {viewingReport.subscription?.challenge?.name || '-'}</div>
                            <div className="text-sm"><strong>Pledge:</strong> {viewingReport.subscription?.target || '-'}</div>
                            <div className="text-sm"><strong>Target:</strong> {viewingReport.subscription?.challenge?.target || '-'}</div>
                            <div className="text-sm"><strong>Evangelized To:</strong> {viewingReport.numberEvangelizedTo}</div>
                            <div className="text-sm"><strong>New Converts:</strong> {viewingReport.numberOfNewConverts}</div>
                            <div className="text-sm"><strong>Followed Up:</strong> {viewingReport.numberFollowedUp}</div>
                            <div className="text-sm"><strong>Difficulties:</strong> {viewingReport.difficulties || '-'}</div>
                            <div className="text-sm"><strong>Remark:</strong> {viewingReport.remark || '-'}</div>
                            <div className="text-sm"><strong>Created On:</strong> {formatDate(viewingReport.createdOn)}</div>
                            <div className="text-sm"><strong>Updated On:</strong> {formatDate(viewingReport.updatedOn)}</div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setViewReportDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Report Dialog */}
            <Dialog open={editReportDialogOpen} onOpenChange={setEditReportDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Report</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Evangelized To</Label>
                                <Input type="number" value={reportEvangelized} onChange={(e) => setReportEvangelized(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>New Converts</Label>
                                <Input type="number" value={reportConverts} onChange={(e) => setReportConverts(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Followed Up</Label>
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
                            <Button onClick={handleSaveReport} className="w-full">Update Report</Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Subscribe Modal */}
            <Dialog open={subscribeDialogOpen} onOpenChange={setSubscribeDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Subscribe to {selectedChallenge?.name} Challenge</DialogTitle>
                    </DialogHeader>
                    {selectedChallenge && (
                        <div className="space-y-4 py-4">
                            <div className="bg-muted/50 rounded-lg p-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <Target className="w-4 h-4 text-primary" />
                                    <span className="text-muted-foreground">Challenge Target:</span>
                                    <span className="font-semibold text-foreground">{selectedChallenge.target} souls</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="personalTarget">Your Personal Target</Label>
                                <Input
                                    id="personalTarget"
                                    type="number"
                                    min="1"
                                    placeholder={selectedChallenge.target.toString()}
                                    value={personalTarget}
                                    onChange={(e) => setPersonalTarget(e.target.value)}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Set your own goal (minimum suggested: {selectedChallenge.target})
                                </p>
                            </div>
                            <DialogFooter>
                                <Button 
                                    onClick={handleSubscribe} 
                                    className="w-full" 
                                    disabled={submitting}
                                >
                                    {submitting ? 'Subscribing...' : 'Confirm Subscription'}
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Dashboard;
