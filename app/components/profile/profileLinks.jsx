import { AiFillGithub, AiFillLinkedin, AiOutlineTwitter, AiFillFacebook, AiFillYoutube } from "react-icons/ai";
import { FaTiktok, FaDiscord, FaSoundcloud, FaTumblrSquare, FaTwitch, FaPinterest, FaSnapchatGhost, FaSpotify, FaInstagram } from "react-icons/fa";
import { HiLink } from "react-icons/hi";

const platformIcons = {
  github: AiFillGithub,
  linkedin: AiFillLinkedin,
  twitter: AiOutlineTwitter,
  facebook: AiFillFacebook,
  youtube: AiFillYoutube,
  tiktok: FaTiktok,
  discord: FaDiscord,
  soundcloud: FaSoundcloud,
  tumblr: FaTumblrSquare,
  twitch: FaTwitch,
  pinterest: FaPinterest,
  snapchat: FaSnapchatGhost,
  spotify: FaSpotify,
  instagram: FaInstagram,
  custom: HiLink,
};

export default function ProfileLinks(context) {
    const socialLinks = context.socialLinks;

    return (
    <>
        <div className="mt-8 flex flex-col gap-3">
            {socialLinks && socialLinks.map((link, i) => {
              const IconComponent = platformIcons[link?.platform];
              return (
                <a key={link?.id} href={link?.url} target="_blank" className="flex flex-row min-w-full px-3 py-2 gap-3 border border-neutral-300 shadow-sm justify-start items-center rounded-md hover:bg-neutral-100">
                  <div className="aspect-square min-h-full w-10">
                    <IconComponent className="min-w-full min-h-full"/>
                  </div>
                  <div className="flex flex-col max-w-[88%]">
                    <h1 className="font-bold text-ellipsis line-clamp-1">{link?.platform != "custom" ? link?.platform : undefined}</h1>
                    <h1 className="font-bold text-ellipsis line-clamp-1">{link?.title}</h1>
                    <h2 className="text-sm font-normal text-ellipsis line-clamp-1">{link?.url}</h2>
                  </div>
                </a>
              )
            })}
        </div>
    </>
    )
    }
