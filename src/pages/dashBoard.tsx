"use client";
import Navbar from "@/components/navbar";
import { useState } from "react";
import "tailwindcss/tailwind.css";
import { useRouter } from "next/navigation";
import { NextApiRequest } from "next";
import { motion } from "framer-motion";
import CircularProgress from "@/components/circluarProgress";

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

const Dashboard = ({ sessionCookie }: any) => {
  return (
    <div className="bg-black w-full text-white h-screen flex flex-col justify-between">
      <div className="h-1/2">
        <nav className=" bg-gray-900 h-1/6 items-center text-center ">
          <div className="w-screen flex flex-wrap items-center justify-between  mx-auto p-4">
            <div>CRAFT</div>
            <div className="flex flex-row space-x-5">
              <div>Profile</div>
              <div>Menu</div>
            </div>
          </div>
        </nav>
      </div>
      <div className="h-1/2">gello</div>
    </div>
  );
};

export default Dashboard;
