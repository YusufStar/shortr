"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Share2 } from "lucide-react";
import { useState } from "react";
import UrlCreatedDialog from "./url-created-dialog";
import { createShortUrl } from "@/actions/url/create";
import { Url } from "@prisma/client";

export default function HomePage() {
    const [url, setUrl] = useState<string>("");
    const [response, setResponse] = useState<Url | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleCreateShortLink = async () => {
        try {
            setError(null);
            const data = await createShortUrl(url);
            if (data) {
                setResponse(data);
                setIsDialogOpen(true);
            }
        } catch (err) {
            if (err instanceof Error) {
                console.error("Error creating short URL:", err);
                setError(err.message);
            } else {
                setError("An unexpected error occurred.");
            }
        }
    };

    return (
        <div className="h-screen w-full overflow-hidden flex items-center justify-center">
            <UrlCreatedDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} response={response} />

            <Card className="w-full max-w-xl">
                <CardHeader>
                    <CardTitle>
                        Welcome to Shortr
                    </CardTitle>
                    <CardDescription>
                        A simple URL shortener built with Next.js, Clerk, and Prisma.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="relative">
                        <Input 
                            placeholder="Enter your URL here..." 
                            className="w-full h-14 rounded-full pr-48"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                        <Button className="absolute top-0 right-0 h-14 px-4! rounded-full" variant="outline" onClick={handleCreateShortLink}>
                            <Share2 className="h-4 w-4" />
                            Create Short Link
                        </Button>
                    </div>
                    {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
                </CardContent>
            </Card>
        </div>
    )
}