"use server";

import prisma from "@/lib/prisma";
import { Url } from "@prisma/client";
import { redirect } from "next/navigation";
import { setupUser } from "../setup-user";

export async function clickUrl(url: string): Promise<Url> {
    const user = await setupUser()
    
    const data = await prisma.url.findUnique({
        where: { shortUrl: url },
    });

    if (!data) {
        redirect("/");
    }

    // Increment click count
    await prisma.click.create({
        data: {
            urlId: data.id,
            userId: user.id,
            userAgent: navigator.userAgent,
            ipAddress: "<IP_ADDRESS>",
        }
    })

    redirect(data.longUrl);
}