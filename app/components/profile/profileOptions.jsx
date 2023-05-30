"use client";

import { Fragment, useRef, useState } from 'react'
import { toast } from "react-hot-toast";
import { AiFillGithub, AiFillLinkedin, AiOutlineTwitter, AiFillFacebook, AiFillYoutube } from "react-icons/ai";
import { FaTiktok, FaDiscord, FaSoundcloud, FaTumblrSquare, FaTwitch, FaPinterest, FaSnapchatGhost, FaSpotify, FaInstagram } from "react-icons/fa";
import { HiLink } from "react-icons/hi";
import { HiXMark } from "react-icons/hi2";
import { MdTitle } from "react-icons/md";

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

export default function ProfileOptions() {
    const [open, setOpen] = useState(false);
    const cancelButtonRef = useRef(null);
    const [data, setData] = useState({platform: "", url: "", title: ""});
    const [selectedPlatform, setSelectedPlatform] = useState(false);

    const icons = Object.entries(platformIcons).map(([platform, IconComponent], index) => (
      <button
        onClick={() => {setData({ ...data, platform: platform }), handlePlatformClick(platform)}}
        key={index}
        className={`flex flex-col justify-center items-center p-2 max-w-[85px] max-h-[85px] rounded-sm hover:bg-neutral-100 select-none ${
          selectedPlatform === platform ? 'bg-neutral-100' : ''
        }`}
      >
        <IconComponent className="flex w-[90%] h-[90%]" />
        <h1 className="text-xs sm:text-sm font-semibold text-neutral-400">{platform}</h1>
      </button>
    ));
  
    const handlePlatformClick = (platform) => {
      setSelectedPlatform(platform);
    };

    const addLink = async (e) => {
        e.preventDefault();
        
        fetch('/api/link/add', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(async (response) => {
          if (response.ok) {
            toast.success("Added new link!");
            window.location.reload();
          } else {
            const error = await response.text();
            throw new Error(error);
          }
        })
        .catch((error) => {
          toast.error(error.message);
        });
      };
    
    return (
        <div className="relative">
            <div className="relative mt-4 flex flex-row min-w-full font-bold justify-between items-center">
                <button className="flex min-w-[49%] py-1 border border-neutral-300 shadow-sm justify-center items-center rounded-md hover:bg-neutral-100">Edit Profile</button>
                <button onClick={() => setOpen(!open)} className="flex min-w-[49%] py-1 border border-neutral-300 shadow-sm justify-center items-center rounded-md hover:bg-neutral-100">Add Links</button>
            </div>

            {open && <div onClick={() => setOpen(!open)} className="fixed top-0 left-0 z-10 flex backdrop-blur-md bg-black bg-opacity-20 w-screen min-h-screen"/>}
            {open &&
                <form className="z-20 top-0 absolute flex flex-col justify-center items-center min-w-full space-y-6 mt-5 pb-8 bg-white border-[1px] drop-shadow-md rounded-md" onSubmit={addLink}>
                    <button onClick={() => setOpen(!open)} className="absolute top-3 right-3 h-6 w-6 text-neutral-400"><HiXMark className="w-full h-full"/></button>
                    
                    <div className="flex flex-col min-w-full items-center justify-center pt-4">
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-5 max-w-[90%]">
                            {icons}
                        </div>
                    </div>

                    <div className="w-[80%]">
                        {/* <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                        Link
                        </label> */}
                        <div className="relative">
                            <input
                                id="url"
                                name="url"
                                type="url"
                                required
                                autocomplete="off"
                                maxLength={64}
                                value={data.url}
                                onChange={e => setData({ ...data, url: e.target.value })}
                                placeholder={`Link to ${data.platform}`}
                                className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 text-sm shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6"
                            />
                            <HiLink className="h-full w-6 text-neutral-300 absolute left-2 top-0"/>
                        </div>
                    </div>

                    {data.platform === "custom" ? (
                        <div className="w-[80%]">
                            <div className="flex items-center justify-between">
                            {/* <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Title
                            </label> */}
                            </div>
                            <div className="relative">
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    autocomplete="off"
                                    maxLength={20}
                                    value={data.title}
                                    onChange={e => setData({ ...data, title: e.target.value })}
                                    placeholder="Title"
                                    className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6 invalid:ring-2 invalid:ring-inset invalid:ring-red-600"
                                />
                                <MdTitle className="h-full w-6 text-neutral-300 absolute left-2 top-0"/>
                            </div>
                        </div>
                    ) : null}
        
                    <div className="w-[80%]">
                        <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-neutral-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-neutral-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-600"
                        >
                        Add Link
                        </button>
                    </div>
                </form>
            }
        </div>
    )
}