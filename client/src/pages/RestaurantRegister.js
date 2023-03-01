//import packages
import AOS from 'aos'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

//import components
import Loader from "../components/Loader"
import Err from "../components/Err"

//import URL
import { url } from '../App';

//initialize animation on scroll
AOS.init();

//Component for registering restaurant
function RestaurantRegister() {

    //navigation 
    const navigate = useNavigate();

    //state variables
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const formData = new FormData();

    //function to take entered value
    const inputData = (property, value) => {
        formData.append(property, value);
    };

    // function to add a restaurant user
    const register = (event) => {
        event.preventDefault();
        console.log(formData);
        // if (formData.password===formData.cpassword) {
            
            fetch(`${url}/restaurant/register`,{
                method: 'POST',
                body: formData,
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        navigate('/restaurant/login');
                    } else {
                        setMessage(data.message);
                        setSuccess(true);
                        setTimeout(() => setSuccess(false), 3000);
                    }
                })
                .catch((err) => console.log(err));
        } 
        // else {
        //     setMessage('Passwords do not match');
        //     setSuccess(true);
        //     setTimeout(() => setSuccess(false), 3000);
        // }
    // };

    return (
        <div className="row justify-content-center userloginpic m-0">
           
            <div className="col-md-5 mt-5 text-left shadow-lg p-3 mb-5 bg-dark rounded h-100 w-75" data-aos="fade-right">
                {/* div title*/}
                <h1 className="text-center m-2 text-white">Restaurant Signup</h1> 
                
                {/* display message */}
                {success ? (
                <div> <Loader/></div>
            ) : (
                <div>
                    <Err error={message}/>
                </div>
            )}

                {/*form for registering a restaurant*/}
                <form className="form" onSubmit={(event) => register(event)} data-aos="zoom-in">
                    <input
                        onChange={(event) =>
                            inputData('restaurantName', event.target.value)
                        }
                        type="text"
                        placeholder="Enter Restaurant Name"
                        className="form-control text-uppercase mb-2"
                        required
                    />
                    <textarea
                        minLength="10"
                        onChange={(event) =>
                            inputData('address', event.target.value)
                        }
                        placeholder="Enter Address"
                        className="form-control mb-2"
                        required
                    />
                    <div className="flex-container">
                        <div className="form-control">
                            <label className="label" htmlFor="openTime">
                                Opening Time
                            </label>
                            <input
                                onChange={(event) =>
                                    inputData('openingTime', event.target.value)
                                }
                                id="openTime"
                                className="form-control"
                                type="time"
                                placeholder="opening time"
                                required
                            />
                        </div>
                        <div className="form-control">
                            <label className="label" htmlFor="closeTime">
                                Closing Time
                            </label>
                            <input
                                onChange={(event) =>
                                    inputData('closingTime', event.target.value)
                                }
                                id="closeTime"
                                className="form-control"
                                type="time"
                                placeholder="closing time"
                                required
                            />
                        </div>
                    </div>

                    <input
                    value={formData.password}
                        onChange={(event) =>
                            inputData('password', event.target.value)
                        }
                        
                        type="password"
                        placeholder="Enter Password"
                        className="form-control"
                        required
                    />
                    
                    {/* <input
                    value={formData.cpassword}
                        onChange={(event) =>
                            inputData('cpassword', event.target.value)
                        }
                        type="password"
                        placeholder="Confirm Password"
                        className="form-control"
                        required
                    /> */}

                    <input
                        
                        onChange={(event) =>
                            inputData('image', event.target.files[0])
                        }
                        type="file"
                        placeholder="foodimg"
                        name="image"
                        className="form-control"
                        required
                    />
                    <button className="add mt-3 icons" type="submit">
                        Register
                    </button>
                </form>

                {/*navigation links*/}
                <p style={{ marginTop: '10px' }}>
                    <Link to="/restaurant/login" className="link">
                        Have an account already?
                    </Link>
                </p>
                <p>
                    <Link to="/user/login" className="link text-warning">
                        Login in as User
                    </Link>
                </p>
            </div>
        </div>
    );
}

//exporting
export default RestaurantRegister;
