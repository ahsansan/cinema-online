const express = require("express");

const router = express.Router();

// Controller
const { register, login, authUser } = require("../controllers/auth");
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");
const {
  getFilms,
  getFilm,
  addFilm,
  updateFilm,
  deleteFilm,
} = require("../controllers/film");
const {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");
const {
  addTransaction,
  getTransactions,
  getTransactionList,
  getTransactionById,
  myList,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transaction");

// Middleware
const { auth } = require("../middlewares/auth");
const { admin } = require("../middlewares/admin");
const { uploadFile } = require("../middlewares/uploadFile");

// Route User
// Auth
router.post("/register", register);
router.post("/login", login);
router.get("/check-auth", auth, authUser);
// User
router.get("/user/:id", auth, getUser);
router.patch("/user/:id", auth, uploadFile("image"), updateUser);
// Film
router.get("/films", getFilms);
router.get("/film/:id", getFilm);
// Transaction
router.post(
  "/transaction/:id",
  auth,
  uploadFile("transferProof"),
  addTransaction
);
router.get("/transaction-list", auth, getTransactionList);
router.get("/transaction/:id", auth, getTransactionById);
router.get("/my-list", auth, myList);

// Route Admin
// Film
router.post("/film", admin, uploadFile("tumbnail"), addFilm);
router.patch("/film/:id", admin, uploadFile("tumbnail"), updateFilm);
router.delete("/film/:id", admin, deleteFilm);
// User
router.get("/users", admin, getUsers);
router.delete("/user/:id", admin, deleteUser);
// Transaction
router.get("/transactions", admin, getTransactions);
router.patch("/transaction/:id", admin, updateTransaction);
router.delete("/transaction/:id", admin, deleteTransaction);
// Category
router.get("/categories", admin, getCategories);
router.post("/category", admin, addCategory);
router.patch("/category/:id", admin, updateCategory);
router.delete("/category/:id", admin, deleteCategory);

module.exports = router;
