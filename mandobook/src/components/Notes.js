import React, { useContext, useEffect, useRef, useState } from "react";
import noteContext from "../context/notes/noteContext";
import Noteitem from "./Noteitem";
import { useNavigate } from "react-router-dom";

export default function Notes(props) {
  const navigate = useNavigate();

  const { notes, getNotes, editNote } = useContext(noteContext);

  const [note, setnote] = useState({
    _id: "",
    title: "",
    description: "",
    tag: "general",
  });
  const handleClick = (e) => {
    editNote(note._id, note.title, note.description, note.tag);
    refClose.current.click();
    props.showAlert("Updated Successfully", "success");
  };
  const onChange = (e) => {
    setnote({
      ...note,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getNotes();
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []);
  const ref = useRef(null);
  const refClose = useRef(null);

  const editnote = (note) => {
    ref.current.click();
    setnote(note);
  };
  return (
    <>
      <button
        ref={ref}
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      ></button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit Note
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
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
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                ref={refClose}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleClick}
                disabled={note.title.length < 3 || note.description.length < 3}
              >
                Update Note
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <h2 className="my-3">Your Notes</h2>
        {notes.length === 0 && "No notes to display"}
      </div>
      <div className="row">
        {notes.map((note) => {
          return (
            <Noteitem
              note={note}
              key={note._id}
              editnote={editnote}
              showAlert={props.showAlert}
            />
          );
        })}
      </div>
    </>
  );
}
