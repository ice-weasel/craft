"use client"
import Navbar from "@/components/navbar";
import { useState } from "react";
import "tailwindcss/tailwind.css";
import { useRouter } from "next/navigation";
import { NextApiRequest } from "next";
import { motion } from "framer-motion";
import CircularProgress from "@/components/circluarProgress";

//Cookie verificatiooon thingyyy
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
    <div className="bg-gray-50 w-full h-full flex flex-col p-5 space-y-12">

      {/* User Dashboard */}
      <div className="flex mt-12 p-3 flex-row justify-evenly items-center">
        <div className="flex flex-col">
          <h1 className="text-5xl font-bold">Hey, Usman!</h1>
          <p className="mt-4 text-xl text-gray-600">Let’s get creative</p>
        </div>

        {/* Boxes */}
        <div className="flex flex-row items-center space-x-8">

        <div className="bg-white rounded-full  p-8 shadow-lg text-center z-10">
        <h2 className="text-6xl mt-2 font-bold text-gray-800">3</h2>
        <p className="">Projects</p>
      </div>

          <div className="bg-white flex justify-center flex-col rounded-full p-10 shadow-lg text-center">
            <h2 className="text-3xl font-bold text-gray-800">$100.7M</h2>
           <p className="text-blue-600 mt-2 text-xl">Revenue</p>
          </div>

          <div className="bg-white rounded-full p-8 shadow-lg text-center">
            <h2 className="text-5xl font-bold text-center text-gray-800">50%</h2>
            <p>Efficiency</p>
          </div>

        </div>
      </div>

      {/* History of Workflows */}
      <div className="flex flex-row justify-between items-center py  border-b-2">
  {/* Tabs */}
  <div className="flex flex-row space-x-8">
    <div className="border-b-2 border-black pb-2">
      <h2 className="text-md font-semibold">Recent</h2>
    </div>
    <div>
      <h2 className="text-md text-gray-500">Favourite</h2>
    </div>
    <div>
      <h2 className="text-md text-gray-500">All projects</h2>
    </div>
  </div>

  {/* Search */}
  <div className="text-gray-400">
    <input
      type="text"
      className="outline-none focus:border-b-2 focus:border-black px-4  py-1 text-gray-400"
      placeholder="Search for metrics"
    />
  </div>
</div>
{/* Flow History */}
      
    </div>
  );
};

export default Dashboard;

