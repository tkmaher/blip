"use client";
import Link from "next/link";
import Info from "@/src/components/info";
import { EmailPoster } from "@/src/components/edit";
import { useState, useRef } from "react";
import Archive from "@/app/archive/archive";


export default function Home() {
  const [modOn, setModOn] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);

  const style = {
    //transform: `translate(${(1 - Math.abs((modCount % 4) - 2)) * 100}%, 0%)`
  }

  const archiveStyle = {
    display: archiveOpen ? "block" : "none",
    opacity: archiveOpen ? 1 : 0,
  }

  return (
    <>
      <div id="inverting-overlay" style={style}>
        <div></div>
      </div>
    
      <div className="homepage">
      
        <div className="flex-body">

          <Info modOn={modOn}/>

          <div className="link-flex">
            
            <EmailPoster admin={false}/>

          </div>

        </div>

      </div>

      <div className="footer">

        <span><a onClick={() => setArchiveOpen(!archiveOpen)}>Archive</a></span>
        <span><a target="_blank" href={"mailto:blipppppppppppp@gmail.com"}>Contact</a></span>
        {/*<span><a style={{cursor: "pointer"}} onClick={() => setModcount(modCount+1)}>?</a></span>*/}
        <span><a style={{cursor: "pointer"}} onClick={() => setModOn(!modOn)}>?</a></span>

      </div>
      
      <Archive style={archiveStyle}/>
    </>
  );
}
