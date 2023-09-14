import React, { useContext } from "react";
import noteContext from "../context/notes/noteContext";

export default function Noteitem(props) {
  const { deleteNote } = useContext(noteContext);
  let { title, description } = props.note;
  return (
    <div className="col-md-3 my-2">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
          <i
            className="fa-solid fa-trash mx-2"
            onClick={() => {
              deleteNote(props.note._id);
              props.showAlert("Deleted Successfully", "success");
            }}
          ></i>
          <i
            className="fa-solid fa-pen-to-square mx-2"
            onClick={() => {
              props.editnote(props.note);
            }}
          ></i>
        </div>
      </div>
    </div>
  );
}
