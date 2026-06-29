const express = require("express");
const router = express.Router();

const {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
} = require("../controllers/contactController");

// ==========================================
// PUBLIC ROUTE
// ==========================================

// Submit Contact Form
router.post("/", createContact);

// ==========================================
// ADMIN ROUTES
// ==========================================

// Get All Contact Enquiries
router.get("/", getAllContacts);

// Get Single Contact Enquiry
router.get("/:id", getContactById);

// Update Contact Status
router.put("/:id", updateContactStatus);

// Delete Contact Enquiry
router.delete("/:id", deleteContact);

module.exports = router;