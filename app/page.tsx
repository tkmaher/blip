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

          <span><Link href={"/archive"}>Archive</Link> ▪</span>

        </div>
      </div>
      <EmailPoster/>

    </div>
  );
}
