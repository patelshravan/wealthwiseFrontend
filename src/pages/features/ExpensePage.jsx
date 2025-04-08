import React, { useEffect, useState } from "react";
import { Card, Table, Button, Form, Modal, Spinner } from "react-bootstrap";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../../services/expense.service";

const ExpensePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: "",
    amount: "",
    note: "",
    image: null,
    date: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const itemsPerPage = 5;

  // State for enlarged image
  const [showEnlargedImage, setShowEnlargedImage] = useState(false);
  const [enlargedImageUrl, setEnlargedImageUrl] = useState("");

  const fetchExpenses = async (token, search = "", page = 1, limit = 5) => {
    setLoading(true);
    try {
      const res = await getExpenses(token, search, page, limit);
      setExpenses(res.data);
      setTotalPages(res.pages);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
      toast.error("Failed to fetch expenses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    const debouncedFetch = debounce(() => {
      fetchExpenses(token, searchTerm, currentPage, itemsPerPage);
    }, 500); // 500ms debounce

    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [searchTerm, currentPage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewExpense((prev) => ({
        ...prev,
        image: file,
      }));

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleAddOrUpdateExpense = async () => {
    if (!newExpense.category.trim() || !newExpense.amount) {
      toast.error("Please fill out the category, and amount fields.");
      return;
    }
    const token = localStorage.getItem("token");
    const formData = new FormData();

    // Append all fields to FormData
    Object.keys(newExpense).forEach((key) => {
      if (key === "image" && newExpense[key] instanceof File) {
        formData.append("image", newExpense[key]); // Append file
      } else if (newExpense[key] !== undefined && newExpense[key] !== null) {
        formData.append(key, newExpense[key]); // Append other fields
      }
    });

    setSubmitLoading(true);
    try {
      if (editMode && selectedExpense) {
        const res = await updateExpense(selectedExpense._id, formData, token);
        toast.success(res.message);
        setExpenses((prev) =>
          prev.map((exp) => (exp._id === selectedExpense._id ? res.data : exp))
        );
      } else {
        const res = await createExpense(formData, token);
        toast.success(res.message);
        setExpenses((prev) => [...prev, res.data]);
      }

      setShowModal(false);
      setNewExpense({
        category: "",
        amount: "",
        note: "",
        image: null, // Reset image field
      });
      setEditMode(false);
      setSelectedExpense(null);
      setImagePreview(null);
    } catch (err) {
      console.error("Failed to save expense:", err);
      toast.error("Failed to save expense");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (expense) => {
    setEditMode(true);
    setSelectedExpense(expense);

    const formattedDate = expense.date
      ? new Date(expense.date).toISOString().split("T")[0]
      : "";

    setNewExpense({
      category: expense.category,
      amount: expense.amount,
      note: expense.note,
      date: formattedDate,
      image: null,
    });

    setImagePreview(expense.image);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the expense.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteExpense(id, token);
        toast.success(res.message);
        setExpenses((prev) => prev.filter((exp) => exp._id !== id));
      } catch (err) {
        console.error("Delete failed:", err);
        toast.error("Failed to delete expense");
      }
    }
  };

  // Handler to show enlarged image
  const handleImageClick = (imageUrl) => {
    setEnlargedImageUrl(imageUrl);
    setShowEnlargedImage(true);
  };

  // Handler to close enlarged image
  const handleCloseEnlargedImage = () => {
    setShowEnlargedImage(false);
    setEnlargedImageUrl("");
  };

  return (
    <>
      <Card className="p-4 shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Expenses</h4>
          <Form.Control
            type="text"
            placeholder="Search by category or note"
            className="w-50 w-md-75"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            onClick={() => {
              setEditMode(false);
              setSelectedExpense(null);
              setNewExpense({
                category: "",
                amount: "",
                note: "",
                date: "",
                image: null,
              });
              setImagePreview(null);
              setShowModal(true);
            }}
          >
            <FaPlus className="me-2" /> Add Expense
          </Button>
        </div>
      </Card>

      <Card className="p-3 shadow-sm">
        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : expenses.length === 0 ? (
          <p className="text-muted text-center">No expenses added yet.</p>
        ) : (
          <Table responsive hover bordered className="mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Note</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp, index) => (
                <tr key={exp._id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{new Date(exp.date).toDateString()}</td>
                  <td>{exp.category}</td>
                  <td>₹ {exp.amount}</td>
                  <td>{exp.note}</td>
                  <td>
                    {exp.image ? (
                      <img
                        src={exp.image}
                        alt="Expense"
                        style={{
                          width: "50px",
                          height: "50px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleImageClick(exp.image)}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(exp)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(exp._id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <div className="d-flex justify-content-end mt-3 align-items-center gap-2">
          <Button
            variant="outline-secondary"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline-secondary"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit Expense" : "Add Expense"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                Category <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={newExpense.category}
                onChange={handleChange}
                placeholder="e.g., Food, Travel"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Amount (₹) <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={newExpense.amount}
                onChange={handleChange}
                placeholder="Enter amount"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={newExpense.date}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Note</Form.Label>
              <Form.Control
                as="textarea"
                name="note"
                value={newExpense.note}
                onChange={handleChange}
                rows={2}
                placeholder="Optional note"
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleFileChange}
              />

              {imagePreview && (
                <div className="mt-2 text-center">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      borderRadius: "5px",
                    }}
                  />
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddOrUpdateExpense} disabled={submitLoading}>
            {submitLoading && (
              <Spinner
                animation="border"
                role="status"
                size="sm"
                className="me-2"
              >
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            )}
            {editMode ? "Update" : "Add"} Expense
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for enlarged image */}
      <Modal
        show={showEnlargedImage}
        onHide={handleCloseEnlargedImage}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Enlarged Image</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            src={enlargedImageUrl}
            alt="Enlarged Expense"
            style={{ maxWidth: "100%", maxHeight: "80vh" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEnlargedImage}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ExpensePage;
