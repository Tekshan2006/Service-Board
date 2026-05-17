import "./globals.css";

export const metadata = {
  title: "Service Request Board",
  description: "Post and browse home service requests",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <div className="nav-inner">
            <a href="/" className="nav-brand">Service Board</a>
            <a href="/jobs/new" className="btn btn-primary">+ Post a Job</a>
          </div>
        </nav>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
