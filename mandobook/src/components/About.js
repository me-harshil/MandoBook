import React from "react";
import { useContext } from "react";
import NoteContext from "../context/notes/noteContext";

export default function About() {
  const a = useContext(NoteContext);
  return( <div>About {a.name}</div>);
}
