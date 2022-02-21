import { useEffect, useState } from "react";
import { Alert, Form, Modal } from "react-bootstrap";
import { API } from "../config/api";
import "../styles/addfilm.css";
import Aos from "aos";
import "aos/dist/aos.css";

export default (props) => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  const [show, setShow] = useState(props.isOpen);
  const handleAddClose = () => {
    setShow(false);
    props.isClose();
  };

  const [form, setForm] = useState({
    name: "",
  });

  const [status, setStatus] = useState({});

  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnSubmit = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const body = JSON.stringify(form);

      await API.post("/category", body, config);

      setStatus({
        message: "Your category is successfully added",
        error: false,
      });

      setTimeout(() => {
        handleAddClose();
        props.getCategories();
      }, 1500);
    } catch (err) {
      console.log(err);
      setStatus({
        message: "Something went wrong with the server, please try again later",
        error: true,
      });
    }
  };

  return (
    <Modal
      dialogClassName="info-modal"
      show={show}
      onHide={handleAddClose}
      centered
    >
      <Modal.Body>
        <div
          style={{ fontSize: "20px", fontWeight: "900", marginBottom: "10px" }}
        >
          Add Category
        </div>
        {status.message && (
          <Alert variant={status.error ? "danger" : "primary"}>
            {status.message}
          </Alert>
        )}
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleOnSubmit();
          }}
        >
          <div className="d-flex align-items-center">
            <div className="d-flex flex-grow-1 mr-3 flex-column">
              <input
                type="text"
                name="name"
                id="name"
                onChange={onChange}
                value={form.name}
                className="normal-input-addfilm"
                placeholder="Categories Name"
              />
            </div>
          </div>
          <div className="d-flex flex-row-reverse">
            <button className="btn-add-ct" type="submit">
              Add Category
            </button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
