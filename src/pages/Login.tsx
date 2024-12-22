"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import firebase from "firebase/compat/app";
import "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../app/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import logo from "../../public/craft-logo-new.png";

const mont = Montserrat({
  weight: "700",
  subsets: ["latin"],
});

export default function Login() {
  const [isLoading, setisLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setisLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      if (response.ok) {
        router.push("/dashBoard");
      } else {
        console.error("Failed to log in");
      }
    } catch (error) {
      console.error("Error signing in", error);
    } finally {
      setisLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-screen">
      {/* Background pattern layer */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${logo.src})`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px",
          backgroundPosition: "center",
          opacity: 0.1
        }}
      />
      
      {/* Content layer */}
      <div className="relative h-full z-10 flex justify-center items-center">
        <motion.div
          className="w-[200px] sm:w-[500px] md:w-[550px] md:h-[550px] p-8 bg-white/90 rounded-lg shadow-lg flex flex-col justify-center items-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full h-full  flex flex-col">
          
            <motion.h1
              className="text-3xl md:text-5xl md:pt-20 flex items-start w-full font-semi-bold text-black md:mb-11 mb-8"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Login
            </motion.h1>
            <motion.form onSubmit={handleClick}>
              <motion.div
                className="w-full flex flex-col space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5, ease: "easeIn" }}
              >
                <div className="relative w-full">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    required
                    autoComplete="true"
                    onChange={(e) => setEmail(e.target.value)}
                    className="peer h-full w-full focus:border-b-2 border-b px-4 focus:px-1 pt-4 pb-1.5 font-sans text-lg font-normal text-grey outline outline-0 transition-all focus:border-violet-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                  />
                  <div className="left-0 bottom-0 w-full h-px bg-violet-300 origin-center scale-x-0 transition-transform duration-300 peer-focus:scale-x-100" />
                </div>
                <div className="relative w-full">
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    required
                    autoComplete="autocomplete"
                    onChange={(e) => setPassword(e.target.value)}
                    className="peer h-full w-full focus:border-b-2 px-4 focus:px-1 border-b pt-4 pb-1.5 font-sans text-lg font-normal text-grey outline outline-0 transition-all focus:border-violet-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                  />
                  <div className="left-0 bottom-0 w-full h-px bg-violet-300 origin-center scale-x-0 transition-transform duration-300 peer-focus:scale-x-100" />
                </div>
              </motion.div>
              <motion.button
                className={`mt-6 px-4 py-2 w-full relative rounded-lg focus:outline-none ${
                  isLoading
                    ? "bg-violet-300"
                    : "bg-gray-300 hover:bg-violet-300 text-black"
                }`}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    className="absolute top-0 left-0 h-full rounded-lg bg-violet-200"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3 }}
                  />
                ) : (
                  "Login"
                )}
                <span className="relative z-10">{isLoading ? "Loading..." : ""}</span>
              </motion.button>
            </motion.form>
          </div>
          <p className={mont.className}>All rights reserved © 2024</p>
        </motion.div>
      </div>
    </div>
  );
}