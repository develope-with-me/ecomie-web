import React from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface Props {
    trigger: React.ReactNode;
    title?: string;
    description?: string;
    confirmLabel?: string;
    onConfirm: () => Promise<void> | void;
}

export default function ConfirmRemoveDialog({
                                                trigger,
                                                title = "Are you sure?",
                                                description = "This action cannot be undone.",
                                                confirmLabel = "Delete",
                                                onConfirm,
                                            }: Props) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                </AlertDialogHeader>
                <div className="p-4 text-sm text-muted-foreground">{description}</div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        {confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
export { ConfirmRemoveDialog };