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
app.get("/mail-test", async (req, res) => {
  try {
    const sendEmail = require("./utils/sendEmail");

    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "Test Mail",
      html: "<h1>Mail Working</h1>",
    });

    res.send("Mail Sent");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});
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