import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import React from "react";

export const metadata = {
  title: "Veed.io",
  description: "Editor page",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}
