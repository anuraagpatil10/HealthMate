// pages/_app.jsx

import localFont from "next/font/local";
import "@/styles/globals.css";

const Montserrat = localFont({
  src: "../fonts/Montserrat.woff2",
  variable: "--font-montserrat",
  weight: "100 200 300 400 500 600 700 800 900",
});

export default function App({ Component, pageProps }) {
  return (
    <div className={`${Montserrat.className} antialiased`}>
      <Component {...pageProps} />
    </div>
  );
}
