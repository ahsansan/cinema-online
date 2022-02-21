import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";

export default () => {
  const [{ isLogin, user }] = useContext(UserContext);

  return isLogin && user.role === "admin" ? <Outlet /> : <Navigate to="/" />;
};
