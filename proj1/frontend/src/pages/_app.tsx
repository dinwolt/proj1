import Navbar from "@/components/Navbar";
import "@/app/globals.css"; 
import { AppProps } from "next/app";
import Footer from "@/components/Footer";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
      <Footer/>
    </>
  );
};

export default MyApp;
