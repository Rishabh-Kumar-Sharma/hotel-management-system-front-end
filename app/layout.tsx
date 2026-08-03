import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header, Footer } from "./components/";
import { ToastContainer } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import { ReactQueryProvider, StoreProvider } from "./providers";
import AuthInitializer from "./providers/AuthInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hotel Management System",
  description: "A system designed to manage hotel operations efficiently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <StoreProvider>
            <AuthInitializer>
              <ToastContainer />
              <Header />
              {children}
              <Footer />
            </AuthInitializer>
          </StoreProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
