// import packages
import AOS from 'aos'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { url } from '../App';
import Err from "../components/Err"
import Loader from "../components/Loader"
import Success from "../components/Success"
import { AiFillEye } from "react-icons/ai";

//initialize animation on scroll
AOS.init();
function RestaurantLogin() {
    //navigation function
    const navigate = useNavigate();

    // state variables
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [restaurantCred, setRestaurantCred] = useState({
        role: 'restaurant',
    });

    // function to read value of input
    const readValue = (property, value) => {
        let restaurantCredCopy = { ...restaurantCred };
        restaurantCredCopy[property] = value;
        setRestaurantCred(restaurantCredCopy);
    };

    // function to login user
    const login = (event) => {
        event.preventDefault();

        fetch(`${url}/restaurant/login`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(restaurantCred),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setRestaurantCred({ role: 'restaurant' });
                    localStorage.setItem('userDetails', JSON.stringify(data));
                    navigate('/restaurant/orders');
                } else {
                    setMessage(data.message);
                    setSuccess(true);
                    setTimeout(() => setSuccess(false), 3000);
                }
            })
            .catch((err) => console.log(err));
    };

    return (
        <div className="row justify-content-center userloginpic m-0">
           
        <div className="col-md-5 mt-5 text-left shadow-lg p-3 mb-5 w-75 h-75 bg-dark rounded" data-aos="fade-left">
                {/* page title*/}
                <h1 className="text-center m-2 text-white">Restaurant Login</h1> 
                {/* display message */}
                {success ? (
                
                <div>
                   <Loader/>
                </div>
            ) : (
                <div>
                     <Err error={message}/>
                </div>
            )}

                {/*form for restaurant login*/}
                <form className="form" onSubmit={(event) => login(event)} data-aos="zoom-in">
                    <input
                        value={restaurantCred.restaurantName}
                        onChange={(event) =>
                            readValue('restaurantName', event.target.value)
                        }
                        type="text"
                        placeholder="Enter Restaurant Name"
                        className="form-control text-uppercase"
                        required

                    />

                    <input
                        value={restaurantCred.password}
                        onChange={(event) =>
                            readValue('password', event.target.value)
                        }
                        type="password"
                        placeholder="Enter Password"
                        className="form-control"
                        required 
                    />

                    <button className="add mt-3 mb-3 icons" type="submit">
                        Login
                    </button>
                </form>

                {/*links*/}
                <p style={{ marginTop: '10px' }}>
                    <Link to="/restaurant/register" className="link">
                        New to FoodSoGood? Register your Restaurant
                    </Link>
                </p>
                <p>
                    <Link to="/user/login" className="link text-warning">
                        Login as a User
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default RestaurantLogin;
