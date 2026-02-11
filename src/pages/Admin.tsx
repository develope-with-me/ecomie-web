import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
    Profile,
    SessionStatus,
    EcomieError, ChallengeType, User
} from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, Calendar, Target, FileText, Heart, Home, LogOut,
  Plus, Edit, Trash2, BookOpen, Shield
} from 'lucide-react';
import {isNonNullArray} from "@/lib/utils";

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

  // Session CRUD
  const handleSaveSession = async () => {
    try {
      const sessionData = {
        name: sessionName,
        description: sessionDescription || null,
        startDate: sessionStartDate,
        endDate: sessionEndDate,
        status: sessionStatus,
      };

      if (editingSession) {
        await sessionApi.update(editingSession.id, sessionData);
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
    setSessionStatus('upcoming');
  };

  // Challenge CRUD
  const handleSaveChallenge = async () => {
    try {
      const challengeData = {
        name: challengeName,
        description: challengeDescription || null,
        target: parseInt(challengeTarget) || 0,
        type: challengeType,
      };

      if (editingChallenge) {
        await challengeApi.update(editingChallenge.id, challengeData);
        toast({ title: "Challenge Updated" });
      } else {
        await challengeApi.create(challengeData);
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
    setChallengeSessionId(challenge.sessions[0].id);
    setChallengeDialogOpen(true);
  };

  const handleDeleteChallenge = async (id: string) => {
    if (!confirm('This will also delete all subscriptions to this challenge. Continue?')) return;
    
    try {
      await challengeApi.delete(id);
      toast({ title: "Challenge Deleted" });
      fetchAllData();
    } catch (error: any) {
        const description =  isNonNullArray(error.invalidParams)  ? error.invalidParams[0].reason : error.detail;
        toast({ title: "Error", description: description, variant: "destructive" });
    }
  };

  const resetChallengeForm = () => {
    setEditingChallenge(null);
    setChallengeName('');
    setChallengeDescription('');
    setChallengeTarget('');
    setChallengeType(null);
    setChallengeSessionId('');
  };

  // Delete handlers for other entities
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Delete this user profile?')) return;
    try {
      await userApi.deleteUser(userId);
      toast({ title: "User Deleted" });
      fetchAllData();
    } catch (error: any) {
        const description =  isNonNullArray(error.invalidParams)  ? error.invalidParams[0].reason : error.detail;
        toast({ title: "Error", description: description, variant: "destructive" });
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    if (!confirm('Delete this subscription?')) return;
    try {
      await subscriptionApi.delete(id);
      toast({ title: "Subscription Deleted" });
      fetchAllData();
    } catch (error: any) {
        const description =  isNonNullArray(error.invalidParams)  ? error.invalidParams[0].reason : error.detail;
        toast({ title: "Error", description: description, variant: "destructive" });
    }
  };

  const handleDeleteReport = async (id: string) => {
    if (!confirm('Delete this report?')) return;
    try {
      await reportApi.delete(id);
      toast({ title: "Report Deleted" });
      fetchAllData();
    } catch (error: any) {
        const description =  isNonNullArray(error.invalidParams)  ? error.invalidParams[0].reason : error.detail;
        toast({ title: "Error", description: description, variant: "destructive" });
    }
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
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={sessionStatus.toString()} onValueChange={setSessionStatus}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleSaveSession} className="w-full">
                      {editingSession ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {sessions.map(session => (
                <Card key={session.id} className="shadow-gentle">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{session.name}</h3>
                        <p className="text-sm text-muted-foreground">{session.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant={session.status === SessionStatus.ONGOING ? 'default' : 'secondary'}>
                            {session.status.toString()}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(session.startDate).toLocaleDateString()} - {new Date(session.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditSession(session)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteSession(session.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {sessions.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No sessions created yet.</p>
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
                        <Select value={challengeType.toString()} onValueChange={setChallengeType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="individual">Individual</SelectItem>
                            <SelectItem value="team">Team</SelectItem>
                            <SelectItem value="church">Church</SelectItem>
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
                const session = sessions.find(s => s.id === challenge.sessions[0].id);
                return (
                  <Card key={challenge.id} className="shadow-gentle">
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{challenge.name}</h3>
                          <p className="text-sm text-muted-foreground">{challenge.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant="outline">{challenge.type.toString()}</Badge>
                            <span className="text-xs text-muted-foreground">Target: {challenge.target}</span>
                            {session && (
                              <span className="text-xs text-muted-foreground">Session: {session.name}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditChallenge(challenge)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteChallenge(challenge.id)}>
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
            <h2 className="text-xl font-semibold mb-6">Users ({users.length})</h2>
            <div className="space-y-4">
              {users.map(userProfile => (
                <Card key={userProfile.id} className="shadow-gentle">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{userProfile.firstName} {userProfile.lastName}</h3>
                        <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(userProfile.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions">
            <h2 className="text-xl font-semibold mb-6">Subscriptions ({subscriptions.length})</h2>
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
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteSubscription(sub.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <h2 className="text-xl font-semibold mb-6">Reports ({reports.length})</h2>
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
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteReport(report.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
