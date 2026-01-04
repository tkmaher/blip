import Link from "next/link";
import Info from "@/src/components/info";
import { EmailPoster } from "@/src/components/edit";


export default function Home() {
  

  return (
    <div>
      <div className="flex-body">
      <Info/>
        <div className="link-flex">
          <span><Link href={"/archive"}>Tickets</Link> ▪</span>
          <span><a target="_blank" href={"mailto:blipppppppppppp@gmail.com"}>Contact</a> ▪</span>

        </div>
      </div>
      <div id="bronze">
        <img src="/temp.png"/>
      </div>
      <div className="flex-body">
        <div className="link-flex">

          <span><a target="_blank" href={"/archive"}>Archive</a> ▪</span>

        </div>
      </div>
      <EmailPoster admin={false}/>

    </div>
  );
}
