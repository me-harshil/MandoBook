import React, { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  let initialNotes = [];

  const [notes, setnotes] = useState(initialNotes);

  // Get all notes
  const getNotes = async () => {
    // API Call
    const url = "http://localhost:5000/api/notes/fetchallnotes";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "auth-token": localStorage.getItem("token"),
        // "auth-token":
        //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRjNTE1NTA0MDlkMDhmOGEzYzhmZmI3In0sImlhdCI6MTY5MDYzNzY0OH0.eSaSLW-XmMOOUs3sJzdTjfQz72ngo9oKeZ28DP7fmM4",
      },
    });
    const json = await response.json();
    setnotes(json);
  };

  // Add a note
  const addNote = async (title, description, tag) => {
    // API Call
    const url = "http://localhost:5000/api/notes/addnote";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
        // "auth-token":
        //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRjNTE1NTA0MDlkMDhmOGEzYzhmZmI3In0sImlhdCI6MTY5MDYzNzY0OH0.eSaSLW-XmMOOUs3sJzdTjfQz72ngo9oKeZ28DP7fmM4",
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const note = await response.json();
    setnotes(notes.concat(note));
  };

  // Delete a note
  const deleteNote = async (id) => {
    // API Call
    const url = `http://localhost:5000/api/notes/deletenote/${id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
        // "auth-token":
        //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRjNTE1NTA0MDlkMDhmOGEzYzhmZmI3In0sImlhdCI6MTY5MDYzNzY0OH0.eSaSLW-XmMOOUs3sJzdTjfQz72ngo9oKeZ28DP7fmM4",
      },
    });
    const json = await response.json();
    console.log(json);

    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setnotes(newNotes);
  };

  // Edit a note
  const editNote = async (id, title, description, tag) => {
    // API Call
    const url = `http://localhost:5000/api/notes/updatenote/${id}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
        // "auth-token":
        //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRjNTE1NTA0MDlkMDhmOGEzYzhmZmI3In0sImlhdCI6MTY5MDYzNzY0OH0.eSaSLW-XmMOOUs3sJzdTjfQz72ngo9oKeZ28DP7fmM4",
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const json = await response.json();
    console.log(json);

    let newNotes = JSON.parse(JSON.stringify(notes));

    // Logic to edit a note
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        element.title = title;
        element.description = description;
        element.tag = tag;
        break;
      }
    }
    setnotes(newNotes);
  };

  return (
    <NoteContext.Provider
      value={{ notes, setnotes, addNote, deleteNote, editNote, getNotes }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
