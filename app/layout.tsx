import type { Metadata } from "next";
import "./globals.css";

// Import Dosis and Palanquin fonts
import { Dosis, Palanquin } from "next/font/google";

const dosis = Dosis({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dosis",
});

const palanquin = Palanquin({
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-palanquin",
});

export const metadata: Metadata = {
  title: "Malling Bio",
  icons: {
    icon: "/assets/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="da">
      <body className={`${dosis.variable} ${palanquin.variable} ${palanquin.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}