//import packages
import React from 'react'
import { useEffect, useState } from 'react';
import AOS from 'aos'

//import components
import Loader from '../components/Loader';

// import URL
import { url } from '../App';

//initialize scroll animation
AOS.init()

//function to display food
function Foodcard() {
   
    const [topFoodItems, setTopFoodItems] = useState([]);
    
    //get all foods
    useEffect(() => {
        fetch(`${url}/food/getFood`)
            .then((res) => res.json())
            .then((data) => setTopFoodItems(data.splice(0, 4)))
            .catch((err) => console.log(err));
    }, []);

  return (
    <div className='row mx-5 my-0' style={{backgroundColor:"var(--pri)",borderRadius:"20px 20px 0px 0px "}}>
         <h1 className="text-center icons m-3" style={{color:"var(--nav)"}}>Most Loved by Customers!!</h1>
         {topFoodItems.length === 0 ? (
                        <div className=" ">
                            <Loader/>
                            No Foods Found :(
                        </div>
                    ) : (
                        topFoodItems.map((topFoodItem, key) => (
                        <div className="col-md-3 py-0 text-center my-0" data-aos="fade-right"  key={key}>
                                
                                <div className="p-3 mb-5 rounded w-80" >
                                
                                <img alt="foodimg"
                                 src={`${url}/food/image/${topFoodItem.image}`}
                                 className='img-fluid'
                                 style={{height:"200px",width:"200px",border:"2px",borderRadius:"20px"}}/>

                                <div className="m-2">
                                    <h1>{topFoodItem.name} : &#8377; {topFoodItem.price}</h1>
                                    
                                </div>
                               
                                </div>
                            </div>
                            
                        ))
                        
                    )}
                    </div>
  )
}

export default Foodcard;