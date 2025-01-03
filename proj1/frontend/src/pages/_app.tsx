import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "@/app/globals.css"; 
import { AppProps } from "next/app";
import { GlobalProvider } from "@/components/GlobalContext";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <GlobalProvider>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </GlobalProvider>
  );
};

export default MyApp;
