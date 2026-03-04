import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Eye, X, Plus } from "lucide-react";
import { Session, Challenge, SessionStatus, ChallengeType } from "@/lib/api";
import ConfirmRemoveDialog from "./ConfirmRemoveDialog";

interface Props {
    session: Session;
    allSessions: Session[];
    onAddChallenge: (sessionId?: string) => void;
    onChangeStatus: (sessionId?: string, status?: SessionStatus) => void;
    onRemoveChallenge: (sessionId?: string, challengeId?: string) => void;
    onToggleViewChallenge: (challenge: Challenge) => void;
}

export default function SessionDetails({
                                           session,
                                           allSessions,
                                           onAddChallenge,
                                           onChangeStatus,
                                           onRemoveChallenge,
                                           onToggleViewChallenge,
                                       }: Props) {
    const [status, setStatus] = useState<SessionStatus>(session.status || SessionStatus.INACTIVE);

    const handleStatusChange = (val: string) => {
        const s = val as SessionStatus;
        setStatus(s);
        onChangeStatus(session.id, s);
    };

    return (
        <div className="mt-4 border-t pt-4 space-y-4">
            <div className="flex gap-2">
                <Button size="sm" onClick={() => onAddChallenge(session.id)}>
                    <Plus className="w-4 h-4 mr-2" /> Add Challenge
                </Button>
                <Select value={status.toString()} onValueChange={handleStatusChange}>
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
                        session.challenges.map((ch) => (
                            <div key={ch.id} className="flex items-center justify-between bg-muted/10 p-2 rounded">
                                <div>
                                    <div className="font-medium">{ch.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {ch.type?.toString() || ChallengeType.INDIVIDUAL} · Target: {ch.target}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="ghost" onClick={() => onToggleViewChallenge(ch)}>
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    <ConfirmRemoveDialog
                                        trigger={<Button size="sm" variant="ghost"><X className="w-4 h-4 text-destructive" /></Button>}
                                        title={`Remove ${ch.name}`}
                                        description={`Remove challenge "${ch.name}" from session "${session.name}"?`}
                                        confirmLabel="Remove"
                                        onConfirm={() => onRemoveChallenge(session.id, ch.id)}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-xs text-muted-foreground">No challenges assigned.</div>
                    )}
                </div>
            </div>
        </div>
    );
}
export { SessionDetails };