import { useState } from "react";
import "./teststyle.css";
const Aeee = () => {
  const [selectedFeedback, setSelectedFeedback] = useState("good");
  console.log(selectedFeedback);

  const handleFeedbackClick = (feedback) => {
    if (selectedFeedback !== feedback) {
      document
        .querySelector(`.feedback li.${selectedFeedback}.active`)
        .classList.remove("active");
      setSelectedFeedback(feedback);
    }
  };
  return (
    <div>
      {" "}
      <label>
        Rating:
        <ul className="feedback">
          <li
            className={`angry ${selectedFeedback === "angry" ? "active" : ""}`}
            onClick={() => handleFeedbackClick("angry")}
          >
            <div>
              <svg className="eye left">
                <use xlinkHref="#eye" />
              </svg>
              <svg className="eye right">
                <use xlinkHref="#eye" />
              </svg>
              <svg className="mouth">
                <use xlinkHref="#mouth" />
              </svg>
            </div>
          </li>
          <li
            className={`sad ${selectedFeedback === "sad" ? "active" : ""}`}
            onClick={() => handleFeedbackClick("sad")}
          >
            <div>
              <svg className="eye left">
                <use xlinkHref="#eye" />
              </svg>
              <svg className="eye right">
                <use xlinkHref="#eye" />
              </svg>
              <svg className="mouth">
                <use xlinkHref="#mouth" />
              </svg>
            </div>
          </li>
          <li
            className={`ok ${selectedFeedback === "ok" ? "active" : ""}`}
            onClick={() => handleFeedbackClick("ok")}
          >
            <div></div>
          </li>
          <li
            className={`good ${selectedFeedback === "good" ? "active" : ""}`}
            onClick={() => handleFeedbackClick("good")}
          >
            <div>
              <svg className="eye left">
                <use xlinkHref="#eye" />
              </svg>
              <svg className="eye right">
                <use xlinkHref="#eye" />
              </svg>
              <svg className="mouth">
                <use xlinkHref="#mouth" />
              </svg>
            </div>
          </li>
          <li
            className={`happy ${selectedFeedback === "happy" ? "active" : ""}`}
            onClick={() => handleFeedbackClick("happy")}
          >
            <div>
              <svg className="eye left">
                <use xlinkHref="#eye" />
              </svg>
              <svg className="eye right">
                <use xlinkHref="#eye" />
              </svg>
            </div>
          </li>
        </ul>
        <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
          <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7 4" id="eye">
            <path d="M1,1 C1.83333333,2.16666667 2.66666667,2.75 3.5,2.75 C4.33333333,2.75 5.16666667,2.16666667 6,1"></path>
          </symbol>
          <symbol
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 18 7"
            id="mouth"
          >
            <path d="M1,5.5 C3.66666667,2.5 6.33333333,1 9,1 C11.6666667,1 14.3333333,2.5 17,5.5"></path>
          </symbol>
        </svg>
      </label>
    </div>
  );
};
export default Aeee;
