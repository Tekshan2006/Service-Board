import "./globals.css";
import "../styles/LoginModal.css";
import Navbar from "./navbar";

export const metadata = {
  title: "Service Request Board",
  description: "Post and browse home service requests",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
