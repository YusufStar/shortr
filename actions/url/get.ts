"use server";

import prisma from "@/lib/prisma";
import { Url } from "@prisma/client";
import { redirect } from "next/navigation";

export async function getUrl(url: string): Promise<Url> {
    const data = await prisma.url.findUnique({
        where: { shortUrl: url },
    });

    if (!data) {
        redirect("/");
    }

    return data;
}