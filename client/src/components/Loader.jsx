//import packages
import React from "react";

//component to be displayed when loading
function Loader() {
  return (
    <div>
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-warning" role="status" style={{height:"40px",width:"40px"}}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
}

export default Loader;