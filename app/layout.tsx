import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "blipppppppppppppp",
  description: "By otherseas1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body style={{opacity: "0"}}>
        {children}
      </body>
    </html>
  );
}
