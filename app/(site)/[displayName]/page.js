import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "../../libs/prismadb";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";

export default async function UserProfile(context) {
  const session = await getServerSession(authOptions)
  console.log(session);

  const profile = await prisma.Profile.findUnique({
    where: {
      displayName: context.params.displayName,
    }
  });

  console.log(profile)

  const socialLinks = await prisma.socialLink.findMany({
    where: {
      profileId: profile.id
    }
  });

  const platformIcons = {
    github: AiFillGithub,
    linkedin: AiFillLinkedin,
  };

  console.log(socialLinks)

  return (
    <main className="p-5">
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
        {/* To Do: Add functionality for if displayName = session user's displayName & onClick functionality */}
        <div className="mt-4 flex flex-row min-w-full font-bold justify-between items-center">
          <button className="flex min-w-[49%] py-1 border border-neutral-300 shadow-sm justify-center items-center rounded-md hover:bg-neutral-100">Edit Profile</button>
          <button className="flex min-w-[49%] py-1 border border-neutral-300 shadow-sm justify-center items-center rounded-md hover:bg-neutral-100">Share Profile</button>
        </div>
        
        <div className="mt-8 flex flex-col gap-3">
            {socialLinks && socialLinks.map((link, i) => {
              const IconComponent = platformIcons[link?.platform];
              return (
                <div key={i} className="flex flex-row min-w-full px-3 py-2 gap-3 border border-neutral-300 shadow-sm justify-start items-center rounded-md hover:bg-neutral-100">
                  <div className="aspect-square min-h-full w-10">
                    <IconComponent className="min-w-full min-h-full"/>
                  </div>
                  <div className="flex flex-col">
                    <h1 className="font-bold">{link?.platform}</h1>
                    <h2 className="text-sm font-normal">{link?.url}</h2>
                  </div>
                </div>
              )
            })}
        </div>

      </div>
    </main>
  )
}