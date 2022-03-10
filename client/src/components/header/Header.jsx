import { useContext } from "react";
import "../../styles/header.css";
import Auth from "./Auth";
import Menu from "./Menu";
import { UserContext } from "../../context/userContext";
import { Link } from "react-router-dom";

export default () => {
  const [{ isLogin }] = useContext(UserContext);

  return (
    <div className="header-container">
      <div className="header-logo">
        <Link to="/">
          <img
            src="/images/OnlineCinemaIcon.png"
            alt="Online Cinema"
            className="logo-image"
          />
        </Link>
      </div>
      <div className="header-menu">{isLogin ? <Menu /> : <Auth />}</div>
    </div>
  );
};
