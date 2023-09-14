import React, { useContext, useState } from "react";
import noteContext from "../context/notes/noteContext";

export default function Addnote(props) {
  const { addNote } = useContext(noteContext);

  const [note, setnote] = useState({
    title: "",
    description: "",
    tag: "",
  });

  const handleClick = (e) => {
    e.preventDefault();
    addNote(note.title, note.description, note.tag);
    setnote({ title: "", description: "", tag: "" });
    props.showAlert("Note Added Successfully", "success");
  };

  const onChange = (e) => {
    setnote({
      ...note,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container">
      <h2 className="my-3">Add Note</h2>
      <form className="my-3">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            onChange={onChange}
            value={note.title}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <input
            type="text"
            className="form-control"
            id="description"
            name="description"
            onChange={onChange}
            value={note.description}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="tag" className="form-label">
            Tag
          </label>
          <input
            type="text"
            className="form-control"
            id="tag"
            name="tag"
            onChange={onChange}
            value={note.tag}
          />
        </div>
        <button
          disabled={note.title.length < 3 || note.description.length < 3}
          type="submit"
          className="btn btn-primary"
          onClick={handleClick}
        >
          Add Note
        </button>
      </form>
    </div>
  );
}
