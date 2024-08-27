import dynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";
import GlobalDrawer from "@/app/shared/drawer-views/container";
import GlobalModal from "@/app/shared/modal-views/container";
import { JotaiProvider, ThemeProvider } from "@/app/shared/theme-provider";
import { siteConfig } from "@/config/site.config";
import { inter, lexendDeca } from "@/app/fonts";
import cn from "@utils/class-names";
import { dir } from "i18next";
import { languages } from "../i18n/settings";
import "./globals.css";

const NextProgress = dynamic(() => import("@components/next-progress"), {
  ssr: false,
});

export const metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export async function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: any;
}) {
  return (
    <html
      lang={lang}
      dir={dir(lang)}
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className={cn(inter.variable, lexendDeca.variable, "font-inter")}
      >
        <ThemeProvider>
          <NextProgress />
          <JotaiProvider>
            {children}
            <Toaster />
            <GlobalDrawer />
            <GlobalModal />
          </JotaiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
