import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { User, UserRole } from "@/lib/api";

interface Props {
    user: User & { accountEnabled?: boolean; accountBlocked?: boolean };
    onRoleChanged: (newRole: string) => Promise<void>;
    onToggleBlock: () => Promise<void>;
    onEnableUser: () => Promise<void>;
}

const UserDetails: React.FC<Props> = ({ user, onRoleChanged, onToggleBlock, onEnableUser }) => {
    const [role, setRole] = useState<string>(user.role ? user.role.toString() : UserRole.USER);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        setRole(user.role ? user.role.toString() : UserRole.USER);
    }, [user]);

    const handleChangeRole = async () => {
        setProcessing(true);
        try {
            await onRoleChanged(role);
        } finally {
            setProcessing(false);
        }
    };

    const handleToggleBlock = async () => {
        setProcessing(true);
        try {
            await onToggleBlock();
        } finally {
            setProcessing(false);
        }
    };

    const handleEnable = async () => {
        setProcessing(true);
        try {
            await onEnableUser();
        } finally {
            setProcessing(false);
        }
    };

    const isEnabled = !!user.accountEnabled;
    const isBlocked = !!user.accountBlocked;

    return (
        <div className="grid grid-cols-1 gap-3">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Name</Label>
                    <div>{user.firstName} {user.lastName}</div>
                </div>
                <div>
                    <Label>Email</Label>
                    <div>{user.email}</div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 items-end">
                <div>
                    <Label>Role</Label>
                    <Select value={role} onValueChange={setRole}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value={UserRole.USER}>User</SelectItem>
                            <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                            <SelectItem value={UserRole.SUPER_ADMIN}>Super Admin</SelectItem>
                            <SelectItem value={UserRole.ECOMIEST}>Ecomiest</SelectItem>
                            <SelectItem value={UserRole.COACH}>Coach</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Phone</Label>
                    <div>{user.phoneNumber || "-"}</div>
                </div>

                <div>
                    <Label>Location</Label>
                    <div>{user.city || "-"}, {user.region || "-"}, {user.country || "-"}</div>
                </div>
            </div>

            <div className="flex gap-2">
                <Button onClick={handleChangeRole} disabled={processing} size="sm">Change Role</Button>
                <Button onClick={handleToggleBlock} disabled={processing} variant={isBlocked ? "secondary" : "destructive"} size="sm">
                    {isBlocked ? "Unblock" : "Block"}
                </Button>
                {!isEnabled && (
                    <Button onClick={handleEnable} disabled={processing} size="sm">Enable</Button>
                )}
            </div>

            <div className="text-sm text-muted-foreground">
                <div>Account enabled: {isEnabled ? "Yes" : "No"}</div>
                <div>Account blocked: {isBlocked ? "Yes" : "No"}</div>
            </div>
        </div>
    );
};

export default UserDetails;