"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import firebase from "firebase/compat/app";
import "firebase/auth";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import logo from "../../public/craft-logo-new.png";
import { Check, X } from 'lucide-react';
import { addDoc, collection, doc, getFirestore, setDoc } from 'firebase/firestore'
import app from '@/app/firebase'

const mont = Montserrat({
  weight: "700",
  subsets: ["latin"],
});


export default function Signup() {
  const [isLoading, setisLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name,setName] = useState("");
  const [password, setPassword] = useState("");
  const [cpass,setCpass] = useState("");
  const router = useRouter();
  const [docID,setDocID] = useState("");
 
  const passwordMatch =(e:React.ChangeEvent<HTMLInputElement>) => {
    const cpass  = e.target.value;
    setCpass(cpass)
    
  }
  const showValidationIcon = cpass.length > 0
  const isMatch = password === cpass
  const handleClick = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cpass !== password) {
      alert("Passwords don't match");
      return;
    }
    setisLoading(true);
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      const idToken = await userCredential.user.getIdToken();
      console.log("User UID:", uid);
  
      const db = getFirestore(app);
      const userCollectionRef = doc(db, "Users", uid);
      console.log("Firestore Path:", userCollectionRef.path);
  
      const userData = { Name: name };
  
      try {
        await setDoc(userCollectionRef, userData);
        console.log("User document created successfully.");
      } catch (firestoreError) {
        console.error("Error creating user document:", firestoreError);
      }
  
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid, idToken }),
      });
  
      if (response.ok) {
        router.push("/dashBoard");
      } else {
        console.error("Failed to log in");
      }
    } catch (authError) {
      console.error("Error signing in:", authError);
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
      <div className="relative h-full  z-10 flex items-center justify-center">
        <motion.div
          className="w-[200px] sm:w-[500px] md:w-[550px] md:h-[550px] p-8 bg-white/90 rounded-lg shadow-lg flex flex-col items-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full h-full   flex flex-col">
          
            <motion.h1
              className="text-3xl md:text-4xl flex items-start w-full font-semi-bold text-black md:mb-11 mb-8"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Create account
            </motion.h1>
            <motion.form onSubmit={handleClick}>
              <motion.div
                className="w-full flex flex-col space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5, ease: "easeIn" }}
              >
                  <div className="relative w-full">
                  <label>Name*</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    required
                    autoComplete="true"
                    onChange={(e) => setName(e.target.value)}
                    className="peer h-full w-full focus:border-b-2 border-b px-4 focus:px-1 pt-4 pb-1.5 font-sans text-lg font-normal text-grey outline outline-0 transition-all focus:border-violet-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                  />
                  <div className="left-0 bottom-0 w-full h-px bg-violet-300 origin-center scale-x-0 transition-transform duration-300 peer-focus:scale-x-100" />
                  </div>
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
                <div className="relative w-full">
                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={cpass}
                    required
                    autoComplete="autocomplete"
                    onChange={passwordMatch}
                    
                    className="peer h-full w-full focus:border-b-2 px-4 focus:px-1 border-b pt-4 pb-1.5 font-sans text-lg font-normal text-grey outline outline-0 transition-all focus:border-violet-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                  />
                  <div className="left-0 bottom-0 w-full h-px bg-violet-300 origin-center scale-x-0 transition-transform duration-300 peer-focus:scale-x-100" />
                  {showValidationIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isMatch ? (
            <Check className="text-green-500 h-5 w-5" />
          ) : (
            <X className="text-red-500 h-5 w-5" />
          )}
        </div>
      )}

                </div>
              </motion.div>
              <motion.button
                className={`mt-6 md:mt-10 px-4 py-2 w-full relative rounded-lg focus:outline-none ${
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
                  "Create"
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