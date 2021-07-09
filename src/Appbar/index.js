import { useState } from "react";
import "./index.css";

const Appbar = (props) => {
  const [isgrabed, setIsGrabed] = useState(true);
  const ZoomIn = () => {
    props.setScale(props.scale + 0.1);
  };

  const ZoomOut = () => {
    props.setScale(props.scale - 0.1);
  };
  return (
    <>
      <div className="appbar">
        <button onClick={ZoomOut}>{`-`}</button>
        <p>{(props.scale * 100).toFixed()}%</p>
        <button onClick={ZoomIn}>{`+`}</button>
        <button onClick={props.prevPage}>{`<`}</button>
        <p>
          {props.pageNumber} / {props.numPages}
        </p>
        <button onClick={props.nextPage}>{`>`}</button>
        <button
          className={`${!isgrabed ? "active" : ""}`}
          onClick={() => {
            isgrabed ? setIsGrabed(false) : setIsGrabed(true);
            props.setGrab(isgrabed);
          }}
        >
          <img
            alt="grab-icon"
            src="https://img.icons8.com/color/48/000000/grab-tool.png"
          />
        </button>
        <button className="showButton" onClick={()=> props.setShowSelectedMarks(!props.showSelectedMarks)}>
            show
        </button>
      </div>
    </>
  );
};

export default Appbar;
