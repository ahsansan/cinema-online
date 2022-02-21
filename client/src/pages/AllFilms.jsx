import { useEffect, useState } from "react";
import { Table, Container, DropdownButton, Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { API } from "../config/api";
import DeleteFilm from "../components/DeleteFilm";
import NotFound from "../components/NotFound";
import "../styles/transaction.css";
import Aos from "aos";
import "aos/dist/aos.css";

export default () => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  const router = useNavigate();

  const goTo = (path) => {
    router(path);
  };

  const [films, setFilms] = useState([]);
  const [isError, setIsError] = useState(false);
  const [idDelete, setIdDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getFilms = async () => {
    try {
      const resp = await API.get(`/films`);
      setFilms(resp.data.data.film);
    } catch (err) {
      console.log(err);
      setIsError(true);
    }
  };

  useEffect(() => {
    getFilms();
  }, []);

  if (isError) {
    return <NotFound />;
  }

  const handleDelete = (id) => {
    setIdDelete(id);
    handleShow();
  };

  const deleteById = async (id) => {
    try {
      await API.delete(`/film/${id}`);
      getFilms();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (confirmDelete) {
      handleClose();
      deleteById(idDelete);
      setConfirmDelete(null);
    }
  }, [confirmDelete]);

  return (
    <Container
      className="mt-5"
      data-aos="fade-up"
      style={{ minHeight: "71vh" }}
    >
      <h1 className="mb-4 judul-transaksi">All Films</h1>
      <Table className="table table-striped table-dark table-hover">
        <thead>
          <tr style={{ color: "red" }}>
            <th>No</th>
            <th>Title</th>
            <th>Tumbnail</th>
            <th>Category</th>
            <th>Synopsis</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {films.map((film, index) => (
            <tr key={film.id}>
              <td>{index + 1}</td>
              <td>{film.title}</td>
              <td>
                <img
                  src={`http://localhost:5000/uploads/${film.tumbnail}`}
                  alt="tumbnail"
                  width={200}
                />
              </td>
              <td>{film.category.name}</td>
              <td>{film.description}</td>
              <td>
                <DropdownButton
                  id="dropdown-button"
                  bsPrefix="btn-action-menu"
                  title=""
                >
                  <Dropdown.Item
                    className="action-container"
                    style={{ color: "green" }}
                    onClick={() => goTo(`/edit-film/${film.id}`)}
                  >
                    Edit Film
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      handleDelete(film.id);
                    }}
                    className="action-container"
                    style={{ color: "red" }}
                  >
                    Delete Film
                  </Dropdown.Item>
                </DropdownButton>
              </td>
            </tr>
          ))}
        </tbody>
        <DeleteFilm
          setConfirmDelete={setConfirmDelete}
          show={show}
          handleClose={handleClose}
        />
      </Table>
    </Container>
  );
};
