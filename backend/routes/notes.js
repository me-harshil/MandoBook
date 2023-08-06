const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const fetchuser = require("../middleware/fetchuser");
const { validationResult, body } = require("express-validator");

// Route 1 - Get all notes of a user using: GET "/api/notes/fetchallnotes". Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  const notes = await Notes.find({ user: req.user.id });
  return res.json(notes);
});

// Route 2 - Add a new note using: POST "/api/notes/addnote". Login required

router.post(
  "/addnote",
  fetchuser,
  [
    // Check if title is not empty
    body("title", "Enter a valid title").isLength({ min: 3 }),
  ],
  async (req, res) => {
    try {
      const validNote = validationResult(req);
      if (!validNote.isEmpty()) {
        return res.status(400).json({ errors: validNote.array() });
      }
      const { title, description, tag } = req.body;
      // console.log(title);
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      return res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Internal Server Error");
    }
  }
);

// Route 3 - Update an existing note using: PUT "/api/notes/updatenote". Login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    // Create a newNote object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }
    // Find the note to be updated and update it
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }
    console.log(note.user, req.user);
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    return res.json({ note });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Internal Server Error");
  }
});

// Route 4 - Delete an existing note using: DELETE "/api/notes/deletenote". Login required`
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    // Find the note to be deleted and delete it
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }
    // Allow deletion only if user owns this Note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Notes.findByIdAndDelete(req.params.id);
    return res.json({ Success: "Note has been deleted", note: note });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
