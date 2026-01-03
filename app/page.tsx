import Link from "next/link";
import Info from "@/src/components/info";
import { EmailPoster } from "@/src/components/edit";


export default function Home() {
  

  return (
    <div>
      <div className="flex-body">
        <Info/>
        <div className="link-flex">
          <Link href={"/archive"}>Tickets</Link>

          <Link href={"/archive"}>Archive</Link>

        </div>
      </div>
      <EmailPoster/>

    </div>
  );
}
