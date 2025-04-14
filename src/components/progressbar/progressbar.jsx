import React from "react";

function ProgressBar({ progressPercentage }) {
  return (
    <div className="progress-container">
      <div
        className="progress-bar"
        role="progressbar"
        style={{ width: `${progressPercentage}%` }}
      >
      </div>
    </div>
  );
}

export default ProgressBar;