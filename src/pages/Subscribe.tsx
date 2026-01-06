import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Target, Heart } from 'lucide-react';
import { challengeApi, subscriptionApi, Challenge } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Subscribe = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [personalTarget, setPersonalTarget] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (challengeId) {
      fetchChallenge();
    }
  }, [challengeId, user, navigate]);

  const fetchChallenge = async () => {
    try {
      const data = await challengeApi.getById(challengeId!);
      setChallenge(data);
      setPersonalTarget(data.target.toString());
    } catch (error) {
      console.error('Error fetching challenge:', error);
      toast({
        title: "Challenge Not Found",
        description: "The challenge you're looking for doesn't exist.",
        variant: "destructive",
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !challenge) return;
    
    setSubmitting(true);
    
    try {
      // Check if already subscribed
      const exists = await subscriptionApi.checkExists(challenge.id);
      if (exists) {
        toast({
          title: "Already Subscribed",
          description: "You're already subscribed to this challenge.",
          variant: "destructive",
        });
        navigate('/dashboard');
        return;
      }

      await subscriptionApi.create({
        challengeId: challenge.id,
        target: parseInt(personalTarget) || challenge.target,
        name: name || `My ${challenge.name} commitment`,
        description: description || undefined,
        type: 'personal',
      });

      toast({
        title: "Subscribed Successfully!",
        description: `You've joined the ${challenge.name} challenge. May God bless your efforts!`,
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error subscribing:', error);
      toast({
        title: "Subscription Failed",
        description: error.message || "Failed to subscribe to the challenge.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-heavenly">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  if (!challenge) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-heavenly py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className="border-0 shadow-divine">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-divine rounded-full flex items-center justify-center shadow-gentle">
                <Heart className="w-10 h-10 text-primary-foreground" fill="currentColor" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Subscribe to {challenge.name} Challenge
            </h1>
            <p className="text-muted-foreground">
              {challenge.description || "Commit to making a difference in your community"}
            </p>
          </CardHeader>

          <CardContent>
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Challenge Target:</span>
                <span className="font-semibold text-foreground">{challenge.target} souls</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Commitment Name (Optional)</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={`My ${challenge.name} commitment`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Give your commitment a personal name
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target">Your Personal Target</Label>
                <Input
                  id="target"
                  type="number"
                  min="1"
                  placeholder={challenge.target.toString()}
                  value={personalTarget}
                  onChange={(e) => setPersonalTarget(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Set your own goal (minimum suggested: {challenge.target})
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Personal Notes (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Any personal notes or prayer requests for this commitment..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <Button 
                type="submit" 
                variant="cta" 
                className="w-full" 
                size="lg"
                disabled={submitting}
              >
                {submitting ? 'Subscribing...' : 'Confirm Subscription'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Subscribe;
