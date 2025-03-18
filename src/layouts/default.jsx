import Header from "../Components/layouts/Header";
import Footer from "../Components/layouts/Footer";

const DefaultLayout = ({ children }) => {
  
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header/>
          <main className="container mt-5" style={{ width: "100%" }}>
            {children}
          </main>
        <Footer />
      </div>
    </>
  );
};

export default DefaultLayout;