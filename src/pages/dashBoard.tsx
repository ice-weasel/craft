"use client";
import Navbar from "@/components/navbar";
import { useState } from "react";
import "tailwindcss/tailwind.css";
import { useRouter } from "next/navigation";
import { NextApiRequest } from "next";
import { motion } from "framer-motion";
import CircularProgress from "@/components/circluarProgress";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import Tabs from "@/components/tabs/tabs-dashboard";
import { GoArrowUpRight } from "react-icons/go";
//Cookie verification
export async function getServerSideProps(context: any) {
  const { req } = context;
  const sessionCookie = req.cookies["session"];

  if (!sessionCookie) {
    // Redirect to login
    return {
      redirect: {
        destination: "/Login",
        permanent: false,
      },
    };
  }

  // Pass session data to the page
  return { props: { sessionCookie } };
}

const mont = Montserrat({
  weight: "700",
  subsets: ["latin"],
});

const Dashboard = ({ sessionCookie }: any) => {
  return (
    <div className="bg-white w-full text-black h-screen flex flex-col justify-between">
      <div className="h-1/2 ">
        <nav className=" bg-white h-1/6 items-center text-center">
          <div className="w-screen flex flex-wrap items-center justify-between  mx-auto pl-10 pr-10 pt-4 pb-4">
            <div className=" flex flex-row p-2">
              <Image
                alt="logo"
                src="/craft-logo-new.png"
                width="50"
                height="50"
              ></Image>
              <div className="mt-3 text-3xl">
                <h1 className={mont.className}>Craft</h1>
              </div>
            </div>
            <div className="flex flex-row space-x-5 p-2">
              <button className="rounded-full ">
                <Image
                  alt="profile"
                  src="/profile-icon-new.png"
                  width="50"
                  height="50"
                ></Image>
              </button>
              <a
                href="#_"
                className="flex items-center justify-center px-4 py-2 text-base font-medium leading-6 text-white whitespace-no-wrap bg-black border-4 border-transparent rounded-full shadow-sm hover:bg-transparent hover:text-black hover:border-black focus:outline-none"
              >
                Menu
              </a>
            </div>
          </div>
        </nav>
        <div className="flex flex-row justify-between p-10">
          <div className="w-1/2 rounded-lg flex flex-col justify-around ">
            <div className="space-y-8">
              <div className="text-8xl font-semibold">Hey, Carolina!</div>
              <div className="text-xl">
                Bring your ideas to life with adaptability that grows with you.
                Whether it’s organizing simple steps <br />
                or managing complex tasks, you have the tools to make it happen.
                Get started with a template <br />
                or build your own – the power is yours.{" "}
                <div className="font-semibold">Your workflow, Your rules!</div>
              </div>
            </div>
            <button className="w-1/3  group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-xl bg-white border-4 border-black px-6 font-medium text-black duration-500">
              <div className="translate-x-0 opacity-100 text-lg transition group-hover:-translate-x-[150%] group-hover:opacity-0">
                Check out the toolkits!
              </div>
              <div className="absolute translate-x-[150%] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                >
                  <path
                    d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                    fill="currentColor"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </div>
            </button>
          </div>
          <div className="w-1/2 rounded-lg relative">
            <img
              alt="abstract img"
              src="/abstract-img.png"
              className="rounded-xl z-0 object-cover "
              width="1000"
            ></img>
            <button className="absolute bottom-8 left-8 w-2/5 p-2 pl-4 pr-4 h-1/6 text-black shadow-sm items-center rounded-full backdrop-blur-lg bg-white/30   hover:bg-white flex justify-between">
              {" "}
              <div className="text-xl">Create new workflows</div>
              <div>
                <GoArrowUpRight className="mt-1" size={22} />
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="h-1/2">
        <Tabs />
      </div>
    </div>
  );
};

export default Dashboard;
