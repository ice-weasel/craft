import Navbar from "@/components/navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { NextApiRequest } from "next";


export async function getServerSideProps(context:any) {
    const { req } = context;
    const sessionCookie = req.cookies['session'];
  
    if (!sessionCookie) {
      // Redirect to login if no session cookie
      return {
        redirect: {
          destination: '/Login',
          permanent: false,
        },
      };
    }
  
    // Pass session data to the page
    return { props: { sessionCookie } };
  }
  

  
const Flowpage =( { sessionCookie } : any ) =>
{
    return(
        <>
           <Navbar/>
           
        </>
    )
}

export default  Flowpage