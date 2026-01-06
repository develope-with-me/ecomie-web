import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, FileText } from 'lucide-react';
import { subscriptionApi, reportApi, Subscription, ChallengeReport } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ReportForm = () => {
  const { subscriptionId, reportId } = useParams<{ subscriptionId?: string; reportId?: string }>();
  const isEdit = !!reportId;
  
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [numberEvangelizedTo, setNumberEvangelizedTo] = useState('0');
  const [numberOfNewConverts, setNumberOfNewConverts] = useState('0');
  const [numberFollowedUp, setNumberFollowedUp] = useState('0');
  const [difficulties, setDifficulties] = useState('');
  const [remark, setRemark] = useState('');
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
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
    
    if (isEdit) {
      fetchReport();
    } else if (subscriptionId) {
      fetchSubscription();
    }
  }, [subscriptionId, reportId, user, navigate, isEdit]);

  const fetchSubscription = async () => {
    try {
      const data = await subscriptionApi.getById(subscriptionId!);
      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      toast({
        title: "Subscription Not Found",
        description: "The subscription you're looking for doesn't exist.",
        variant: "destructive",
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchReport = async () => {
    try {
      const reportData = await reportApi.getById(reportId!);
      setNumberEvangelizedTo(reportData.numberEvangelizedTo.toString());
      setNumberOfNewConverts(reportData.numberOfNewConverts.toString());
      setNumberFollowedUp(reportData.numberFollowedUp.toString());
      setDifficulties(reportData.difficulties || '');
      setRemark(reportData.remark || '');
      setReportDate(reportData.reportDate);

      // Fetch subscription for display
      const subData = await subscriptionApi.getById(reportData.subscriptionId);
      setSubscription(subData);
    } catch (error) {
      console.error('Error fetching report:', error);
      toast({
        title: "Report Not Found",
        description: "The report you're looking for doesn't exist.",
        variant: "destructive",
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || (!subscription && !isEdit)) return;
    
    setSubmitting(true);
    
    try {
      const reportData = {
        numberEvangelizedTo: parseInt(numberEvangelizedTo) || 0,
        numberOfNewConverts: parseInt(numberOfNewConverts) || 0,
        numberFollowedUp: parseInt(numberFollowedUp) || 0,
        difficulties: difficulties || undefined,
        remark: remark || undefined,
        reportDate,
      };

      if (isEdit) {
        await reportApi.update(reportId!, reportData);
        toast({
          title: "Report Updated",
          description: "Your report has been updated successfully.",
        });
      } else {
        await reportApi.create({
          ...reportData,
          subscriptionId: subscriptionId!,
        });
        toast({
          title: "Report Submitted",
          description: "Your evangelism report has been recorded. Keep up the good work!",
        });
      }
      
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error submitting report:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit report.",
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

  return (
    <div className="min-h-screen bg-gradient-heavenly py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="border-0 shadow-divine">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-divine rounded-full flex items-center justify-center shadow-gentle">
                <FileText className="w-10 h-10 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl">
              {isEdit ? 'Edit Challenge Report' : 'Submit Challenge Report'}
            </CardTitle>
            {subscription?.name && (
              <p className="text-muted-foreground">{subscription.name}</p>
            )}
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="reportDate">Report Date</Label>
                <Input
                  id="reportDate"
                  type="date"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="evangelizedTo">Evangelized To</Label>
                  <Input
                    id="evangelizedTo"
                    type="number"
                    min="0"
                    value={numberEvangelizedTo}
                    onChange={(e) => setNumberEvangelizedTo(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newConverts">New Converts</Label>
                  <Input
                    id="newConverts"
                    type="number"
                    min="0"
                    value={numberOfNewConverts}
                    onChange={(e) => setNumberOfNewConverts(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="followedUp">Followed Up</Label>
                  <Input
                    id="followedUp"
                    type="number"
                    min="0"
                    value={numberFollowedUp}
                    onChange={(e) => setNumberFollowedUp(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulties">Difficulties Encountered (Optional)</Label>
                <Textarea
                  id="difficulties"
                  placeholder="Any challenges or difficulties you faced..."
                  value={difficulties}
                  onChange={(e) => setDifficulties(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="remark">Remarks (Optional)</Label>
                <Textarea
                  id="remark"
                  placeholder="Any additional notes, testimonies, or prayer requests..."
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  rows={3}
                />
              </div>

              <Button 
                type="submit" 
                variant="cta" 
                className="w-full" 
                size="lg"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : isEdit ? 'Update Report' : 'Submit Report'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportForm;
