"use client";
import Navbar from "@/components/navbar";
import { useState } from "react";
import "tailwindcss/tailwind.css";
import { useRouter } from "next/navigation";
import { NextApiRequest } from "next";
import { motion } from "framer-motion";
import CircularProgress from "@/components/circluarProgress";
import Image from "next/image";
import { Syne } from "next/font/google";
import Tabs from "@/components/tabs/tabs-dashboard";
//Cookie verification
export async function getServerSideProps(context: any) {
  const { req } = context;
  const sessionCookie = req.cookies["session"];

  if (!sessionCookie) {
    // Redirect to login if no session cookie
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

const syne = Syne({
  weight: "700",
  subsets: ["latin"],
});

const Dashboard = ({ sessionCookie }: any) => {
  return (
    <div className="bg-white w-full text-black h-screen flex flex-col justify-between">
      <div className="h-1/2 ">
        <nav className=" bg-white h-1/6 items-center text-center">
          <div className="w-screen flex flex-wrap items-center justify-between  mx-auto p-4">
            <div className=" flex flex-row p-2">
              <Image
                alt="logo"
                src="/craft-logo-new.png"
                width="50"
                height="50"
              ></Image>
              <div className="mt-3 text-2xl">
                <h1 className={syne.className}>Craft</h1>
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
      </div>
      <div className="h-1/2">
        <Tabs />
      </div>
    </div>
  );
};

export default Dashboard;
