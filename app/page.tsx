"use client";
import Link from "next/link";
import Info from "@/src/components/info";
import { EmailPoster } from "@/src/components/edit";
import { useState, useRef } from "react";
import Archive from "@/app/archive/archive";


export default function Home() {
  const [modCount, setModcount] = useState(0);
  const [archiveOpen, setArchiveOpen] = useState(false);

  const style = {
    transform: `translate(${(1 - Math.abs((modCount % 4) - 2)) * 100}%, 0%)`
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

      <div id="footer">
        <div className="flex-body" style={{marginTop: "98vh", marginLeft: "98vw"}}>
          <div className="link-flex" style={{position: "fixed", transform: "translate(-100%, -100%"}}>

            <span><a target="_blank" href={"mailto:blipppppppppppp@gmail.com"}>Contact</a></span>
            <span><a onClick={() => setArchiveOpen(!archiveOpen)}>Archive</a></span>
            <span><a style={{cursor: "pointer"}} onClick={() => setModcount(modCount+1)}>?</a></span>

          </div>
        </div>
      </div>

    
      <div className="homepage">
      
        <div className="flex-body">
          <Info/>
          

          <div className="link-flex">
            
            <EmailPoster admin={false}/>

          </div>
        </div>
       
        

      </div>
      
      <Archive style={archiveStyle}/>
    </>
  );
}
