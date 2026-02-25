import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Session, Challenge, ChallengeType } from "@/lib/api";

interface Props {
    challenge: Challenge;
    sessions: Session[];
    onAddToSession: (challengeId?: string, sessionId?: string) => void;
    onChangeType: (challengeId?: string, type?: string) => void;
}

export default function ChallengeDetails({ challenge, sessions, onAddToSession, onChangeType }: Props) {
    const [selectedSession, setSelectedSession] = useState<string>(challenge.sessions?.[0]?.id || "");
    const [type, setType] = useState<string>(challenge.type.toString || ChallengeType.INDIVIDUAL.toString);

    const handleAdd = () => {
        onAddToSession(challenge.id, selectedSession);
    };

    const handleTypeChange = (val: string) => {
        setType(val);
        onChangeType(challenge.id, val);
    };

    return (
        <div className="mt-4 border-t pt-4">
            <div className="flex gap-2 items-center">
                <Select value={type} onValueChange={handleTypeChange}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ChallengeType.NORMAL}>Normal</SelectItem>
                        <SelectItem value={ChallengeType.EVENT}>Event</SelectItem>
                        <SelectItem value={ChallengeType.INDIVIDUAL}>Individual</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={selectedSession} onValueChange={setSelectedSession}>
                    <SelectTrigger>
                        <SelectValue placeholder="Add to session" />
                    </SelectTrigger>
                    <SelectContent>
                        {sessions.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                                {s.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button size="sm" onClick={handleAdd}>Add to Session</Button>
            </div>

            <div className="text-xs text-muted-foreground mt-2">
                Created: {challenge.createdOn || "n/a"} · Updated: {challenge.updatedOn || "n/a"}
            </div>
        </div>
    );
}
export { ChallengeDetails };