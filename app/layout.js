import "./globals.css";

export const metadata = {
  title: "ArkadaşBul - Yeni arkadaşlıklar keşfet",
  description:
    "Ortak ilgi alanlarına sahip insanları keşfet ve yeni arkadaşlıklar kur."
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}