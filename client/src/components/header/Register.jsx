// Hook
import { useState } from "react";
// Bootstrap
import { Form, Button, Modal, Alert } from "react-bootstrap";
// Custom CSS
import "../../styles/header.css";
// Sweet alert
import Swal from "sweetalert2";
// Import API
import { API } from "../../config/api";

export default (props) => {
  // register
  const [show, setShow] = useState(props.isOpen);
  const handleRegisterClose = () => {
    setShow(false);
    props.isClose();
  };

  // login
  const handleLoginModal = () => {
    setShow(false);
    props.isClose();
    props.isOpenLogin();
  };

  // message
  const [message, setMessage] = useState(null);

  // data
  const [form, setForm] = useState({
    email: "",
    fullName: "",
    phone: "",
    password: "",
    image: "noname.png",
  });

  // ketika di input
  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ketika tombol submit di tekan
  const handleOnSubmit = async (e) => {
    try {
      e.preventDefault();

      // Config
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // Stringify
      const body = JSON.stringify(form);

      // link config
      const response = await API.post("/register", body, config);

      // jika success
      if (response.data.status == "success") {
        // ketika success
        const alert = (
          <Alert variant="success" className="py-2">
            Success
          </Alert>
        );
        setMessage(alert);

        // kosongkan data
        setForm({
          fullName: "",
          email: "",
          phone: "",
          password: "",
        });

        handleRegisterClose();

        Swal.fire("Good job!", "Registration Success", "success");

        // jika kesalahan inputan
      } else {
        const alert = (
          <Alert variant="danger" className="py-2">
            Failed
          </Alert>
        );
        setMessage(alert);
      }

      // server error
    } catch (error) {
      const alert = (
        <Alert variant="danger" className="py-2">
          Failed
        </Alert>
      );
      setMessage(alert);
      console.log(error);
    }
  };

  return (
    <>
      {/* Modal */}
      <Modal
        dialogClassName="info-modal"
        show={show}
        onHide={handleRegisterClose}
      >
        <Modal.Body>
          <Modal.Title className="form-auth-h">Register</Modal.Title>
          {/* alert */}
          {message && message}
          <Form onSubmit={handleOnSubmit}>
            <Form.Group>
              <Form.Control
                className="form-auth-input"
                onChange={handleOnChange}
                value={form.email}
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="false"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                className="form-auth-input"
                onChange={handleOnChange}
                value={form.fullName}
                type="text"
                name="fullName"
                placeholder="Name"
                autoComplete="false"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                className="form-auth-input"
                onChange={handleOnChange}
                value={form.phone}
                type="number"
                name="phone"
                placeholder="Phone Number"
                autoComplete="false"
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                className="form-auth-input"
                onChange={handleOnChange}
                value={form.password}
                type="password"
                name="password"
                placeholder="Password"
                required
              />
            </Form.Group>
            <Button className="form-auth-button" type="submit">
              Register
            </Button>
          </Form>
          <span onClick={handleLoginModal} style={{ textDecoration: "none" }}>
            <p className="form-auth-p">Already have an account? Click Here</p>
          </span>
        </Modal.Body>
      </Modal>
    </>
  );
};
