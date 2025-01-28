import "./globals.css";
export const metadata = {
  title: "Inventory management",
  description: "manage your inventory and your orders",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

