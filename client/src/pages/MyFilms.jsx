import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { API } from "../config/api";
import NotFound from "../components/NotFound";
import "../styles/home.css";
import Aos from "aos";
import "aos/dist/aos.css";

export default () => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  const [myFilm, setMyFilm] = useState([]);
  const [isError, setIsError] = useState(false);

  const router = useNavigate();

  const getMyFilms = async () => {
    try {
      const resp = await API.get(`/my-list`);
      setMyFilm(resp.data.data);
    } catch (err) {
      setIsError(true);
    }
  };

  useEffect(() => {
    getMyFilms();
  }, []);

  if (isError) {
    return <NotFound />;
  }

  return (
    <Container
      className="mt-5"
      data-aos="fade-up"
      style={{ minHeight: "71vh" }}
    >
      <h1 className="mb-4 ms-4 judul-my-film">My List Film</h1>
      {myFilm.length > 0 ? (
        <Row>
          {myFilm.map((film) => (
            <Col md={2} className="mb-6" key={film.idFilm}>
              <img
                className="my-film-list"
                onClick={() => router(`/film/${film.idFilm}`)}
                src={`${film.film.tumbnail}`}
                alt={film.film.title}
                width="180px"
                height="250px"
              />
            </Col>
          ))}
        </Row>
      ) : (
        <div>
          <p className="ms-4">you don't have a collection</p>
        </div>
      )}
    </Container>
  );
};
