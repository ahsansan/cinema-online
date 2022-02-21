import { Routes, Route } from "react-router-dom";
import { API, setAuthToken } from "../src/config/api";
import { useEffect, useContext } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { UserContext } from "./context/userContext";

import PrivateRoute from "./components/admin/PrivateRoute";
import AdminRoute from "./components/admin/AdminRoute";
import Header from "./components/header/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import DetailFilm from "./pages/DetailFilm";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import MyFilms from "./pages/MyFilms";
import AddFilm from "./pages/AddFilm";
import EditFilm from "./pages/EditFilm";
import Transactions from "./pages/Transactions";
import AllFilms from "./pages/AllFilms";
import Categories from "./pages/Categories";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

export default () => {
  const [, dispatch] = useContext(UserContext);
  const checkUser = async () => {
    try {
      const response = await API.get("/check-auth");

      if (response.status === 404) {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }

      let payload = response.data.data.user;
      payload.token = localStorage.token;

      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <>
      <Header />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route element={<PrivateRoute />}>
          <Route exact path="/film/:id" element={<DetailFilm />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/edit-profile" element={<EditProfile />} />
          <Route exact path="/my-film" element={<MyFilms />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route exact path="/add-film" element={<AddFilm />} />
          <Route exact path="/transactions" element={<Transactions />} />
          <Route exact path="/edit-film/:id" element={<EditFilm />} />
          <Route exact path="/films" element={<AllFilms />} />
          <Route exact path="/categories" element={<Categories />} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
};
