'use server'
import prisma from "@/lib/prisma";
import { isValidUrl, formater, generateShortUrl, normalizeUrl } from "@/lib/url";
import { Url } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { setupUser } from "../setup-user";

export async function createShortUrl(url: string): Promise<Url> {
    const user = await setupUser();

    if (!(await isValidUrl(url))) {
        throw new Error("Invalid URL or URL is not accessible");
    }

    const normalizedUrl = normalizeUrl(url);
    const shortUrl = await generateShortUrl();
    const formattedUrl = formater(shortUrl);

    const data = await prisma.url.create({
        data: {
            userId: user.id,
            shortUrl,
            longUrl: normalizedUrl,
        },
    });

    revalidatePath("/");

    return {
        ...data,
        shortUrl: formattedUrl,
    };
}