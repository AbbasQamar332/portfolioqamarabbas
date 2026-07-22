import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Qamar Abbas - Digital Marketing | Generative AI | eCommerce",
  description:
    "Motivated BBA graduate skilled in Digital Marketing, Generative AI, eCommerce. Helping businesses grow online.",
  keywords: [
    "Qamar Abbas",
    "Digital Marketing",
    "Generative AI",
    "eCommerce",
    "Portfolio",
    "Gilgit-Baltistan",
  ],
  openGraph: {
    title: "Qamar Abbas - Digital Marketing | Generative AI | eCommerce",
    description:
      "Motivated BBA graduate skilled in Digital Marketing, Generative AI, eCommerce. Helping businesses grow online.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className="min-h-screen bg-white dark:bg-dark-900 transition-colors duration-300">
        <ThemeProvider>
          {children}
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
