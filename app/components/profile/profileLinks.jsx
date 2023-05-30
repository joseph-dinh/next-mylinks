"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { AiFillGithub, AiFillLinkedin, AiOutlineTwitter, AiFillFacebook, AiFillYoutube } from "react-icons/ai";
import { FaTiktok, FaDiscord, FaSoundcloud, FaTumblrSquare, FaTwitch, FaPinterest, FaSnapchatGhost, FaSpotify, FaInstagram } from "react-icons/fa";
import { HiLink } from "react-icons/hi";
import { SlOptions, SlOptionsVertical } from "react-icons/sl";

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
    const socialLinks = context.data.socialLinks;
    const profileOwner = context.data.profileOwner;
    const [linkOptions, setLinkOptions] = useState({});
    const menuRef = useRef();
    const [open, setOpen] = useState(false);
    
    const toggleLinkOptions = (linkId) => {
      setLinkOptions((prevOptions) => ({
        ...prevOptions,
        [linkId]: !prevOptions[linkId],
      }));
    };

    // Buggy event listener
    // if (profileOwner) {
    //   useEffect(() => {
    //     let handleOutsideClick = (e) => {
    //       if (!menuRef.current.contains(e.target)) {
    //         setLinkOptions(false);
    //       }
    //     };
      
    //     document.addEventListener("mousedown", handleOutsideClick);
      
    //     return () => {
    //       document.removeEventListener("mousedown", handleOutsideClick);
    //     };
    //   }, []);
    // }
    
    const deleteLink = async (linkId) => {
      fetch('/api/link/delete', {
        method: 'POST',
        body: JSON.stringify({ socialLinkId: linkId }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(async (response) => {
        if (response.ok) {
          toast.success("Deleted link!");
          window.location.reload();
        } else {
          const error = await response.text();
          throw new Error(error);
        }
      })
      .catch((error) =>{
        toast.error(error.message);
      })
    };

    // Add modal for edit social link, and add the values in the body
    const editLink = async (linkId) => {
      fetch('/api/link/edit', {
        method: 'POST',
        body: JSON.stringify({ socialLinkId: linkId, platform: "", url: "https://www.getrekt.com/noob", title: "" }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(async (response) => {
        if (response.ok) {
          toast.success("Edited link!");
          window.location.reload();
        } else {
          const error = await response.text();
          throw new Error(error);
        }
      })
      .catch((error) =>{
        toast.error(error.message);
      })
    };

    return (
    <>
      <div className="mt-8 flex flex-col gap-3">
        {socialLinks && socialLinks.map((link, i) => {
          const IconComponent = platformIcons[link?.platform];
          return (
            <div key={link?.id} className="relative">
              <a href={link?.url} target="_blank" className="flex flex-row min-w-full px-3 py-2 gap-3 border border-neutral-300 shadow-sm justify-start items-center rounded-md hover:bg-neutral-100">
                <div className="aspect-square h-10 w-10">
                  <IconComponent className="min-w-full min-h-full"/>
                </div>
                <div className="flex flex-col max-w-[88%]">
                  <h1 className="font-bold text-ellipsis line-clamp-1">{link?.platform != "custom" ? link?.platform : undefined}</h1>
                  <h1 className="font-bold text-ellipsis line-clamp-1">{link?.title}</h1>
                  <h2 className="text-sm font-normal text-ellipsis line-clamp-1">{link?.url}</h2>
                </div>
              </a>
              {profileOwner && (
                <button onClick={() => {toggleLinkOptions(link?.id), setOpen(!open)}} className="absolute right-0 top-0 h-full px-3 p-1 sm:h-4 sm:top-1 sm:right-2 sm:px-1 text-neutral-400">
                  <SlOptions className="hidden sm:flex"/>
                  <SlOptionsVertical className="sm:hidden sm:min-h-full"/>
                  <div ref={menuRef} className="relative">
                    {linkOptions[link?.id] && 
                      <ul className="z-20 absolute top-0 right-0 flex flex-col drop-shadow-md rounded-md border-[1px] py-1 text-sm font-semibold text-black bg-white border-neutral-200">
                        <li className="hover:bg-neutral-100 py-1 px-6">Share</li>
                        <li className="hover:bg-neutral-100 py-1 px-6">Edit</li>
                        <div className="my-1 min-w-full bg-neutral-200 h-[1px] "/>
                        <li onClick={() => deleteLink(link?.id)} className="hover:bg-neutral-100 py-1 px-6 text-red-600">Delete</li>
                      </ul>
                    }
                  </div>
                </button>
              )}
              {open && <div onClick={() => {setLinkOptions(false), setOpen(!open)}} className="fixed top-0 left-0 z-10 flex w-screen min-h-screen"/>}
            </div>
          )
        })}
      </div>
    </>
    )
  }


  // Alternative Component Style
  // <a key={link?.id} href={link?.url} target="_blank" className="relative group flex flex-row min-w-full px-3 py-2 gap-3 border border-neutral-300 shadow-sm justify-start items-center rounded-md hover:bg-neutral-100">
  //   <div className="aspect-square min-h-full w-10">
  //     <IconComponent className="min-w-full min-h-full"/>
  //   </div>
  //   <div className="flex flex-col max-w-[88%]">
  //     <h1 className="font-bold text-ellipsis line-clamp-1">{link?.platform != "custom" ? link?.platform : undefined}</h1>
  //     <h1 className="font-bold text-ellipsis line-clamp-1">{link?.title}</h1>
  //     <h2 className="text-sm font-normal text-ellipsis line-clamp-1">{link?.url}</h2>
  //   </div>
  //   <button onClick={() => deleteLink(link?.id)} className="absolute hidden group-hover:flex top-1 right-2 text-neutral-400 p-1"><SlOptions/></button>
  // </a>