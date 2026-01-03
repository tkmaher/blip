"use client";
import Image from "next/image";
import { useEffect } from "react";
import Info from "@/src/components/info";

export default function Home() {

  useEffect(() => {
    document.body.style.filter = "blur(0px)";
  }, []);

  return (
    <div className="flex-body">
      <Info/>
    </div>
  );
}
