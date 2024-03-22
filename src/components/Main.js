import Script from "next/script";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

const Main = ({ children }) => (
  <main
    className={`p-4 md:py-8 md:px-4 xl:p-12 ${inter.className} min-h-screen bg-slate-200`}
  >
    <Script src="https://www.googletagmanager.com/gtag/js?id=G-HCMGB8T4Q3" />
    <Script id="google-analytics">
      {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-HCMGB8T4Q3');
        `}
    </Script>

    {children}
  </main>
);

export default Main;
