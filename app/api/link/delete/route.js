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
        const { socialLinkId } = body;

        if (!socialLinkId) {
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

        const deleteLink = await prisma.SocialLink.delete({
            where: {
                id: socialLinkId,
            }
        });

        return NextResponse.json(deleteLink);
    } catch (error) {
        console.log(error)
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
