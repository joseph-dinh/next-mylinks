"use client";

import { Fragment, useRef, useState } from 'react'
import { toast } from "react-hot-toast";
import { Dialog, Transition } from '@headlessui/react'
import { AiFillGithub, AiFillLinkedin, AiOutlineTwitter, AiFillFacebook, AiFillYoutube } from "react-icons/ai";
import { FaTiktok, FaDiscord, FaSoundcloud, FaTumblrSquare, FaTwitch, FaPinterest, FaSnapchatGhost, FaSpotify, FaInstagram } from "react-icons/fa";
import { HiLink } from "react-icons/hi";
import { HiXMark } from "react-icons/hi2";

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

    const icons = Object.entries(platformIcons).map(([platform, IconComponent], index) => (
        <button onClick={() => setOpen(false)} key={index} className="flex flex-col justify-center items-center w-20 h-20 aspect-square">
            <IconComponent className="w-8 h-8" />
            <h1 className='text-sm font-semibold text-neutral-400'>{platform}</h1>
        </button>
    ));

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
        <>
            <div className="relative mt-4 flex flex-row min-w-full font-bold justify-between items-center">
                <button className="flex min-w-[49%] py-1 border border-neutral-300 shadow-sm justify-center items-center rounded-md hover:bg-neutral-100">Edit Profile</button>
                <button onClick={() => setOpen(!open)} className="flex min-w-[49%] py-1 border border-neutral-300 shadow-sm justify-center items-center rounded-md hover:bg-neutral-100">Add Links</button>
            </div>

            {/* {open && 
                <Transition.Root show={open} as={Fragment}>
                    <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>
            
                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex flex-col min-h-screen sm:min-h-full items-center justify-center p-4 text-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative flex flex-col transform overflow-hidden w-full rounded-md bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <button ref={cancelButtonRef} onClick={() => setOpen(false)} className="absolute top-5 right-5 w-6 h-6 text-neutral-500"><HiXMark className="min-w-full min-h-full"/></button>
                                    <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                        Add new link
                                        </Dialog.Title>
                                        <div className="flex flex-row gap-2 mt-2 text-sm text-gray-500 justify-evenly items-center">
                                            <button className="hover:text-black">Socials</button>
                                            <button className="hover:text-black">Payments</button>
                                            <button className="hover:text-black">Contacts</button>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                <div className="flex justify-center items-center">
                                    <div className="grid grid-cols-3 min-h-full gap-12 px-4 pt-5 pb-7">
                                        {icons}
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                        </div>
                    </div>
                    </Dialog>
                </Transition.Root>
            } */}

            {open &&
                <form className="space-y-6 mt-5" onSubmit={addLink}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                        Platform
                        </label>
                        <div className="mt-2">
                        <input
                            id="platform"
                            name="platform"
                            type="text"
                            required
                            autocomplete="off"
                            value={data.platform}
                            onChange={e => setData({ ...data, platform: e.target.value })}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6 invalid:ring-2 invalid:ring-inset invalid:ring-red-600"
                        />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                        Link
                        </label>
                        <div className="mt-2">
                        <input
                            id="url"
                            name="url"
                            type="text"
                            required
                            autocomplete="off"
                            maxLength={64}
                            value={data.url}
                            onChange={e => setData({ ...data, url: e.target.value })}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6 invalid:ring-2 invalid:ring-inset invalid:ring-red-600"
                        />
                        </div>
                    </div>
                    
                    {data.platform === "custom" ? (
                    <div>
                        <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                            Title
                        </label>
                        </div>
                        <div className="mt-2">
                        <input
                            id="title"
                            name="title"
                            type="text"
                            autocomplete="off"
                            maxLength={64}
                            value={data.title}
                            onChange={e => setData({ ...data, title: e.target.value })}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-neutral-600 sm:text-sm sm:leading-6 invalid:ring-2 invalid:ring-inset invalid:ring-red-600"
                        />
                        </div>
                    </div>
                    ) : null}
        
                    <div>
                        <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-neutral-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-neutral-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-600"
                        >
                        Add Link
                        </button>
                    </div>
                </form>
            }
        </>
    )
}