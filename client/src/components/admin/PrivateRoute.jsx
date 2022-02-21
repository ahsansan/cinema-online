import { Outlet, Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";

export default () => {
  const [{ isLogin }] = useContext(UserContext);

  return isLogin ? <Outlet /> : <Navigate to="/" />;
};
