// Import CSS
import "../styles/addfilm.css";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import Swal from "sweetalert2";
import Aos from "aos";
import "aos/dist/aos.css";
import { UserContext } from "../context/userContext";
import { API } from "../config/api";

export default () => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  const [state, dispatch] = useContext(UserContext);

  const router = useNavigate();

  const [form, setForm] = useState({
    image: "",
    fullName: "",
    phone: "",
    email: "",
  });

  const [preview, setPreview] = useState("");

  const { image, fullName, email, phone } = form;

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });

    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  };

  const handleOnSubmit = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };

      const formData = new FormData();
      formData.set("image", form.image[0], form.image[0].name);
      formData.set("fullName", form.fullName);
      formData.set("email", form.email);
      formData.set("phone", form.phone);

      await API.patch(`/user/${state.user.id}`, formData, config);

      const response = await API.get("/check-auth");

      Swal.fire("Good job!", "Update Success", "success");

      let payload = response.data.data.user;
      payload.token = localStorage.token;

      dispatch({
        type: "USER_SUCCESS",
        payload,
      });

      router("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async () => {
    try {
      const response = await API.get(`user/${state.user.id}`);
      const user = response.data.data.user;

      setForm({
        image: `${user.image}`,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, [state.user.id]);

  return (
    <Container className="mt-5" data-aos="fade-up">
      <h1 className="mb-4 judul-add-film">Edit Profile</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleOnSubmit();
        }}
      >
        <div className="preview-film">
          {preview ? (
            <img src={preview} className="img-fluid rounded" width="30%" />
          ) : (
            <img src={image} className="img-fluid rounded" width="30%" />
          )}
        </div>
        <div>
          <label htmlFor="input-photo" className="tombol-add-pp">
            <p>Upload Profile Pitcure</p>
          </label>
          <input
            type="file"
            id="input-photo"
            onChange={handleOnChange}
            name="image"
            hidden
          />
        </div>
        <div>
          <input
            type="text"
            name="fullName"
            id="fullName"
            onChange={handleOnChange}
            value={fullName}
            className="normal-input-addfilm"
            placeholder="Name"
          />
        </div>
        <div>
          <input
            type="text"
            name="email"
            id="email"
            onChange={handleOnChange}
            value={email}
            className="normal-input-addfilm"
            placeholder="email"
          />
        </div>
        <div>
          <input
            type="number"
            name="phone"
            id="phone"
            placeholder="Phone"
            className="normal-input-addfilm"
            onChange={handleOnChange}
            value={phone}
          />
        </div>
        <div className="save-button-container">
          <button type="submit" className="btn-add-film">
            Save Profile
          </button>
        </div>
      </form>
    </Container>
  );
};
