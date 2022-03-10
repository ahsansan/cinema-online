import { useContext, useEffect, useState } from "react";
import { Card, Container } from "react-bootstrap";
import { API } from "../config/api";
import { useNavigate } from "react-router-dom";
import { convertToRupiah } from "../components/utils/rupiah";
import { getFullTime } from "../components/utils/date";
import NotFound from "../components/NotFound";
import { UserContext } from "../context/userContext";
import "../styles/profile.css";
import Aos from "aos";
import "aos/dist/aos.css";

export default () => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  const [profile, setProfile] = useState({});
  const [isError, setIsError] = useState(false);
  const [trans, setTrans] = useState([]);

  const [{ user }] = useContext(UserContext);

  const router = useNavigate();

  const idUser = user.id;

  const getUser = async () => {
    try {
      const resp = await API.get(`/user/${idUser}`);
      setProfile(resp.data.data.user);
    } catch (err) {
      setIsError(true);
    }
  };

  const getTrans = async () => {
    try {
      const resp = await API.get(`/transaction-list`);
      setTrans(resp.data.data);
    } catch (err) {
      setIsError(true);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getTrans();
  }, []);

  if (isError) {
    return <NotFound />;
  }

  return (
    <Container className="mt-5" style={{ minHeight: "71vh" }}>
      <div className="container-profile-utama">
        <div className="mb-5" data-aos="fade-right">
          <h1 className="mb-4 my-profile">My Profile</h1>
          <div className="d-flex justify-content-between align-item-center">
            <div className="d-flex flex-column justify-content-between">
              <img
                src={`${profile.image}`}
                alt="profile-pic"
                className="image-profile"
                width="180px"
                height="221.79px"
              />
              <button
                className="tombol-edit-profile"
                onClick={() => router("/edit-profile")}
              >
                Edit Profile
              </button>
            </div>
            <div className="d-flex flex-column ml-4 justify-content-between">
              <div>
                <h5 className="judul-title">Full Name</h5>
                <p className="isi-profile">{profile.fullName}</p>
              </div>
              <div>
                <h5 className="judul-title">Email</h5>
                <p className="isi-profile">{profile.email}</p>
              </div>
              <div>
                <h5 className="judul-title">Phone</h5>
                <p className="isi-profile">{profile.phone || "-"}</p>
              </div>
            </div>
          </div>
        </div>
        {trans.length > 0 ? (
          <div data-aos="fade-left">
            <h1 className="mb-4 my-profile">History Transaction</h1>
            {trans.map((film) => (
              <Card
                key={film.idFilm}
                style={{
                  width: "350px",
                  height: "auto",
                  marginBottom: "1rem",
                  backgroundColor: "#CD2E7170",
                }}
              >
                <Card.Body className="card-profile">
                  <div className="d-flex flex-column justify-content-between">
                    <b className="judul-film-order">{film.film.title}</b>
                    <i className="tanggal-order-film">
                      {getFullTime(film.createdAt)}
                    </i>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="profile-harga-film">
                        Total: {convertToRupiah(film.film.price)}
                      </div>
                      <div className="alert-container">
                        <div
                          className={
                            film.status === "Approved"
                              ? "profile-status-film"
                              : film.status === "Pending"
                              ? "profile-status-pending"
                              : "profile-status-reject"
                          }
                        >
                          {film.status === "Approved"
                            ? "Finished"
                            : film.status === "Pending"
                            ? "Pending"
                            : "Rejected"}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        ) : (
          <div data-aos="fade-left">
            <h1 className="mb-4 my-profile">History Transaction</h1>
            <p>you don't have a transaction</p>
          </div>
        )}
      </div>
    </Container>
  );
};
