import { useState, useContext } from "react";
import { Form, Button, Modal, Alert } from "react-bootstrap";
import "../../styles/header.css";
import { API, setAuthToken } from "../../config/api";
import { UserContext } from "../../context/userContext";

export default (props) => {
  const [show, setShow] = useState(props.isOpen);
  const handleLoginClose = () => {
    setShow(false);
    props.isClose();
  };

  const handleModalRegister = () => {
    setShow(false);
    props.isClose();
    props.isOpenRegister();
  };

  const [, dispatch] = useContext(UserContext);

  const [message, setMessage] = useState(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnSubmit = async (e) => {
    try {
      e.preventDefault();

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const body = JSON.stringify(form);

      const response = await API.post("/login", body, config);

      if (response.data.status == "success") {
        const alert = (
          <Alert variant="success" className="py-2">
            Success
          </Alert>
        );
        setMessage(alert);

        setAuthToken(response.data.data.user.token);

        setForm({
          email: "",
          password: "",
        });

        setTimeout(() => {
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: response.data.data.user,
          });

          handleLoginClose();
        }, 1000);
      } else {
        const alert = (
          <Alert variant="danger" className="py-2">
            Failed
          </Alert>
        );
        setMessage(alert);
      }
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
    <div>
      <Modal dialogClassName="info-modal" show={show} onHide={handleLoginClose}>
        <Modal.Body>
          <Modal.Title className="form-auth-h">Login</Modal.Title>
          {message && message}
          <Form onSubmit={handleOnSubmit}>
            <Form.Group>
              <Form.Control
                className="form-auth-input"
                type="email"
                name="email"
                onChange={handleOnChange}
                value={form.email}
                id="email"
                placeholder="Email"
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                className="form-auth-input"
                type="password"
                name="password"
                onChange={handleOnChange}
                value={form.password}
                id="password"
                placeholder="Password"
              />
            </Form.Group>
            <Button type="submit" className="form-auth-button">
              Login
            </Button>
          </Form>
          <span
            onClick={handleModalRegister}
            style={{ textDecoration: "none" }}
          >
            <p className="form-auth-p">Don't have an account? Click Here</p>
          </span>
        </Modal.Body>
      </Modal>
    </div>
  );
};
