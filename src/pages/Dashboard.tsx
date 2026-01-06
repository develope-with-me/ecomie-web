import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { profileApi, subscriptionApi, reportApi, challengeApi, sessionApi, Profile, Subscription, ChallengeReport, Challenge, Session } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { 
  User, LogOut, Heart, Calendar, FileText, Target, 
  Plus, Edit, Trash2, Home, Shield 
} from 'lucide-react';

interface EnrichedSubscription extends Subscription {
  challenge?: Challenge & { session?: Session };
}

interface EnrichedReport extends ChallengeReport {
  subscription?: EnrichedSubscription;
}

const Dashboard = () => {
  const { user, isAdmin, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscriptions, setSubscriptions] = useState<EnrichedSubscription[]>([]);
  const [reports, setReports] = useState<EnrichedReport[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Profile edit state
  const [editingProfile, setEditingProfile] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    } else if (user) {
      fetchData();
    }
  }, [user, authLoading, navigate]);

  const fetchData = async () => {
    try {
      // Fetch profile
      const profileData = await profileApi.getProfile();
      setProfile(profileData);
      setFirstName(profileData.firstName);
      setLastName(profileData.lastName);

      // Fetch subscriptions, challenges, and sessions
      const [subsData, challengesData, sessionsData] = await Promise.all([
        subscriptionApi.getMine(),
        challengeApi.getAll(),
        sessionApi.getAll(),
      ]);

      const enrichedSubs: EnrichedSubscription[] = subsData.map(sub => {
        const challenge = challengesData.find(c => c.id === sub.challengeId);
        const session = challenge?.sessionId
          ? sessionsData.find(s => s.id === challenge.sessionId)
          : undefined;
        return {
          ...sub,
          challenge: challenge ? { ...challenge, session } : undefined,
        };
      });

      setSubscriptions(enrichedSubs);

      // Fetch reports
      const reportsData = await reportApi.getMine();
      const enrichedReports: EnrichedReport[] = reportsData.map(report => ({
        ...report,
        subscription: enrichedSubs.find(s => s.id === report.subscriptionId),
      }));

      setReports(enrichedReports);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await profileApi.updateProfile({ firstName, lastName });
      setProfile(prev => prev ? { ...prev, firstName, lastName } : null);
      setEditingProfile(false);
      toast({ title: "Profile Updated", description: "Your profile has been updated successfully." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      await reportApi.delete(reportId);
      setReports(prev => prev.filter(r => r.id !== reportId));
      toast({ title: "Report Deleted", description: "Your report has been deleted." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
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
              <Heart className="w-6 h-6 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="text-xl font-bold text-primary-foreground">EvangeTrack</span>
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

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-3 mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Sessions
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Reports
            </TabsTrigger>
          </TabsList>

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
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
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
                      <p className="text-foreground font-medium">{profile?.email || user?.email}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">My Subscriptions</h2>
                <Button onClick={() => navigate('/#sessions')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Join New Challenge
                </Button>
              </div>

              {subscriptions.length === 0 ? (
                <Card className="shadow-gentle">
                  <CardContent className="py-12 text-center">
                    <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">You haven't subscribed to any challenges yet.</p>
                    <Button onClick={() => navigate('/#sessions')}>Browse Sessions</Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {subscriptions.map(sub => (
                    <Card key={sub.id} className="shadow-gentle">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{sub.challenge?.name || 'Challenge'}</span>
                          <Badge variant={sub.challenge?.session?.status === 'active' ? 'default' : 'secondary'}>
                            {sub.challenge?.session?.status || 'Unknown'}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-primary" />
                            <span className="text-muted-foreground">Your Target:</span>
                            <span className="font-medium">{sub.target} souls</span>
                          </div>
                          {sub.name && (
                            <p className="text-muted-foreground">{sub.name}</p>
                          )}
                          {sub.challenge?.session?.status === 'active' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full mt-4"
                              onClick={() => navigate(`/report/new/${sub.id}`)}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Submit Report
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Challenge Reports</h2>
              </div>

              {reports.length === 0 ? (
                <Card className="shadow-gentle">
                  <CardContent className="py-12 text-center">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No reports submitted yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {reports.map(report => (
                    <Card key={report.id} className="shadow-gentle">
                      <CardContent className="py-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{report.subscription?.challenge?.name}</h3>
                              <Badge variant="outline">{report.reportDate}</Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Evangelized To:</span>
                                <p className="font-medium">{report.numberEvangelizedTo}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">New Converts:</span>
                                <p className="font-medium">{report.numberOfNewConverts}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Followed Up:</span>
                                <p className="font-medium">{report.numberFollowedUp}</p>
                              </div>
                            </div>
                            {report.remark && (
                              <p className="text-sm text-muted-foreground">{report.remark}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate(`/report/edit/${report.id}`)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteReport(report.id)}
                            >
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
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
