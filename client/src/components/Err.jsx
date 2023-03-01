//import packages
import React from "react";

//function for displaying error
export default function Err({ error }) {
  return (
    <div>
      <div class="alert text-danger fw-bold text-uppercase" role="alert">
        {error}
      </div>
    </div>
  );
}
