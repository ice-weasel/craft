"use client";
import Navbar from "@/components/navbar";
import { useState,useEffect, ReactEventHandler } from "react";
import "tailwindcss/tailwind.css";
import { useRouter } from "next/navigation";
import { NextApiRequest } from "next";
import CircularProgress from "@/components/circluarProgress";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import Tabs from "@/components/tabs/tabs-dashboard";
import { GoArrowUpRight } from "react-icons/go";
import Link from "next/link";
import { getAuth, signInWithCredential } from "firebase/auth";
import firebaseApp from "@/app/firebase";
import { adminauth,db }  from "@/app/firebaseAdmin";
import { signOut } from "firebase/auth";




//Cookie verification
export async function getServerSideProps(context: any) {
  const { req } = context;
  const sessionCookie = req.cookies["session"];

  if (!sessionCookie) {
    console.log("No session cookie found.");
    return {
      redirect: {
        destination: "/Login",
        permanent: false,
      },
    };
  }

  

  try {
    // Verify the session cookie
    const decodedToken = await adminauth.verifySessionCookie(sessionCookie, true);
    const { uid } = decodedToken;

    console.log("Decoded UID:", uid);

    // Fetch user data from Firestore
    const userDoc = await db.collection("Users").doc(uid).get();

    if (!userDoc.exists) {
      console.log(`No user document found for UID: ${uid}`);
      
    }

    const firestoreData = userDoc.data();
    console.log("Fetched Firestore Data:", firestoreData);

    const user = {
      uid,
      ...firestoreData,
      Name: firestoreData?.Name || "User",
    };

    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      redirect: {
        destination: "/Login",
        permanent: false,
      },
    };
  }
}





const mont = Montserrat({
  weight: "700",
  subsets: ["latin"],
});

const Dashboard =({ user }: { user: any }) => {
  const [userName, setUserName] = useState(user?.Name || "User");
  const [showProf,setshowProf] = useState(false);

  const router = useRouter()

  const openProfdraw = () => setshowProf(!showProf)

  useEffect(() => {
    if (user) {
      setUserName(user.Name || "User");
    }
  }, [user]);

  const auth = getAuth(firebaseApp);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      await fetch("/api/logout", { 
        method: "POST",
        credentials: 'same-origin'
      });
      router.push("/Login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  

  return (
    <div className="bg-white w-full text-black h-screen flex md:flex-col flex-col justify-between">
      <div className="md:h-1/2 ">
        <nav className=" bg-white h-1/6 items-center text-center">
          <div className="w-screen flex flex-wrap items-center justify-between  mx-auto pl-6 pr-4 md:pl-10 md:pr-10 pt-4 pb-4">
            <div className=" flex flex-row p-2">
              <Image
                alt="logo"
                src="/craft-logo-new.png"
                width="40"
                height="40"
              ></Image>
              <div className="mt-2 text-xl">
                <h1 className={mont.className}>Craft</h1>
              </div>
            </div>
            <div className="flex flex-row space-x-5 p-2 relative">
            <button className="rounded-full" onClick={openProfdraw}>
        <Image
          alt="profile"
          src="/profile-icon-new.png"
          width="40"
          height="40"
        />
      </button>
      {showProf && (
        <div className="absolute z-50 right-0 top-14 w-48 bg-white rounded-lg shadow-lg border-gray-200">
          <ul className="py-2">
            <li>
              <button 
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
              <a
                href="#_"
                className="flex items-center justify-center px-2 py-1 md:text-base text-xs font-medium leading-6 text-white whitespace-no-wrap bg-black border-2 border-transparent rounded-full shadow-sm hover:bg-transparent hover:text-black hover:border-black focus:outline-none"
              >
                Menu
              </a>
            </div>
          </div>
        </nav>
        <div className="flex md:flex-row flex-col justify-between md:p-10 p-6">
          <div className="md:w-1/2 rounded-lg flex flex-col space-y-5 md:space-y-0 justify-around ">
            <div className="space-y-8">


              <div className="md:text-6xl text-4xl font-semibold">
                Hey, {userName}!
              </div>
              <div className="md:text-md text-sm">
                Bring your ideas to life with adaptability that grows with you.

                Whether it’s organizing simple steps <br />
                or managing complex tasks, you have the tools to make it happen.
                Get started with a template <br />
                or build your own – the power is yours.{" "}
                <div className="font-semibold">Your workflow, Your rules!</div>
              </div>
            </div>
            <button className="md:w-44  w-40 group relative inline-flex md:h-10 h-8 items-center justify-center overflow-hidden rounded-xl bg-white border-2 border-black px-4 text-black duration-500">
              <div className="translate-x-0 opacity-100 text-md transition group-hover:-translate-x-[150%] group-hover:opacity-0">
                Check it out!
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
          <div className="md:w-1/2 rounded-lg relative  md:mt-0 mt-5">
            <Image
              alt="abstract img"
              src="/abstract-img.png"
              className="rounded-xl z-0 object-cover "
              width="1000"
              height="1000"
            />
            <button className="absolute z-10 md:bottom-8 bottom-4 md:left-8 left-4  md:w-2/5 w-2/3   p-2 pl-4 pr-4 md:h-1/6 h-8 text-black shadow-sm items-center rounded-full backdrop-blur-lg bg-white/30   hover:bg-transparent hover:shadow-md flex justify-between">
              {" "}
              <div className="md:text-md text-sm">Create new workflows</div>
             
              <div>
                <GoArrowUpRight className="mt-1" size={16} />
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="md:h-1/2 md:pb-0 pb-4">
        <Tabs />
      </div>
    </div>
  );
};

export default Dashboard;
