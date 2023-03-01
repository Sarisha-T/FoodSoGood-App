// import packages
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AOS from 'aos'

// import icons
import { MdDelete, MdDone, MdEdit } from 'react-icons/md';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';

// import components
import { UserNavbar  } from '../components/Navbar';
import Footer from '../components/Footer';

// import URL
import { url } from '../App';

//initialize animation on scroll
AOS.init()

//Cart Component
function Cart() {
    //navigation function
    const navigate = useNavigate();

    //get user data
    const token = useRef(JSON.parse(localStorage.getItem('userDetails')).token);
    const user = useRef(JSON.parse(localStorage.getItem('userDetails')).user);

    //state variables
    const [cartDetails, setCartDetails] = useState([]);
    const [Quantity, setQuantity] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        // fetch all cart details
        fetch(`${url}/user/cart/${user.current._id}`, {
            headers: { authorization: `bearer ${token.current}` },
        })
            .then((res) => res.json())
            .then((data) => setCartDetails(data))
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        //calculate total amount
        if (cartDetails.length !== 0) {
            let countPrice = 0;
            cartDetails.forEach((i) => {
                countPrice += i.food.price * i.quantity;
            });
            setTotalPrice(countPrice);
        } else if (cartDetails.length === 0) {
            setTotalPrice(0);
        }
    }, [cartDetails]);

    //delete a food from cart
    const deleteFood = (id, index) => {
        fetch(`${url}/cart/deleteFood/${id}`, {
            method: 'DELETE',
            headers: { authorization: `bearer ${token.current}` },
        })
            .then((res) => res.json())
            .then(() => {
                let cartDetailsCopy = [...cartDetails];
                cartDetailsCopy.splice(index, 1);
                setCartDetails(cartDetailsCopy);
            })
            .catch((err) => console.log(err));
    };

    //change quantity
    const inputQuantity = (index, value) => {
        console.log(value);
        let cartDetailsCopy = [...cartDetails];
        cartDetailsCopy[index]['quantity'] = value;
        setCartDetails(cartDetailsCopy);
        updateQuantity(cartDetailsCopy[index]._id, index);
    };

    //to update quantity
    const updateQuantity = (id, index) => {
        let updateData = cartDetails[index];
        fetch(`${url}/cart/updateQuantity/${id}`, {
            method: 'PUT',
            headers: {
                authorization: `bearer ${token.current}`,
                'content-type': 'application/json',
            },
            body: JSON.stringify(updateData),
        })
            .then(() => null)
            .catch((err) => console.log(err));
    };

    return (
        <div className="">
            {/* HEADER FOR USER */}
            <UserNavbar/>

            {/* CART SECTION */}
            <section className="row justify-content-center container-fluid">
                {/* WEBSITE NAME */}
                <h1 className="text-center mt-4 icons fw-bold">CART</h1>

                {/* CART DETAILS */}
                <div className="col-md-5 justify-content-center">
                    {cartDetails.length === 0 ? (
                        <div className="text-center">
                            <h1>No Items Found  :( </h1>
                            <Link to="/user/foods">
                                <button className="add">Buy Something</button>
                            </Link>
                        </div>
                    ) : (
                        cartDetails.map((cartItem, key) => (
                            <div className="flex-container w-auto shadow-lg p-0 my-3 rounded text-center m-5" data-aos="fade-up"  key={key}>
                                <img
                                    alt="food-item-img"
                                    className="img-fluid"
                                    src={`${url}/food/image/${cartItem.food.image}`}
                                    style={{width:'80px',height:'80px',backgroundColor:"var(--pri)"}}
                                />

                                <div className="w-100 m-1 " style={{backgroundColor:"var(--pri)"}}>
                                    <div className="d-flex my-2">
                                        <p
                                            className="mx-5 text-uppercase fw-bold" style={{color:"var(--nav)"}}
                                        >
                                            {cartItem.food.name}
                                        </p>
                                        <button
                                        onClick={() =>
                                            deleteFood(cartItem._id, key)
                                        }
                                        className="bg-danger add"
                                    >
                                        <MdDelete className='mx-0  text-light fs-5'/>
                                    </button>
                                       
                                    </div>

                                    <div
                                        className="flex-container"
                                        style={{
                                            width: '65%',
                                           
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <div className='mx-5'>
                                            <p className='fw-bold' style={{color:"var(--nav)"}}>
                                            Price
                                            </p>
                                            <h1
                                                style={{
                                                    color:"var(--sec)",
                                                    fontFamily: 'monospace',
                                                   
                                                }}
                                            >
                                                &#8377;{cartItem.food.price *
                                                    cartItem.quantity}
                                            </h1>
                                        </div>

                                        <div className="">
                                            <p className='fw-bold' style={{color:"var(--nav)"}}>
                                                Quantity
                                            </p>
                                            {Quantity ? (
                                                <div className="d-flex align-items-center icon">
                                                    <FaMinusCircle
                                                    className='text-danger cursor mx-2'
                                                        onClick={() => {
                                                            let currentQuantity =
                                                                cartItem.quantity -
                                                                1;
                                                            if (currentQuantity > 0) {
                                                                inputQuantity(
                                                                    key,
                                                                    currentQuantity,
                                                                )}
                                                        }}
                                                       
                                                    />
                                                    <span style={{color:"var(--nav)"}}>
                                                        {cartItem.quantity}
                                                    </span>
                                                    <FaPlusCircle
                                                    className='text-success cursor mx-2'
                                                        onClick={() => {
                                                            let currentQuantity =
                                                                cartItem.quantity +
                                                                1;
                                                                if(currentQuantity<=cartItem.food.quantity){
                                                                    inputQuantity(
                                                                key,
                                                                currentQuantity,
                                                            );

                                                                }
                                                            
                                                        }}
                                                       
                                                    />
                                                    <MdDone
                                                    className='text-success cursor mx-1'
                                                        onClick={() =>
                                                            setQuantity(false)
                                                        }
                                                    />
                                                </div>
                                            ) : (
                                                <h1
                                                    style={{
                                                       color:"var(--nav)",
                                                        fontFamily: 'monospace',
                                                  
                                                    }}
                                                >
                                                    <span>
                                                        {cartItem.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            setQuantity(true)
                                                        } 
                                                        className="cursor text-success bg-dark border-0 mx-2"
                                                        >
                                                        <MdEdit/>+
                                                    </button>
                                                </h1>
                                            )}
                                        </div>
                                    </div>

                                   
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* PAYMENT */}
                <div className="col-md-4 shadow-lg p-3 rounded mx-0 my-5 w-50 h-50" data-aos="fade-down" style={{backgroundColor:"none"}}>
                <h2 style={{fontsize:'45px'}} className="my-1 ">Total Amount: Rs. {totalPrice}/- </h2>
                <button
                        
                        className="add mx-4 icons"
                        onClick={() =>
                            navigate('/payment/cart', {
                                state: { cartDetails,totalPrice },
                            })
                        }
                    >
                        Place Order
                    </button>
                {/* <Payment totalamt={totalPrice}></Payment> */}
            </div>
               
            </section>

            {/* FOOTER */}
            <Footer />
        </div>
    );
}

export default Cart;
