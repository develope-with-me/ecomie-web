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
    Star, Crown,
} from 'lucide-react';
import { formatDate, computeUserName } from '@/lib/utils';
import ecomieLogo from "@/images/ecomie-logo.png";

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

type CalendarView = 'day' | 'week' | 'month' | 'year';

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

    const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

    const [editingProfile, setEditingProfile] = useState(false);
    const [profileFirstName, setProfileFirstName] = useState('');
    const [profileLastName, setProfileLastName] = useState('');
    const [profilePhoneNumber, setProfilePhoneNumber] = useState('');
    const [profileCountry, setProfileCountry] = useState('');
    const [profileRegion, setProfileRegion] = useState('');
    const [profileCity, setProfileCity] = useState('');
    const [profileLanguage, setProfileLanguage] = useState('');

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

    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarView, setCalendarView] = useState<CalendarView>('month');
    const [calendarExpanded, setCalendarExpanded] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/auth');
        } else if (user) {
            fetchData();
        }
    }, [user, authLoading, navigate]);

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

            const [ongoingSessionData, subscriptionsData, reportsData] = await Promise.all([
                sessionApi.getOngoingSession().catch(() => null),
                subscriptionApi.getMine(),
                isEcomiest ? reportApi.getMine() : Promise.resolve([]),
            ]);

            setOngoingSession(ongoingSessionData);
            setSubscriptions(subscriptionsData);
            setReports(reportsData);
        } catch (error) {
            console.error('Error fetching data:', error);
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
            toast({ title: "Profile Updated", description: "Your profile has been updated successfully." });
        } catch (error: any) {
            toast({ title: "Error", description: error.detail || error.message, variant: "destructive" });
        }
    };

    const handleSubscribe = async (challengeId: string) => {
        try {
            await subscriptionApi.create({ target: 0, challengeId });
            toast({ title: "Subscribed", description: "You have successfully subscribed to the challenge." });
            fetchData();
        } catch (error: any) {
            toast({ title: "Error", description: error.detail || error.message, variant: "destructive" });
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
        } catch (error: any) {
            toast({ title: "Error", description: error.detail || error.message, variant: "destructive" });
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
        } catch (error: any) {
            toast({ title: "Error", description: error.detail || error.message, variant: "destructive" });
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
        } catch (error: any) {
            toast({ title: "Error", description: error.detail || error.message, variant: "destructive" });
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
        return subscriptions.some(sub => sub.challenge?.id === challengeId);
    };

    const zoomIn = () => {
        const views: CalendarView[] = ['year', 'month', 'week', 'day'];
        const currentIndex = views.indexOf(calendarView);
        if (currentIndex < views.length - 1) {
            setCalendarView(views[currentIndex + 1]);
        }
    };

    const zoomOut = () => {
        const views: CalendarView[] = ['year', 'month', 'week', 'day'];
        const currentIndex = views.indexOf(calendarView);
        if (currentIndex > 0) {
            setCalendarView(views[currentIndex - 1]);
        }
    };

    const navigateMonth = (direction: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    const getReportDates = () => {
        const dates = new Set<string>();
        reports.forEach(report => {
            if (report.createdOn) {
                dates.add(new Date(report.createdOn).toDateString());
            }
        });
        return dates;
    };

    const renderCalendar = () => {
        const reportDates = getReportDates();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        const cells: React.ReactNode[] = [];

        if (calendarView === 'year') {
            for (let m = 0; m < 12; m++) {
                const monthStart = new Date(year, m, 1);
                const monthEnd = new Date(year, m + 1, 0);
                const firstDay = monthStart.getDay();
                const days = monthEnd.getDate();
                const monthCells: React.ReactNode[] = [];

                for (let d = 0; d < 7; d++) {
                    const dayNum = d < firstDay ? daysInPrevMonth - firstDay + d + 1 : d - firstDay + 1;
                    const isCurrentMonth = d >= firstDay && dayNum <= days;
                    if (isCurrentMonth) {
                        const dateStr = new Date(year, m, dayNum).toDateString();
                        const hasReport = reportDates.has(dateStr);
                        monthCells.push(
                            <div key={d} className={`w-3 h-3 rounded-full ${hasReport ? 'bg-primary' : 'bg-muted'}`} />
                        );
                    } else {
                        monthCells.push(<div key={d} className="w-3 h-3" />);
                    }
                }
                cells.push(
                    <div key={m} className="flex-1 min-w-[80px]">
                        <div className="text-xs font-medium mb-1">{monthNames[m].slice(0, 3)}</div>
                        <div className="grid grid-cols-7 gap-0.5">{monthCells}</div>
                    </div>
                );
            }
        } else if (calendarView === 'month') {
            for (let d = 0; d < 7; d++) {
                cells.push(<div key={d} className="text-center text-xs font-medium text-muted-foreground">{dayNames[d]}</div>);
            }
            for (let i = 0; i < firstDayOfMonth; i++) {
                cells.push(<div key={`empty-${i}`} className="w-8 h-8" />);
            }
            for (let day = 1; day <= daysInMonth; day++) {
                const dateStr = new Date(year, month, day).toDateString();
                const hasReport = reportDates.has(dateStr);
                const isToday = new Date().toDateString() === dateStr;
                cells.push(
                    <div key={day} className={`w-8 h-8 flex items-center justify-center rounded-full text-xs ${hasReport ? 'bg-primary text-primary-foreground font-bold' : isToday ? 'border border-primary' : ''}`}>
                        {day}
                    </div>
                );
            }
        } else if (calendarView === 'week') {
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
            for (let d = 0; d < 7; d++) {
                const date = new Date(startOfWeek);
                date.setDate(date.getDate() + d);
                const dateStr = date.toDateString();
                const hasReport = reportDates.has(dateStr);
                const isToday = new Date().toDateString() === dateStr;
                cells.push(
                    <div key={d} className={`flex-1 min-w-[100px] p-2 rounded ${hasReport ? 'bg-primary/10' : ''} ${isToday ? 'border border-primary' : ''}`}>
                        <div className="text-xs font-medium text-muted-foreground">{dayNames[d]}</div>
                        <div className="text-lg font-bold">{date.getDate()}</div>
                        {hasReport && <div className="text-xs text-primary mt-1">Has Report</div>}
                    </div>
                );
            }
        } else if (calendarView === 'day') {
            const dateStr = currentDate.toDateString();
            const dayReports = reports.filter(r => r.createdOn && new Date(r.createdOn).toDateString() === dateStr);
            return (
                <div className="space-y-4">
                    {dayReports.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">No reports for this day.</p>
                    ) : (
                        dayReports.map(report => (
                            <Card key={report.id} className="shadow-gentle">
                                <CardContent className="py-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{report.subscription?.challenge?.name || 'Challenge'}</span>
                                            <Badge variant="outline">{report.subscription?.session?.name || 'Session'}</Badge>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-sm">
                                            <div>Evangelized: {report.numberEvangelizedTo}</div>
                                            <div>Converts: {report.numberOfNewConverts}</div>
                                            <div>Followed up: {report.numberFollowedUp}</div>
                                        </div>
                                        {report.remark && <p className="text-sm text-muted-foreground">{report.remark}</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            );
        }

        return (
            <div className={`space-y-4 ${calendarView === 'year' ? 'grid grid-cols-3 gap-4' : ''}`}>
                {cells}
            </div>
        );
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
                                    <Button variant="cta" className="w-full" onClick={() => handleSubscribe(challenge.id!)}>
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
                        <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="text-primary-foreground hover:bg-primary-foreground/10">
                            <Home className="w-4 h-4 mr-2" />
                            Home
                        </Button>
                        {isAdmin && (
                            <Button variant="ghost" size="sm" onClick={() => navigate('/admin')} className="text-primary-foreground hover:bg-primary-foreground/10">
                                <Shield className="w-4 h-4 mr-2" />
                                Admin
                            </Button>
                        )}
                        <Button variant="heavenly" size="sm" onClick={handleSignOut}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-foreground mb-8">
                    Welcome, {profile?.firstName || 'Evangelist'}!
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
                        <div className="space-y-8">
                            {ongoingSession && (
                                <div>
                                    <h2 className="text-xl font-semibold text-foreground mb-4">Current Session</h2>
                                    <Card className="shadow-gentle mb-6">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-3">
                                                <Badge variant="default" className="bg-peaceful-green">{ongoingSession.status?.toString()}</Badge>
                                                <span>{ongoingSession.name}</span>
                                            </CardTitle>
                                            <p className="text-muted-foreground">{ongoingSession.description}</p>
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
                                </div>
                            )}

                            {subscriptions.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-semibold text-foreground mb-4">My Past Subscriptions</h2>
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-5 gap-4 p-3 bg-muted rounded-t-lg font-medium text-sm">
                                            <div>Session</div>
                                            <div>Target</div>
                                            <div>Challenge</div>
                                            <div>Challenge Target</div>
                                            <div>Subscribed On</div>
                                        </div>
                                        {subscriptions.map(sub => (
                                            <div key={sub.id}>
                                                <div 
                                                    className="grid grid-cols-5 gap-4 p-3 bg-card rounded-lg shadow-gentle cursor-pointer hover:bg-muted/50 transition-colors"
                                                    onClick={() => toggleSessionExpansion(sub.id!)}
                                                >
                                                    <div className="font-medium truncate">{sub.session?.name || '-'}</div>
                                                    <div>{sub.target || '-'}</div>
                                                    <div className="truncate">{sub.challenge?.name || '-'}</div>
                                                    <div>{sub.challenge?.target || '-'}</div>
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
                                <Card className="shadow-gentle">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle>Reports Calendar</CardTitle>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="sm" onClick={zoomOut} disabled={calendarView === 'year'}>
                                                    <ZoomOut className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={zoomIn} disabled={calendarView === 'day'}>
                                                    <ZoomIn className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => setCalendarExpanded(!calendarExpanded)}>
                                                    {calendarExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    {calendarExpanded && (
                                        <CardContent>
                                            <div className="flex items-center justify-between mb-4">
                                                <Button variant="ghost" size="sm" onClick={() => navigateMonth(-1)}>
                                                    <ChevronLeft className="w-4 h-4" />
                                                </Button>
                                                <h3 className="text-lg font-semibold">
                                                    {calendarView === 'year' ? currentDate.getFullYear() : 
                                                        `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`}
                                                </h3>
                                                <Button variant="ghost" size="sm" onClick={() => navigateMonth(1)}>
                                                    <ChevronRight className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            {renderCalendar()}
                                        </CardContent>
                                    )}
                                </Card>

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
                                            <div className="col-span-2">Pledge</div>
                                            <div className="col-span-2">Target</div>
                                            <div className="col-span-2">Reported On</div>
                                            <div className="col-span-2 text-right">Actions</div>
                                        </div>
                                        {reports.map(report => (
                                            <Card key={report.id} className="shadow-gentle">
                                                <CardContent className="py-4">
                                                    <div className="grid grid-cols-12 gap-4 items-center">
                                                        <div className="col-span-2 truncate">{report.subscription?.session?.name || '-'}</div>
                                                        <div className="col-span-2 truncate">{report.subscription?.challenge?.name || '-'}</div>
                                                        <div className="col-span-2">{report.subscription?.target || '-'}</div>
                                                        <div className="col-span-2">{report.subscription?.challenge?.target || '-'}</div>
                                                        <div className="col-span-2 text-sm text-muted-foreground">{formatDate(report.createdOn)}</div>
                                                        <div className="col-span-2 flex justify-end gap-2">
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
                                            <Button variant="outline" onClick={() => setEditingProfile(false)}>Cancel</Button>
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
        </div>
    );
};

export default Dashboard;
