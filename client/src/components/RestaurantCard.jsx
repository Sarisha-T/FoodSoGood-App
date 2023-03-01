// import packages
import React from 'react'
import { useEffect, useState } from 'react';
import AOS from 'aos'
import Loader from '../components/Loader';

// importing url
import { url } from '../App';

//initializing scroll animation
AOS.init()

//function to display few restaurants in landing page
function RestaurantCard() {
    const [randomRestaurants, setRandomRestaurant] = useState([]);
    useEffect(() => {
        // fetch restaurants
        fetch(`${url}/restaurant/get`)
            .then((res) => res.json())
            .then((data) => setRandomRestaurant(data.splice(0, 4)))
            .catch((err) => console.log(err));
    }, []);

    //to display restaurants
  return (
    <div className='row mx-5 mt-5' style={{backgroundColor:"var(--pri)",borderRadius:"20px 20px 0px 0px "}}>
        <h1 className="text-center icons m-3" style={{color:"var(--nav)"}}>Restaurants</h1>
          {randomRestaurants.length === 0 ? (
                        <div className="">
                           <Loader/>
                           NO RESTAURANTS FOUND :(
                        </div>
                    ) : (
                        randomRestaurants.map((randomRestaurant, key) => (
                            <div className="col-md-3 py-0 text-center my-0 " data-aos="fade-left"  key={key}>
                                <div className=' p-3 mb-5 rounded w-80'>
                                <img
                                    alt="restaurantimg"
                                    src={`${url}/restaurant/image/${randomRestaurant.image}`}
                                    className='img-fluid' style={{height:"200px",width:"200px",border:"2px",borderRadius:"20px"}}/>
                                <div className="mt-2">
                                    <h1>{randomRestaurant.restaurantName}</h1>
                                    <p className='text-warning m-0'>
                                       Location: {randomRestaurant.address}
                                    </p>                             
                                </div>
                                </div>
                            </div>
                            
                        ))
        )}
    </div>
  )
}

export default RestaurantCard;