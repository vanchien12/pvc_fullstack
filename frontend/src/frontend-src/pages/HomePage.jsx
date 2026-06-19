import Header from "../components/Header";
import Banner from "../components/Banner";
import ProductList from "../components/ProductList";
import Footer from "../components/Footer";
import "./HomePage.css";

const HomePage = () => {
  const siteName = "ShopHub";

  return (
    <div className="home-page">
      <Header siteName={siteName} />

      <main className="home-page__main">
        <Banner />
        <ProductList />
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
