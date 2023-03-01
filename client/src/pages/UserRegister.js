// import packages
import AOS from 'aos'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Err from "../components/Err"
import Loader from "../components/Loader"

// import URL
import { url } from '../App';
//initialize animation on scroll
AOS.init();
//Register user component
function UserRegister() {
    //navigation function
    const navigate = useNavigate();

    // creating state variables
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [userData, setUserData] = useState({});

    // function to read value from input
    const inputData = (property, value) => {
        let userDataCopy = { ...userData };
        userDataCopy[property] = value;
        setUserData(userDataCopy);
    };

    //function to add new user
    const register = (event) => {
        event.preventDefault();

        let userDataCopy = { ...userData };
        userDataCopy.username = userDataCopy.username.toLowerCase();
        userDataCopy.email = userDataCopy.email.toLowerCase();

        if (userData.password === userData.cpassword) {
            fetch(`${url}/user/register`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(userDataCopy),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        setUserData({});
                        navigate('/user/login');
                    } else {
                        setMessage(data.message);
                        setSuccess(true);
                        setTimeout(() => setSuccess(false), 3000);
                    }
                })
                .catch((err) => console.log(err));
        } else {
            setMessage('Entered Passwords are not same');
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }
    };

    return (
        <div className="row justify-content-center userloginpic m-0">
            <div className="col-md-5 mt-5 text-left shadow-lg p-3 mb-5 bg-dark rounded h-75 w-75" data-aos="fade-right">
                {/* page title */}
                <h1 className="text-center m-2 text-white" style={{fontSize:'35px'}}>User Registeration</h1>
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

                {/* form for registering*/}
                <form className="form" onSubmit={(event) => register(event)} data-aos="zoom-in">
                    <input
                        value={userData?.username}
                        onChange={(event) =>
                            inputData('username', event.target.value)
                        }
                        type="text"
                        placeholder="Enter Username"
                        className="form-control text-uppercase"
                        required
                    />
                    <input
                        value={userData?.mobile}
                        onChange={(event) =>
                            inputData('mobile', event.target.value)
                        }
                        type="number"
                        placeholder="Enter Mobile number"
                        className="form-control"
                        maxLength={10}
                        required
                    />
                    <input
                        value={userData.email}
                        onChange={(event) =>
                            inputData('email', event.target.value)
                        }
                        type="email"
                        placeholder="Enter email"
                        className="form-control"
                        required
                    />

                    <input
                        value={userData.password}
                        onChange={(event) =>
                            inputData('password', event.target.value)
                        }
                        type="password"
                        placeholder="Enter Password"
                        className="form-control"
                        required
                    />
                    <input
                        value={userData.cpassword}
                        onChange={(event) =>
                            inputData('cpassword', event.target.value)
                        }
                        type="password"
                        placeholder="Confirm Password"
                        className="form-control"
                        required
                    />
                    <button className="add mt-3 mb-3 icons" type="submit">
                        Register
                    </button>
                </form>

                {/* links*/}
                <p style={{ marginTop: '10px' }}>
                    <Link to="/user/login" className="link">
                        Already on FoodSoGood? Login
                    </Link>
                </p>
                <p>
                    <Link to="/restaurant/register" className="link text-warning">
                        Register your Restaurant
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default UserRegister;
