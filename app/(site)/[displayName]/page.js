import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "../../libs/prismadb";
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

  if (session) {
    const user = await prisma.User.findUnique({
      where: {
        email: session?.user.email,
      },
      select: {
        id: true,
      }
    });

    if (user.id === profile.userId) {
      profileOwner = true;
    }
  }

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
            <img src="/twobarsright.svg" className="h-[75%] w-[75%]"/>
          </button>
        </div>
        <div className="mt-4 flex flex-row justify-between min-w-full">
          <div className="flex flex-col gap-2 text-sm max-w-[60%]">
            {/* To Do: Add database fields for first name last name bio followers */}
            <h2 className="text-neutral-400 font-semibold">Johnathan Doe</h2>
            <p className="text-ellipsis line-clamp-3">This is a super long bio introduction area where you can post your introductions!</p>
            <div className="inline-block"><span className="font-bold">75k</span> followers</div>
          </div>
          <div className="flex bg-blue-400 rounded-full h-24 w-24">
            <img src={`https://avatars.githubusercontent.com/u/118394420?v=4`} className="rounded-full min-w-full min-h-full"/>
          </div>
        </div>
        {profileOwner &&
        // <div className="mt-4 flex flex-row min-w-full font-bold justify-between items-center">
        //   <button className="flex min-w-[49%] py-1 border border-neutral-300 shadow-sm justify-center items-center rounded-md hover:bg-neutral-100">Edit Profile</button>
        //   <button className="flex min-w-[49%] py-1 border border-neutral-300 shadow-sm justify-center items-center rounded-md hover:bg-neutral-100">Share Profile</button>
        // </div>
        <ProfileOptions/>
        }

        <ProfileLinks socialLinks={socialLinks}/>

      </div>
    </main>
  )
}