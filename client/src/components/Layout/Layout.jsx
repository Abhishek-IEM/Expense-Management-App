import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="container flex-grow-1 mt-4">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
