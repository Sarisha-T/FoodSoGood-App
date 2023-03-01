import React, { useState,useEffect } from "react";
import {filterFoods} from "../actions/foodActions"

export default function Filter() {
    
   
    const [search,setSearch]=useState('')
            const [Food, setFood] = useState([]);

         function filter(){
            useEffect(() => {
        // to get the all food items
        fetch(`${url}/food/getFood/:name`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setFoods(data);
            })
            .catch((err) => console.log(err));
    }, []);
         }  
    

  return (
    <div className="container">
        <div className="row justify-content-center mb-5 p-3">
        <div className="col-md-3 w-30 ">
            <input type="text" value={search} onChange={(e)=>{setSearch(e.target.value)
            }} className="form-control w-100 text-uppercase" placeholder="search"/>
            </div>
            <div className="col-md-1 mt-2 p-1 w-30">
                <button className="add w-100" onClick={()=>{dispatch(filterFoods(search))}}>FILTER</button>
           
            </div>
            
          
        </div>
    </div>
  )
}



