import Notes from "./Notes";
import Addnote from "./Addnote";


export default function Home(props) {
  return (
    <>
      <Addnote showAlert={props.showAlert}/>
      <Notes showAlert={props.showAlert}/>
    </>
  );
}
