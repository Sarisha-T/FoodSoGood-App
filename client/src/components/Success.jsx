//import packages
import React from 'react'

//display during successful message
function Success({success}) {
  return (
    <div>
        <div className=" text-white icons p-5" style={{backgroundColor:"var(--btn)"}} role="alert">
            {success}
        </div>
    </div>
  )
}

//export function
export default Success;