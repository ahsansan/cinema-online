import { useContext, useEffect, useState } from "react";
import { Container, Toast } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Purchase from "../components/Purchase";
import { API } from "../config/api";
import { UserContext } from "../context/userContext";
import { convertToRupiah } from "../components/utils/rupiah";
import NotFound from "../components/NotFound";
import "../styles/home.css";

export default () => {
  const [film, setFilm] = useState({});
  const [trans, setTrans] = useState({});
  const [isError, setIsError] = useState(false);
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [show, setShow] = useState(false);

  const [{ user }] = useContext(UserContext);

  const router = useNavigate();
  const { id } = useParams();

  const getFilm = async () => {
    try {
      const resp = await API.get(`/film/${id}`);
      setFilm(resp.data.data.film);
    } catch (err) {
      setIsError(true);
    }
  };

  const getTransaction = async () => {
    try {
      const resp = await API.get(`/transaction/${id}`);
      setTrans(resp.data.data);
    } catch (err) {
      setIsError(true);
    }
  };

  useEffect(() => {
    getFilm();
  }, []);

  useEffect(() => {
    getTransaction();
  }, []);

  const onClickBuy = () => {
    if (user.role === "admin") {
      router(`/edit-film/${id}`);
    } else {
      setIsVisibleModal(true);
    }
  };

  if (isError) {
    return <NotFound />;
  }

  if (!film.title) {
    return <div></div>;
  }

  return (
    <>
      <Container className="mt-5">
        <Toast
          onClose={() => setShow(false)}
          show={show}
          autohide
          delay={3000}
          className="toast-buy-film"
        >
          <Toast.Body className="p-4">
            Please buy this film if you want watch
          </Toast.Body>
        </Toast>
        <div className="d-flex justify-content-between">
          <div>
            <img
              src={`http://localhost:5000/uploads/${film.tumbnail}`}
              alt="thumbnail"
              className="tumbnail-film-detail"
            />
          </div>
          <div>
            <div className="d-flex align-items-center justify-content-between">
              <h1 className="mb-4 judul-film-detail">{film.title}</h1>
              {(trans === "undefined" ||
                trans === "" ||
                trans === null ||
                trans.status === "Pending" ||
                trans.status === "Canceled") && (
                <button className="button-buy-film" onClick={onClickBuy}>
                  {user.role === "admin" ? "Edit Film" : "Buy Now"}
                </button>
              )}
            </div>
            {(trans === "undefined" ||
              trans === "" ||
              trans === null ||
              trans.status === "Pending" ||
              trans.status === "Canceled") && (
              <div onClick={() => setShow(true)} className="overlay" />
            )}
            <iframe
              id={
                trans === "undefined" ||
                trans === "" ||
                trans === null ||
                trans.status === "Pending" ||
                trans.status === "Canceled"
                  ? "overlay"
                  : ""
              }
              width="640"
              height="360"
              src={film.filmUrl}
              title={film.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <div style={{ width: 640, marginTop: "2rem" }}>
              <h4 className="detail-genre">{film.category.name}</h4>
              {(trans === "undefined" ||
                trans === "" ||
                trans === null ||
                trans.status === "Pending" ||
                trans.status === "Canceled") && (
                <p className="detail-harga">{convertToRupiah(film.price)}</p>
              )}
              <p className="detail-desk">{film.description}</p>
            </div>
          </div>
        </div>
      </Container>
      <Purchase
        isVisible={isVisibleModal}
        onHide={() => setIsVisibleModal(false)}
        filmId={film.id}
        title={film.title}
      />
    </>
  );
};
