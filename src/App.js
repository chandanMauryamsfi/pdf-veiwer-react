import "./App.css";
import samplePdf from "./static/sample.pdf";
import React, { useState, useRef, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import Appbar from "./Appbar/index";
import $ from "jquery";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function App() {
  var canvas = document.getElementsByClassName("react-pdf__Page__canvas")[0];
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [grab, setGrab] = useState(false);
  const [drag, setDrag] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [scale, setScale] = useState(1.0);
  const inputEl = useRef();
  const confirmSelectionRef = useRef();
  const [showSelectedMarks, setShowSelectedMarks] = useState(false);

  const [cords, setCords] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    localStorage.clear()
  }, []);

  const style = {
    
  };

  const crosshairStyle = {
    position: `relative`,
  };

  const [darableDiv, setDragableDiv] = useState({
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    canvas = document.getElementsByClassName("react-pdf__Page__canvas")[0];
  }

  const nextPage = () => {
    numPages === pageNumber
      ? setPageNumber(pageNumber)
      : setPageNumber(pageNumber + 1);
    confirmSelectionRef.current.hidden = true;
  };

  const prevPage = () => {
    pageNumber === 1 ? setPageNumber(1) : setPageNumber(pageNumber - 1);
    confirmSelectionRef.current.hidden = true;
  };

  const saveCordinates = () => {
    confirmSelectionRef.current.hidden = true;
    var data = getLocalstorageData();
    if (data) {
      data.push([cords.left, cords.top, cords.width, cords.height]);
    } else {
      data = [[cords.left, cords.top, cords.width, cords.height]];
    }
    localStorage.setItem(`coords${pageNumber}`, JSON.stringify(data));
  };

  const getLocalstorageData = () => {
    return JSON.parse(localStorage.getItem(`coords${pageNumber}`))
  }

  function reCalc() {
    setCordsAndWidthAndHeight(inputEl.current.style);
  }

  const onmousedownhandel = (e) => {
    setDragableDiv((pre) => ({
      ...pre,
    }));
    if (grab & confirmSelectionRef.current.hidden) {
      setDrag(true);
      if (canvas) {
        var canvasx = $(canvas).offset().left;
        var canvasy = $(canvas).offset().top;
      }
      confirmSelectionRef.current.hidden = true;
      setDragableDiv((pre) => ({
        ...pre,
        x1: e.clientX - canvasx,
        y1: e.clientY - canvasy,
      }));
      reCalc();
    }
  };

  const onmousemovehandel = (e) => {
    if (drag) {
      var canvasx = $(canvas).offset().left;
      var canvasy = $(canvas).offset().top;
      setDragging(true);
      setDragableDiv((pre) => ({
       ...pre,
        x2: e.clientX - canvasx,
        y2: e.clientY - canvasy,
      }));

      reCalc();
    }
  };

  onmouseup = (e) => {
    if (grab) {
      setDrag(false);
      setDragging(false);
      if (dragging) {
        confirmSelectionRef.current.hidden = false;
        renderConfirmationDIv();
      }
    }
  };

  const renderConfirmationDIv = () => {
    const confirmSelectionStyle = confirmSelectionRef.current.style;
    setCordsAndWidthAndHeight(confirmSelectionStyle);
  };

  const setCordsAndWidthAndHeight = (styleElement) => {
    var x5 = Math.min(darableDiv.x1, darableDiv.x2);
    var x6 = Math.max(darableDiv.x1, darableDiv.x2);
    var y5 = Math.min(darableDiv.y1, darableDiv.y2);
    var y6 = Math.max(darableDiv.y1, darableDiv.y2);
    styleElement.left = x5 + "px";
    styleElement.top = y5 + "px";
    styleElement.width = x6 - x5 + "px";
    styleElement.height = y6 - y5 + "px";
    setCords({
      top: x5,
      left: y5,
      width: x6 - x5,
      height: y6 - y5,
    });
  };

  return (
    <>
      <Appbar
        pageNumber={pageNumber}
        numPages={numPages}
        nextPage={nextPage}
        prevPage={prevPage}
        setGrab={setGrab}
        scale={scale}
        setScale={setScale}
        setShowSelectedMarks={setShowSelectedMarks}
        showSelectedMarks={showSelectedMarks}
      />

      <div className={`pdf-container`}>
        <div className={`pdf-canvas-div`}>
          <div
            onMouseDown={onmousedownhandel}
            onMouseMove={onmousemovehandel}
            className={`${grab & !drag ? "addcrosshair" : ""}`}
            style={crosshairStyle}
          >
            <div
              ref={inputEl}
              className="draggableDIv"
              hidden={dragging ? false : true}
            ></div>
            <div
              ref={confirmSelectionRef}
              className="confirmSelectionDiv"
              hidden={true}
              style={style}
            >
              <div className="confirmationDivHeader">
                <button
                  onClick={() => {
                    saveCordinates();
                  }}
                >
                  ok
                </button>
                <button
                  onClick={() => (confirmSelectionRef.current.hidden = true)}
                >
                  x
                </button>
              </div>
            </div>
            {getLocalstorageData()
              ? getLocalstorageData().map(
                  (val, index) => {
                    return (
                      <div
                        key={index}
                        className="renders"
                        style={{
                          position: `absolute`,
                          left: val[1],
                          top: val[0],
                          width: val[2],
                          height: val[3],
                          display: showSelectedMarks ? "block" : "none",
                          
                        }}
                      >
                        {
                          // canvas ? <Draw canvas={canvas}
                          // x={val[1]}
                          // y={val[0]}
                          // width={val[2]}
                          // height={val[3]}/> : ""
                        }
                      </div>
                    );
                  }
                )
              : ""}
            <Document file={samplePdf} onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={pageNumber} scale={scale} />
            </Document>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

const Draw = (props) => {
  const ctx = props.canvas.getContext("2d");

  ctx.rect(20, 20, 150, 100);
  ctx.stroke();

  return <></>;
};
