import prisma from "../../../libs/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

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
        const { socialLinkId, platform, url, title } = body;
        
        var socialPlatform = platform;
        var socialUrl = url;
        var socialTitle = title;

        if (!socialLinkId && (platform || url || title)) {
            return new NextResponse("Missing Fields", { status: 400 });
        };

        const existingLink = await prisma.SocialLink.findFirst({
            where: {
                id: socialLinkId,
            },
        });

        if (!existingLink) {
            return new NextResponse("Link does not exist", { status: 409 });
        };

        const linkAssociatedWithUser = await prisma.SocialLink.findUnique({
            where: {
                id: socialLinkId,
            },
        });

        if (linkAssociatedWithUser.profileId !== profileId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!platform) {
            socialPlatform = undefined;
        };

        if (!url) {
            socialUrl = undefined;
        };

        if (!title) {
            socialTitle = undefined;
        };

        const updateLink = await prisma.SocialLink.update({
            where: {
                id: socialLinkId,
            },
            data: {
                platform: socialPlatform,
                url: socialUrl,
                title: socialTitle,
            }
        });

        console.log(updateLink);

        return NextResponse.json(updateLink);
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
