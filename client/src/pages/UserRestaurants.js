// import packages
import AOS from 'aos'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FcShop } from "react-icons/fc";

// import components
import { UserNavbar  } from '../components/Navbar';
import Footer from '../components/Footer';
import RestaurantCard from '../components/RestaurantCard';
import Loader from '../components/Loader';

// import URL
import { url } from '../App';
//initialize animation on scroll
AOS.init()
// Component to display all restaurants
function UserRestaurants() {
    //state variables
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        // fetch all the restaurants
        fetch(`${url}/restaurant/get`)
            .then((res) => res.json())
            .then((data) => setRestaurants(data))
            .catch((err) => console.log(err));
    }, []);

    return (
        <div className="user-dashboard">
            <UserNavbar/> 
            <section className="container">
                <h1 className="text-center m-3 fw-bold fs-3">Restaurants</h1>

                <div className="row mx-2">
                    {restaurants.length === 0 ?(
                        <div className="loading text-center">
                        <h1>NO Restaurants Found :(</h1>
                       <Loader/>
                   </div>
                    ) : (
                        restaurants.map((restaurant, key) => (
                            <div className="col-md-4 py-0 text-center" key={key}>
                                <div className='shadow-lg p-3 mb-5 bg-body rounded w-80' data-aos="zoom-in">
                                <img
                                    alt="restaurantimg"
                                    
                                    src={`${url}/restaurant/image/${restaurant.image}`}
                                    className='img-fluid' style={{height:"200px",width:"200px"}}
                                />
                                <div className="">
                                    <h1 style={{textTransform:'uppercase'}}>{restaurant.restaurantName}</h1>
                                    <p className='m-0'>
                                        Location : {restaurant.address}
                                    </p>
                                    <div className="flex-container mt-1 mx-4">
                                        <div className='w-100 mt-1 '>
                                            <p className='m-0'>Opening Time:</p>
                                            <h1 className='m-0 p-0'>{restaurant.openingTime}</h1>
                                        </div>
                                        <div className='w-100 mt-1'>
                                            <p className='m-0'>Closing Time : </p>
                                            <h1>{restaurant.closingTime}</h1>
                                        </div>
                                    </div>
                                    <Link
                                        to={`/user/restaurant/${restaurant._id}`}
                                        state={{ restaurant }}
                                    >
                                        <button className="add w-75 my-2">
                                            View More
                                        </button>
                                    </Link>
                                </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default UserRestaurants;
