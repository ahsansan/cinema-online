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
            src={process.env.PUBLIC_URL + "/images/OnlineCinemaIcon.png"}
            alt="Online Cinema"
            height={55}
          />
        </Link>
      </div>
      <div className="header-menu">{isLogin ? <Menu /> : <Auth />}</div>
    </div>
  );
};
