// import packages
import AOS from 'aos'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// import icons
import { FcShop } from "react-icons/fc";
import { GiMoneyStack } from "react-icons/gi";

// import components
import { UserNavbar  } from '../components/Navbar';
import Footer from '../components/Footer';
import Err from '../components/Err';
import Success from '../components/Success';
// import URL
import { url } from '../App';
import Loader from '../components/Loader';

//initialize animation on scroll
AOS.init()

// Component to display all foods
function UserFoods() {
    //state variables
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [foods, setFoods] = useState([]);

    //store user details
    const token = JSON.parse(localStorage.getItem('userDetails')).token;
    const user = JSON.parse(localStorage.getItem('userDetails')).user;

    useEffect(() => {
        //fetch all foods
        fetch(`${url}/food/getFood`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setFoods(data);
            })
            .catch((err) => console.log(err));
    }, []);

    // function to add foods to cart
    const addToCart = (id) => {
        let cartData = { food: id, user: user._id };

        fetch(`${url}/cart/addItem`, {
            method: 'POST',
            headers: {
                authorization: `bearer ${token}`,
                'content-type': 'application/json',
            },
            body: JSON.stringify(cartData),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setMessage(data.message);
                    setSuccess(true);
                    setTimeout(() => setSuccess(false), 3000);
                }
            })
            .catch((err) => console.log(err));
    };

    return (
        <div className="">
            {/* display message */}
            {success ? (
            <div className="d-flex justify-content-center text-center h-100 w-100 position-fixed mt-10 overflow-hidden align-items-center" style={{backgroundColor:"white", zIndex:'1'}}
                >
                <div><Loader  className="h-25 w-25 "/></div>    
                <Success success={message}/>
                </div>
            ) : (
                <div
                    style={{
                        width: '100%',
                        height: '100vh',
                        position: 'fixed',
                        overflow: 'hidden',
                        visibility: 'hidden',
                    }}
                >
                    <Loader/><Err error={message}/>
                   
                </div>
            )}

            {/* navbar */}
            <UserNavbar/>

            <section className="container">
                {/* all foods */}
                <h1 className="text-center m-3">FOODS😋</h1>
                <div className='d-flex justify-content-end mb-2'>
                <Link to="/restaurantslist">
                        <h1 style={{ cursor: 'pointer', color: 'var(--header)' }}>
                            Explore Restaurants <FcShop style={{fontSize: '1.5rem'}}/> {'->'}
                        </h1>
                    </Link>
                </div>

                <div className="row mx-2">
                    {foods.length === 0 ? (
                        <div className="loading text-center">
                             <h1>NO Foods Found :(</h1>
                            <Loader/>
                        </div>
                    ) : (
                        foods.map((food, key) => (
                            <div className="col-md-4 py-0 text-center" key={key}>
                                 <div className="shadow-lg p-3 mb-5 bg-body rounded w-80" data-aos="zoom-in">
                                <img
                                    alt="foodimg"
                                    className='img-fluid'
                                    src={`${url}/food/image/${food.image}`}
                                    style={{height:"200px",width:"200px",overflow:'hidden'}}
                                />
                                <div className="p-1">
                                    <h1 className='text-uppercase'>{food.name}</h1>
                                    <p className='m-0' style={{ fontFamily: 'monospace' }}>{food.description}</p>
                                    <div className="flex-container">
                                        <div className='w-100 my-1'>
                                         <h1>&#8377; {food.price}<GiMoneyStack style={{fontSize: '1.5rem',color:"var(--btn)"}} className='icons'/></h1>
                                        </div>
                                        <div className='w-100 my-1'>
                                            <h1><span style={{fontSize: '1.1rem',color:"var(--btn)",fontFamily: 'monospace'}}>Instock:</span>{food.quantity}</h1>
                                        </div>
                                    </div>

                                    <div className='flex-container'>
                                    <div className='w-100 m-0'>

                                   <p>
                                    <FcShop style={{fontSize: '1.5rem'}}/>
                                    {food.restaurant?.restaurantName}
                                     </p>

                                   </div>
                              
                                    </div>
                                    {food.quantity > 0 ? (
                                        <div className="flex-container ">
                                            <Link
                                                className="w-100 my-1 mx-2"
                                                to={`/payment/${food._id}`}
                                                state={{ food }}
                                            >
                                                <button
                                                    onClick={() => {}}
                                                    className="add w-100 py-2"
                                                >
                                                    Order now
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    addToCart(food._id)
                                                }
                                                className="add w-100 my-1 py-2"
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    ) : (
                                        <h1>
                                            Out of Stock
                                        </h1>
                                    )}
                                </div>
                                </div>


                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* footer */}
            <Footer />
        </div>
    );
}

export default UserFoods;
