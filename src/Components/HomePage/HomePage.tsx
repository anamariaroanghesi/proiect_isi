import Header from "./Header";
import PageContent from "./PageContent";
import "./HomePage.css";
import SideBar from "./SideBar";

function HomePage() {
  return (
    <div className="HomePage">
      <Header />
      <div className="ContentContainer">
        <SideBar />
        <PageContent />
      </div>
    </div>
  );
}

export default HomePage;
