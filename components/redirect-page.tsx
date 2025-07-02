"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, Copy, Clock, Link2 } from "lucide-react";
import { Url } from "@prisma/client";
import { toast } from "sonner";
import { clickUrl } from "@/actions/url/click";
import { formater } from "@/lib/url";

export default function RedirectPage({
    data
}: {
    data: Url
}) {
    const onRedirect = async () => {
        try {
            await clickUrl(data.shortUrl);
        } catch {
            toast.error("Failed to redirect to the original URL");
        }
    };

    const handleCopyShortUrl = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Short URL copied to clipboard!");
        } catch {
            toast.error("Failed to copy URL to clipboard");
        }
    };

    const handleCopyLongUrl = async () => {
        try {
            await navigator.clipboard.writeText(data.longUrl);
            toast.success("Original URL copied to clipboard!");
        } catch {
            toast.error("Failed to copy URL to clipboard");
        }
    };

    if (!data) {
        return (
            <div className="h-screen w-full overflow-hidden flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-red-500">URL Not Found</CardTitle>
                        <CardDescription>
                            The requested short URL does not exist or has expired.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="h-screen w-full overflow-hidden flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <Link2 className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">URL Redirect</CardTitle>
                    <CardDescription>
                        You are about to be redirected to the original URL. Click the button below to continue.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <Link2 className="h-4 w-4" />
                                Current URL
                            </Label>
                            <div className="flex space-x-2">
                                <Input
                                    value={formater(data.shortUrl)}
                                    readOnly
                                    className="flex-1 text-sm"
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCopyShortUrl}
                                    className="shrink-0"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <ExternalLink className="h-4 w-4" />
                                Redirect URL
                            </Label>
                            <div className="flex space-x-2">
                                <Input
                                    value={data.longUrl}
                                    readOnly
                                    className="flex-1 text-sm"
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCopyLongUrl}
                                    className="shrink-0"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Created
                            </Label>
                            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                                {new Date(data.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button
                            onClick={onRedirect}
                            className="flex-1 h-12"
                            size="lg"
                        >
                            <ExternalLink className="h-5 w-5 mr-2" />
                            Continue to Original URL
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => window.history.back()}
                            className="sm:w-auto h-12"
                            size="lg"
                        >
                            Go Back
                        </Button>
                    </div>

                    <div className="text-center">
                        <p className="text-xs text-muted-foreground">
                            You will be redirected to: <span className="font-mono break-all">{data.longUrl}</span>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}