// // import packages
import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// import icons
import { FcShop } from "react-icons/fc";
import { GiMoneyStack } from "react-icons/gi";

// import components
import { UserNavbar  } from '../components/Navbar';
import Footer from '../components/Footer';
import Err from '../components/Err';
import Success from '../components/Success';
import Loader from '../components/Loader';

// import URL
import { url } from '../App';

function Restaurant() {
    //get user data
    const token = useRef(JSON.parse(localStorage.getItem('userDetails')).token);
    const user = JSON.parse(localStorage.getItem('userDetails')).user;

    const restaurantId = useRef(useParams().id);

    // state variables
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [restaurant, setRestaurant] = useState(' ');
    const [foods, setFoods] = useState([]);

    useEffect(() => {
        // fetch foods and data of that restaurant
        fetch(`${url}/restaurant/get/${restaurantId.current}`, {
            headers: { authorization: `bearer ${token.current}` },
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setRestaurant(data.restaurant);
                setFoods(data.foods);
            })
            .catch((err) => console.log(err));
    }, []);

    //function to add food to cart
    const addToCart = (id) => {
        let cartData = { food: id, user: user._id };

        fetch(`${url}/cart/addToCart`, {
            method: 'POST',
            headers: {
                authorization: `bearer ${token.current}`,
                'content-type': 'application/json',
            },
            body: JSON.stringify(cartData),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    console.log(data);
                    setSuccess(true);
                    setMessage(data.message);
                    setTimeout(() => setSuccess(false), 3000);
                }
            })
            .catch((err) => console.log(err));
    };

    return (
        <div className="">
            {/* display message */}
            {success ? (
                     <div
                     style={{
                         position: 'fixed',
                         overflow: 'hidden',
                         width:'30vw',
                         
                         cursor: 'not-allowed',
                     }}
                     className="m-5 text-center bg-success"
                 >
                 <span><Loader  className="h-25 w-25"/></span>
                  <Success success={message}/>
                 </div>
             ) : (
                 <div className='w-100 fixed '
                     style={{
                         width: '100%',
                         height: '100vh',
                         position: 'fixed',
                         overflow: 'hidden',
                         visibility: 'hidden',
                     }}
                 >
                     <Loader/>
                    <Err error={message}/>
                 </div>
            )}

            {/* user nav */}
            <UserNavbar/>

            {/* restaurant info */}
            {restaurant !== ' ' ? (
                <section className="container m-5 d-flex justify-content-center">
                    <div className="d-flex justify-content-around w-75">
                        <img
                            alt="restaurantimg"
                            src={`${url}/restaurant/image/${restaurant?.image}`}
                            className="img-fluid"
                            style={{width:"200px",height:"200px"}}
                        />

                        <div className="">
                            <h1 style={{ fontSize: '2rem', textTransform:'uppercase' }} className="">
                                {restaurant?.restaurantName}
                            </h1>
                            <p className="icons">
                                Address:{' '}<span>{restaurant?.address}</span>
                            </p>
                           
                            <div className="">
                                <div className='w-100 my-1'>
                                <h1>Opening Time :{" "}<span className='text-dark' style={{fontFamily: 'monospace',}}>{restaurant.openingTime} railway time</span></h1>
                                   
                                </div>

                                <div className='w-100 my-1'>
                                <h1 className=''>Closing Time:{" "}<span className='text-dark' style={{fontFamily: 'monospace',}}>{restaurant.closingTime} railway time</span></h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ) : (
                <div className="loading">
                   <Loader/>
                </div>
            )}

            {/* Food Section */}
            <section className="container">
                <h1 className="text-center">Food Menu</h1>

                {/*FOODS */}
                <div className="row mx-2">
                    {foods.length === 0 ? (
                        <div className="loading text-center mt-5 my-5">
                            <Loader/>
                            <h1>NO Foods found:(</h1>
                        </div>
                    ) : (
                        foods.map((food, key) => (
                            <div className="col-md-4 py-0 text-center" key={key}>

                                <div className='shadow-lg p-3 mb-5 bg-body rounded w-80'>
                                <img
                                    alt="food"
                                    className="img-fluid"
                                    src={`${url}/food/image/${food.image}`}
                                    style={{height:"200px",width:"200px",overflow:'hidden'}}
                                />
                                <div className="p-1">
                                    <h1 className="text-uppercase">{food.name}</h1>
                                    <p  className='m-0' style={{ fontFamily: 'monospace' }}>{food.description}</p>
                                    <div className="flex-container">
                                        <div className='w-100 my-1'>
                                        <h1>&#8377; {food.price}<GiMoneyStack style={{fontSize: '1.5rem',color:"var(--btn)"}} className='icons'/></h1>
                                        </div>
                                        <div className='w-100 my-1'>
                                        <h1><span style={{fontSize: '1.1rem',color:"var(--btn)",fontFamily: 'monospace' }}>Instock:</span>{food.quantity} </h1>
                                        </div>
                                    </div>
                                    <div className='flex-container'>

                                        <div className='w-100 m-0'>
                                             <p><FcShop style={{fontSize: '1.5rem'}}/>{(food.restaurant?.restaurantName).toUpperCase()}</p>
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
                                        <h1 className='text-danger text-center mt-2 icons'>
                                            Stocks out!
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

export default Restaurant;
