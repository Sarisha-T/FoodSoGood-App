// import packages
import { useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import StripeCheckout from "react-stripe-checkout";

// import Component
import { UserNavbar  } from '../components/Navbar';

// import URL
import { url } from '../App';

// Payment component
function Payment() {
    //GET USER DATA
    let token = useRef(JSON.parse(localStorage.getItem('userDetails')).token);
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem('userDetails')).user,
    );

    //state variables
    const [quantity, setQuantity] = useState(1);

    const navigate = useNavigate();
    let cartDetails = useLocation().state.cartDetails;
    let totalPrice = useLocation().state.totalPrice;
    let foodItemData = useLocation().state.food;
    const params = useParams();

    //to change user details from input 
    const readValue = (property, value) => {
        let tempUser = { ...user };
        tempUser[property] = value;
        let tempData = JSON.parse(localStorage.getItem('userDetails'));
        tempData.user = tempUser;
        localStorage.setItem('userDetails', JSON.stringify(tempData));
        setUser(tempUser);
    };

    //place order function
    const placeOrder = (event) => {
        event.preventDefault();
        fetch(`${url}/user/update/${user._id}`, {
            method: 'PUT',
            headers: {
                authorization: `bearer ${token.current}`,
                'content-type': 'application/json',
            },
            body: JSON.stringify(user),
        })
            .then((res) => res.json())
            .then(() => {
                if (params.id === 'cart') {
                    let data = { cartItems: cartDetails,totalPrice:totalPrice };
                    fetch(`${url}/cart/checkOut`, {
                        method: 'POST',
                        headers: {
                            authorization: `bearer ${token.current}`,
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            if (data.success) {
                                navigate('/user/orders');
                            }
                        })
                        .catch((err) => console.log(err));
                } else {
                    let restaurant = { ...foodItemData['restaurant'] };
                    let food = { ...foodItemData };
                    food.restaurant = food.restaurant._id;

                    fetch(`${url}/order/neworder`, {
                        method: 'POST',
                        headers: {
                            authorization: `bearer ${token.current}`,
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify({
                            user: user,
                            food,
                            restaurant,
                            quantity,
                        }),
                    })
                        .then((res) => res.json())
                        .then((data) =>
                            data.success
                                ? navigate('/user/orders')
                                : null,
                        )
                        .catch((err) => console.log(err));
                }
            })
            .catch((err) => console.log(err));
    };

    return (
        <div className="">
            {/* USER NAVBAR */}
            <UserNavbar/>

            {/* PAYMENT SECTION */}
            <section className="row justify-content-center mt-5 mx-4">
                <div className="col-md-5 mt-5 text-left shadow-lg p-3 mb-5 bg-body rounded">
                    {/* SECTION TITLE */}
                    <h1 className="text-center m-3">User Details Confirmation</h1>

                    {/* CONFIRM ORDER */}
                    <form onSubmit={(event) => placeOrder(event)}>
                        {/* TO UPDATE USER DETAILS */}
                        <div className='d-flex justify-content-around'>
                        <h1 className='w-50 py-0'>Mobile :</h1>
                            <input 
                          
                            onChange={(event) =>
                                readValue('mobile',event.target.value)
                            }
                           
                            type="number"
                            className="form-control"
                            placeholder="Enter Mobile Number"
                            value={user?.mobile}
                            required
                        /></div>
                        <div className='d-flex justify-content-around' >
                            <h1 className='w-50 py-0'>Address : </h1>
                        <textarea
                            minLength="10"
                            className="form-control my-1"
                            type="text"
                            placeholder="Enter Address"
                            value={user?.address}
                            onChange={(event) =>
                                readValue('address', event.target.value)
                            }
                            required
                        /></div>
                          {/* to set desired quantity */}
                        {params.id !== 'cart' ? (
                            <div className='d-flex justify-content-around' >
                                <h1 className='w-50 py-0'>Quantity :
                                <br></br><span className='fs-6'>Instock : {foodItemData.quantity}</span> </h1>
                            <input
                                type="number"
                                placeholder="Enter Quantity"
                                className="form-control"
                                value={quantity}
                                required
                                onChange={(event) =>{
                                    if(event.target.value !==null && event.target.value<=foodItemData.quantity ){
                                        setQuantity(event.target.value)
                                    }}
                                    
                                    
                                }
                            />
                            </div>
                        ) : null}

                        {/* CHECKOUT */}
                        <button type="submit" className="add mt-3 mb-3">
                        <StripeCheckout 
                          name="FoodSoGood" // header title
                          description="You deserve some Good Food!" //header subtitle
                        
                          amount={totalPrice * 100} //amount will be converted to cents so convert to 100
                          email={user.email}
                          token={token.current}
                          currency="INR"
                          stripeKey="pk_test_51MgQYwSHRYkjENZzASpcA2F9XeaDHuDMyKCFhbje7NjGqT9vJh6Dw3LDisSVwwnME25M96AFFzZPDyUn6LvCVCvu005jgvB3UC"
                        >
                            <button  className="add my-2 py-2 justify-content-center">
                            UPDATE AND PAY NOW
                            </button>
                        </StripeCheckout>
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}

//export
export default Payment;
