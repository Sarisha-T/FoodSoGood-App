//import packages
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Err from "../components/Err"
import Loader from "../components/Loader"
import Success from "../components/Success"
import AOS from 'aos'

//import URL
import { url } from '../App';

//initialize animation on scroll
AOS.init();

//component for user login
function UserLogin() {
    //navigation function
    const navigate = useNavigate();

    //state variables
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [userCred, setUserCred] = useState({ role: 'user' });

    //take value from entered input
    const inputData = (property, value) => {
        let userCredCopy = { ...userCred };
        userCredCopy[property] = value;
        setUserCred(userCredCopy);
    };

    //for logging user in
    const login = (event) => {
        event.preventDefault();
        let userCredCopy = { ...userCred };
        userCredCopy.username = userCredCopy.username.toLowerCase();

        fetch(`${url}/user/login`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(userCredCopy),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setUserCred({ role: 'user' });
                    localStorage.setItem('userDetails', JSON.stringify(data));
                    navigate('/home');
                } else {
                    setMessage(data.message);
                    setSuccess(true);
                    setTimeout(() => setSuccess(false), 3000);
                }
            })
            .catch((err) => {
                console.log(err);
                setMessage('Internal Server error');
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            });
    };

    return (
        <div className="row justify-content-center userloginpic m-0">
            <div className="col-md-5 mt-5 text-left shadow-lg p-3 mb-5 bg-dark rounded h-75 w-75" data-aos="fade-left">
                {/* page title */}
                <h1 className="text-center m-2 fw-bold text-white">LOGIN</h1>

                 {/*display message */}
                 {success ? (
                
                <div>
                   <Loader/>
                </div>
            ) : (
                <div className='visible'>
                     <Err error={message}></Err>
                </div>
            )}
            
                {/* login form */}
                <form className="form" onSubmit={(event) => login(event)} data-aos="zoom-in">
                    <input
                        value={userCred?.username}
                        onChange={(event) =>
                            inputData('username', event.target.value)
                        }
                        type="text"
                        placeholder="Enter Username"
                        className="form-control text-uppercase"
                        required
                    />
                    <input
                        value={userCred?.password}
                        onChange={(event) =>
                            inputData('password', event.target.value)
                        }
                        type="password"
                        placeholder="Enter Password"
                        className="form-control"
                        required
                    />
                    <button id="hover"className="add mt-3 mb-3 icons" type="submit">
                        LOGIN 
                    </button>
                </form>

                {/* links */}
                <p style={{ marginTop: '10px' }}>
                    <Link to="/user/register" className="link">
                        New to FoodSoGood? Create an account?
                    </Link>
                </p>
                <p className='m-0 p-0'>
                    <Link to="/restaurant/login" className="link text-warning">
                        Login as a Restaurant admin
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default UserLogin;
