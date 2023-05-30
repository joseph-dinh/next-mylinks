import prisma from "../../../libs/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const platforms = [
    "github",
    "linkedin",
    "twitter",
    "facebook",
    "youtube",
    "tiktok",
    "discord",
    "soundcloud",
    "tumblr",
    "twitch",
    "pinterest",
    "snapchat",
    "spotify",
    "instagram",
    "custom",
];

const urlRegex = /^((https?:\/\/)|(www\.))[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)|/;

export async function POST(request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    };

    try {
        const userWithProfile = await prisma.user.findUnique({
            where: {
                email: session?.user.email,
            },
            include: {
                userProfile: true,
            },
        });

        const profileId = userWithProfile.userProfile.id;

        const body = await request.json();
        const { platform, url, title } = body;

        if (!platform || !url) {
            return new NextResponse("Missing Fields", { status: 400 });
        };

        const existingLink = await prisma.SocialLink.findFirst({
            where: {
                profileId: profileId,
                platform: platform,
                url: url,
            },
        });

        if (existingLink) {
            return new NextResponse("Link already exists", { status: 409 });
        };

        if (!platforms.includes(platform)) {
            return new NextResponse("Invalid platform", { status: 400 });
        };

        if (!urlRegex.test(url)) {
            return new NextResponse("Invalid link format", { status: 400 });
        };

        const newLink = await prisma.SocialLink.create({
            data: {
                profileId: profileId,
                platform: platform,
                url: url,
                title: title,
            },
        });

        return NextResponse.json(newLink);
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
