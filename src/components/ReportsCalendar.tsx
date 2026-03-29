import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChallengeReport } from '@/lib/api';
import {
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    ZoomOut,
    Minimize2,
    Maximize2,
    Eye,
    Edit,
    FileText,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

type CalendarView = 'day' | 'week' | 'month' | 'year';

interface ReportsCalendarProps {
    reports: ChallengeReport[];
    onViewReport?: (report: ChallengeReport) => void;
    onEditReport?: (report: ChallengeReport) => void;
    title?: string;
    showZoomControls?: boolean;
    defaultView?: CalendarView;
}

const ReportsCalendar: React.FC<ReportsCalendarProps> = ({
    reports,
    onViewReport,
    onEditReport,
    title = 'Reports Calendar',
    showZoomControls = true,
    defaultView = 'month',
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarNavDate, setCalendarNavDate] = useState(new Date());
    const [calendarView, setCalendarView] = useState<CalendarView>(defaultView);
    const [calendarExpanded, setCalendarExpanded] = useState(true);
    const [viewReportDialogOpen, setViewReportDialogOpen] = useState(false);
    const [viewingReport, setViewingReport] = useState<ChallengeReport | null>(null);

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getWeekRange = (date: Date) => {
        const dayOfWeek = date.getDay();
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - dayOfWeek);
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        return { startOfWeek, endOfWeek };
    };

    const navigateCalendar = (direction: number) => {
        const newNavDate = new Date(calendarNavDate);
        if (calendarView === 'year') {
            newNavDate.setFullYear(newNavDate.getFullYear() + direction);
            setCalendarNavDate(newNavDate);
        } else if (calendarView === 'month') {
            newNavDate.setMonth(newNavDate.getMonth() + direction);
            setCalendarNavDate(newNavDate);
        } else if (calendarView === 'week') {
            const { startOfWeek } = getWeekRange(calendarNavDate);
            const targetWeekStart = new Date(startOfWeek);
            targetWeekStart.setDate(startOfWeek.getDate() + (direction * 7));
            setCalendarNavDate(targetWeekStart);
            setCurrentDate(targetWeekStart);
        } else if (calendarView === 'day') {
            newNavDate.setDate(newNavDate.getDate() + direction);
            setCalendarNavDate(newNavDate);
            setCurrentDate(newNavDate);
        }
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

    const handleDayClick = (date: Date) => {
        setCurrentDate(date);
        setCalendarNavDate(date);
        const dateStr = date.toDateString();
        const dayReports = reports.filter(r => r.createdOn && new Date(r.createdOn).toDateString() === dateStr);
        if (dayReports.length > 0) {
            setViewingReport(dayReports[0]);
            setViewReportDialogOpen(true);
            onViewReport?.(dayReports[0]);
        }
    };

    const handleViewReport = (report: ChallengeReport) => {
        setViewingReport(report);
        setViewReportDialogOpen(true);
        onViewReport?.(report);
    };

    const getReportsByDate = () => {
        const reportsMap: Record<string, ChallengeReport[]> = {};
        reports.forEach(report => {
            if (report.createdOn) {
                const dateStr = new Date(report.createdOn).toDateString();
                if (!reportsMap[dateStr]) {
                    reportsMap[dateStr] = [];
                }
                reportsMap[dateStr].push(report);
            }
        });
        return reportsMap;
    };

    const renderCalendar = () => {
        const reportsByDate = getReportsByDate();
        const navYear = calendarNavDate.getFullYear();
        const navMonth = calendarNavDate.getMonth();
        const firstDayOfMonth = new Date(navYear, navMonth, 1).getDay();
        const daysInMonth = new Date(navYear, navMonth + 1, 0).getDate();

        if (calendarView === 'year') {
            const months: React.ReactNode[] = [];
            for (let m = 0; m < 12; m++) {
                const monthYear = navYear;
                const monthStart = new Date(monthYear, m, 1);
                const monthEnd = new Date(monthYear, m + 1, 0);
                const firstDay = monthStart.getDay();
                const days = monthEnd.getDate();
                const monthCells: React.ReactNode[] = [];

                for (let d = 0; d < 7; d++) {
                    monthCells.push(
                        <div key={`header-${d}`} className="w-4 h-4 text-[8px] text-center text-muted-foreground font-medium">
                            {dayNames[d][0]}
                        </div>
                    );
                }

                for (let day = 1; day <= days; day++) {
                    const date = new Date(monthYear, m, day);
                    const dateStr = date.toDateString();
                    const dayOfWeek = date.getDay();
                    const hasReport = !!reportsByDate[dateStr];
                    const isToday = new Date().toDateString() === dateStr;
                    
                    if (day === 1 && dayOfWeek > 0) {
                        for (let empty = 0; empty < dayOfWeek; empty++) {
                            monthCells.push(<div key={`empty-${m}-${empty}`} className="w-4 h-4" />);
                        }
                    }
                    
                    monthCells.push(
                        <div
                            key={`day-${m}-${day}`}
                            onClick={() => handleDayClick(date)}
                            className={`w-4 h-4 flex items-center justify-center text-[8px] rounded-sm cursor-pointer transition-colors ${hasReport ? 'bg-primary text-primary-foreground' : isToday ? 'border border-primary' : ''}`}
                        >
                            {day}
                        </div>
                    );
                }

                months.push(
                    <div 
                        key={m} 
                        className="flex-1 min-w-[120px] p-2 border rounded-lg bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => { setCalendarView('month'); setCalendarNavDate(new Date(navYear, m, 1)); setCurrentDate(new Date(navYear, m, 1)); }}
                    >
                        <div className="text-xs font-semibold mb-1">{monthNames[m]}</div>
                        <div className="grid grid-cols-7 gap-px">{monthCells}</div>
                    </div>
                );
            }
            return (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {months}
                </div>
            );
        }

        if (calendarView === 'month') {
            const cells: React.ReactNode[] = [];
            
            for (let d = 0; d < 7; d++) {
                cells.push(<div key={`header-${d}`} className="text-center text-xs font-medium text-muted-foreground py-2">{dayNames[d]}</div>);
            }
            
            for (let i = 0; i < firstDayOfMonth; i++) {
                const prevDate = new Date(navYear, navMonth, -(firstDayOfMonth - i - 1));
                cells.push(
                    <div key={`empty-${i}`} className="aspect-square flex items-center justify-center text-muted-foreground/50">
                        <span className="text-sm">{prevDate.getDate()}</span>
                    </div>
                );
            }
            
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(navYear, navMonth, day);
                const dateStr = date.toDateString();
                const dayReports = reportsByDate[dateStr];
                const hasReport = !!dayReports && dayReports.length > 0;
                const isToday = new Date().toDateString() === dateStr;
                const isCurrentDay = currentDate.toDateString() === dateStr;
                
                cells.push(
                    <div
                        key={day}
                        onClick={() => handleDayClick(date)}
                        className={`aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all hover:bg-muted/50 ${hasReport ? 'bg-primary text-primary-foreground hover:bg-primary/90' : isToday ? 'bg-accent' : ''} ${isCurrentDay && !hasReport ? 'ring-2 ring-primary' : ''}`}
                    >
                        <span className={`text-sm font-medium ${hasReport ? 'text-primary-foreground' : ''}`}>{day}</span>
                        {hasReport && (
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground mt-0.5" />
                        )}
                    </div>
                );
            }
            
            const totalCells = cells.length;
            const remainingCells = 49 - totalCells;
            for (let i = 1; i <= remainingCells && i <= 42 - (firstDayOfMonth + daysInMonth); i++) {
                cells.push(
                    <div key={`next-${i}`} className="aspect-square flex items-center justify-center text-muted-foreground/50">
                        <span className="text-sm">{i}</span>
                    </div>
                );
            }
            
            return (
                <div className="grid grid-cols-7 gap-1">
                    {cells}
                </div>
            );
        }

        if (calendarView === 'week') {
            const { startOfWeek } = getWeekRange(calendarNavDate);
            
            const cells: React.ReactNode[] = [];
            
            for (let d = 0; d < 7; d++) {
                const date = new Date(startOfWeek);
                date.setDate(startOfWeek.getDate() + d);
                const dateStr = date.toDateString();
                const dayReports = reportsByDate[dateStr];
                const hasReport = !!dayReports && dayReports.length > 0;
                const isToday = new Date().toDateString() === dateStr;
                const isCurrentDay = currentDate.toDateString() === dateStr;
                const isCurrentMonth = date.getMonth() === navMonth;
                
                cells.push(
                    <div
                        key={`week-day-${d}`}
                        onClick={() => handleDayClick(date)}
                        className={`flex flex-col items-center p-3 rounded-lg border cursor-pointer transition-all hover:bg-muted/50 ${hasReport ? 'bg-primary/10 border-primary' : isToday ? 'border-primary' : 'border-border'} ${isCurrentDay ? 'ring-2 ring-primary' : ''} ${!isCurrentMonth ? 'opacity-50' : ''}`}
                    >
                        <div className="text-xs font-medium text-muted-foreground">
                            {dayNames[d]}
                        </div>
                        <div className={`text-2xl font-bold ${hasReport ? 'text-primary' : ''}`}>
                            {date.getDate()}
                        </div>
                        <div className="text-[10px] text-muted-foreground mb-1">
                            {date.toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                        {hasReport && (
                            <div className="mt-1">
                                <Badge variant="default" className="text-xs px-1.5 py-0.5">
                                    {dayReports.length} {dayReports.length === 1 ? 'Report' : 'Reports'}
                                </Badge>
                            </div>
                        )}
                    </div>
                );
            }
            
            return (
                <div className="grid grid-cols-7 gap-2">
                    {cells}
                </div>
            );
        }

        const dateStr = currentDate.toDateString();
        const dayReports = reportsByDate[dateStr] || [];
        
        return (
            <div className="space-y-4">
                <Card className="shadow-gentle">
                    <CardHeader>
                        <CardTitle className="text-center">
                            {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {dayReports.length === 0 ? (
                            <div className="text-center py-8">
                                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">No reports for this day.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {dayReports.map(report => (
                                    <Card key={report.id} className="shadow-gentle cursor-pointer hover:bg-muted/50" onClick={() => handleViewReport(report)}>
                                        <CardContent className="py-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{report.subscription?.challenge?.name || 'Challenge'}</span>
                                                        <Badge variant="outline">{report.subscription?.session?.name || 'Session'}</Badge>
                                                    </div>
                                                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleViewReport(report); }}>
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
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
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    };

    return (
        <>
            <Card className="shadow-gentle">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>{title}</CardTitle>
                        {showZoomControls && (
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
                        )}
                    </div>
                </CardHeader>
                {calendarExpanded && (
                    <CardContent>
                        <div className="flex items-center justify-between mb-4">
                            <Button variant="ghost" size="sm" onClick={() => navigateCalendar(-1)}>
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <div className="flex items-center gap-2">
                                {calendarView === 'year' && (
                                    <>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => {
                                                const newDate = new Date(calendarNavDate);
                                                newDate.setFullYear(newDate.getFullYear() - 1);
                                                setCalendarNavDate(newDate);
                                            }}
                                            className="text-xs"
                                        >
                                            <ChevronLeft className="w-3 h-3" />
                                        </Button>
                                    </>
                                )}
                                <h3 className="text-lg font-semibold">
                                    {calendarView === 'year' ? calendarNavDate.getFullYear() : 
                                        calendarView === 'month' ? `${calendarNavDate.toLocaleString('default', { month: 'long' })} ${calendarNavDate.getFullYear()}` :
                                        calendarView === 'week' ? (() => {
                                            const { startOfWeek, endOfWeek } = getWeekRange(calendarNavDate);
                                            return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
                                        })() :
                                        currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                </h3>
                                {calendarView === 'year' && (
                                    <>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => {
                                                const newDate = new Date(calendarNavDate);
                                                newDate.setFullYear(newDate.getFullYear() + 1);
                                                setCalendarNavDate(newDate);
                                            }}
                                            className="text-xs"
                                        >
                                            <ChevronRight className="w-3 h-3" />
                                        </Button>
                                    </>
                                )}
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => navigateCalendar(1)}>
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                        {renderCalendar()}
                    </CardContent>
                )}
            </Card>

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
                        <div className="flex gap-2 w-full">
                            {onEditReport && viewingReport && (
                                <Button variant="outline" onClick={() => { setViewReportDialogOpen(false); onEditReport(viewingReport); }} className="flex-1">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                </Button>
                            )}
                            <Button onClick={() => setViewReportDialogOpen(false)} className="flex-1">Close</Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ReportsCalendar;
