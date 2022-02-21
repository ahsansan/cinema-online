import { useContext, useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { API } from "../config/api";
import { UserContext } from "../context/userContext";
import { convertToRupiah } from "../components/utils/rupiah";
import Register from "../components/header/Register";
import Login from "../components/header/Login";
import "../styles/home.css";
import Aos from "aos";
import "aos/dist/aos.css";

export default () => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  const [isOpenLogin, setOpenLogin] = useState(false);
  const handleLogin = (datanya) => setOpenLogin(datanya);

  const [isOpenRegister, setOpenRegister] = useState(false);
  const handleRegister = (datanya) => setOpenRegister(datanya);

  const [films, setFilms] = useState([]);

  const router = useNavigate();

  const [{ isLogin }] = useContext(UserContext);

  const getFilms = async () => {
    try {
      const resp = await API.get("/films");

      setFilms(resp.data.data.film);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getFilms();
  }, []);

  const goToDetailPage = (id) => {
    if (isLogin) {
      router(`/film/${id}`);
    } else {
      handleLogin(true);
    }
  };

  const randIndex = Math.floor(Math.random() * films.length);

  return (
    <>
      <div className="container-utama" data-aos="fade-right">
        {films.length && (
          <Container>
            <div
              className="mt-5"
              className="highlight-film"
              style={{
                backgroundImage: `url(http://localhost:5000/uploads/${films[randIndex].tumbnail})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            >
              <h1 className="judul-film-highlight">{films[randIndex].title}</h1>
              <div className="mt-3">
                <p className="kategori-film-highlight">
                  {films[randIndex].category.name}
                </p>
              </div>
              <div className="harga-film-highlight">
                {convertToRupiah(films[randIndex].price)}
              </div>
              <p className="deskripsi-film-highlight">
                {films[randIndex].description}
              </p>
              <p>
                <button
                  className="button-buy-highlight"
                  onClick={() => goToDetailPage(films[randIndex].id)}
                >
                  Buy Now
                </button>
              </p>
            </div>
          </Container>
        )}
      </div>
      <div className="mt-5 container-list-film" data-aos="fade-left">
        <h2 className="mb-4" style={{ color: "white" }}>
          List Film
        </h2>
        <Row>
          {films.map((film) => (
            <Col key={film.id} md={2} className="list-film">
              <img
                className="pointer"
                onClick={() => goToDetailPage(film.id)}
                src={`http://localhost:5000/uploads/${film.tumbnail}`}
                alt={film.title}
                width="180px"
                height="250px"
              />
            </Col>
          ))}
        </Row>
        {isOpenLogin && (
          <Login
            isOpen={isOpenLogin}
            isClose={() => handleLogin(false)}
            isOpenRegister={() => handleRegister(true)}
          />
        )}
        {isOpenRegister && (
          <Register
            isOpen={isOpenRegister}
            isClose={() => handleRegister(false)}
            isOpenLogin={() => handleLogin(true)}
          />
        )}
      </div>
    </>
  );
};
