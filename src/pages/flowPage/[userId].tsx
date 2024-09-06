import Navbar from "@/components/navbar";
import { useState } from "react";

export default function Flowpage()
{
    const [userId,setuserId] = useState(false)
    return(
        <>
           <Navbar/>
            <div className="">
                    <p>this is the {userId}</p>    
            </div>
        </>
    )
}