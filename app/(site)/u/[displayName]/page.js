import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "../../../libs/prismadb";
import ProfileLinks from "@/app/components/profile/profileLinks";
import ProfileOptions from "@/app/components/profile/profileOptions";

export default async function UserProfile(context) {
  const session = await getServerSession(authOptions);
  var profileOwner = false;

  const profile = await prisma.Profile.findUnique({
    where: {
      displayName: context.params.displayName,
    }
  });

  const user = await prisma.User.findUnique({
    where: {
      id: profile.userId,
    },
    select: {
      name: true,
      image: true,
    }
  });

  if (session) {
    const sessionUser = await prisma.User.findUnique({
      where: {
        email: session?.user.email,
      },
      select: {
        id: true,
      }
    });
    
    if (sessionUser.id === profile.userId) {
      profileOwner = true;
    }
  };

  const socialLinks = await prisma.socialLink.findMany({
    where: {
      profileId: profile.id
    }
  });

  return (
    <main className="p-5 mx-auto max-w-2xl sm:px-6 lg:px-8">
      <div className="flex flex-col min-w-full">
        <div className="flex flex-row min-w-full min-h-full items-end justify-between">
          <h1 className="text-4xl font-bold">{profile?.displayName}</h1>
          <button className="flex min-h-full w-10 justify-end items-end aspect-square">
            <img src="/custombars2.svg" className="h-[75%] w-[75%]"/>
          </button>
        </div>
        <div className="mt-4 flex flex-row justify-between min-w-full">
          <div className="flex flex-col gap-2 text-sm max-w-[60%] justify-between">
            <div className="flex flex-col gap-2">
              <h2 className="text-neutral-400 font-semibold">{user?.name}</h2>
              <p className="text-ellipsis line-clamp-3">{profile?.biography}</p>
            </div>
            <div className="inline-block"><span className="font-bold">75k</span> followers</div>
          </div>
          <div className="flex bg-blue-400 rounded-full h-24 w-24">
            <img src={user?.image} className="rounded-full min-w-full min-h-full"/>
          </div>
        </div>
        {profileOwner &&
          <ProfileOptions/>
        }
        <ProfileLinks data={{socialLinks: socialLinks, profileOwner: profileOwner}}/>
      </div>
    </main>
  )
}