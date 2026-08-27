import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Buildspace",
  description: "Gamified Learning platform for Developers ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
      >
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>

  );
}
