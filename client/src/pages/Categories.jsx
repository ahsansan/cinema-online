import { useEffect, useState } from "react";
import { Table, Container } from "react-bootstrap";
import { API } from "../config/api";
import DeleteCategories from "../components/DeleteCategories";
import AddCategory from "../components/AddCategory";
import NotFound from "../components/NotFound";
import "../styles/transaction.css";
import Aos from "aos";
import "aos/dist/aos.css";

export default () => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  const [categories, setCategories] = useState([]);

  const [isError, setIsError] = useState(false);
  const [idDelete, setIdDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [isOpenAdd, setOpenAdd] = useState(false);
  const handleAdd = (datanya) => setOpenAdd(datanya);

  const getCategories = async () => {
    try {
      const resp = await API.get(`/categories`);
      setCategories(resp.data.data);
    } catch (err) {
      console.log(err);
      setIsError(true);
    }
  };

  useEffect(() => {
    getCategories();
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
      await API.delete(`/category/${id}`);
      getCategories();
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
      <h1 className="mb-4 judul-transaksi">All Categories</h1>
      <button className="add-category" onClick={() => handleAdd(true)}>
        Add Category
      </button>
      <Table className="table table-striped table-dark table-hover">
        <thead>
          <tr style={{ color: "red" }}>
            <th>No</th>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((ct, index) => (
            <tr key={ct.id}>
              <td>{index + 1}</td>
              <td>{ct.name}</td>
              <td>
                <button
                  onClick={() => {
                    handleDelete(ct.id);
                  }}
                  className="delete-category"
                >
                  Delete Category
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        {isOpenAdd && (
          <AddCategory
            isOpen={isOpenAdd}
            isClose={() => handleAdd(false)}
            getCategories={getCategories}
          />
        )}
        <DeleteCategories
          setConfirmDelete={setConfirmDelete}
          show={show}
          handleClose={handleClose}
        />
      </Table>
    </Container>
  );
};
