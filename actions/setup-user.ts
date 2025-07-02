'use server'

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function setupUser() {
    const { userId } = await auth();
    const userdata = await currentUser()
    const email = userdata?.emailAddresses[0].emailAddress

    if (!email) {
        throw new Error("Invalid email address");
    }

    if (!userId) {
        throw new Error("User not authenticated");
    }

    // Check if user already exists
    const user = await prisma.user.findUnique({
        where: { email: email },
    });

    if (user) {
        return user;
    }

    // Create a new user
    const newUser = await prisma.user.create({
        data: {
            id: userId,
            email,
        },
    });

    return newUser;
}