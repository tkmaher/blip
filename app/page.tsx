"use client";
import Link from "next/link";
import Info from "@/src/components/info";
import { EmailPoster } from "@/src/components/edit";
import { useState, useRef } from "react";


export default function Home() {
  const [modCount, setModcount] = useState(0);

  const style = {
    transform: `translate(${(1 - Math.abs((modCount % 4) - 2)) * 100}%, 0%)`
  }

  return (
    <>
      <div id="inverting-overlay" style={style}>
        <div></div>
      </div>
    
      <div className="homepage">
      
        <div className="flex-body">
        <Info/>
          <div className="link-flex">
            <span><Link href={"/archive"}>Tickets</Link> ▪</span>
            <span><a target="_blank" href={"mailto:blipppppppppppp@gmail.com"}>Contact</a> ▪</span>

          </div>
        </div>
        

        <div id="footer">
          <div className="flex-body">
            <div className="link-flex">

              <span><a target="_blank" href={"/archive"}>Archive</a> ▪</span>
              <span><a style={{cursor: "pointer"}} onClick={() => setModcount(modCount+1)}>?</a> ▪</span>

            </div>
          </div>
          <EmailPoster admin={false}/>
        </div>

      </div>
    </>
  );
}
