import "./globals.css";

import Provider from "@/providers/provider";

export const metadata = {
  title: "Tutorium",
  description: "Find the perfect tutor.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}