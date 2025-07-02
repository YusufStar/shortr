"use client"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Url } from "@prisma/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UrlCreatedDialog({
    isOpen,
    onOpenChange,
    response,
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    response: Url | null;
}) {
    return (
        <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle>URL Created Successfully!</AlertDialogTitle>
                    <AlertDialogDescription>
                        Your URL has been shortened and is ready to use.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                
                {response && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="shortUrl" className="text-sm font-medium">
                                Short URL
                            </Label>
                            <div className="flex space-x-2">
                                <Input
                                    id="shortUrl"
                                    value={response.shortUrl}
                                    readOnly
                                    className="flex-1"
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="longUrl" className="text-sm font-medium">
                                Original URL
                            </Label>
                            <Input
                                id="longUrl"
                                value={response.longUrl}
                                readOnly
                                className="text-sm"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">
                                Created At
                            </Label>
                            <p className="text-sm text-muted-foreground">
                                {new Date(response.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>
                )}
                <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                        try {
                            if (response) {
                                navigator.clipboard.writeText(response.shortUrl);
                            }
                            toast.success("Short URL copied to clipboard!");
                        } catch {
                            toast.error("Failed to copy URL.");
                        }
                    }}>
                        Copy Short URL
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}