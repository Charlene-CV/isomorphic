import type { Metadata } from "next";
import { inter, lexendDeca } from "@/app/fonts";
import cn from "@utils/class-names";
import NextProgress from "@components/next-progress";
import { ThemeProvider as AppThemeProvider, JotaiProvider } from "@/app/shared/theme-provider";
import GlobalDrawer from "@/app/shared/drawer-views/container";
import GlobalModal from "@/app/shared/modal-views/container";
import { Toaster } from "react-hot-toast";

import "./globals.css";

export const metadata: Metadata = {
  title: "TDS",
  description: "Transportation Delivery System",
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html
      // 💡 Prevent next-themes hydration warning
      suppressHydrationWarning
    >
      <body
        // to prevent any warning that is caused by third party extensions like Grammarly
        suppressHydrationWarning
        className={cn(inter.variable, lexendDeca.variable, "font-inter")}
      >
          <AppThemeProvider>
            <NextProgress />
            <JotaiProvider>
              {children}
              <Toaster position="top-right"/>
              <GlobalDrawer />
              <GlobalModal />
            </JotaiProvider>
          </AppThemeProvider>
      </body>
    </html>
  );
}
