// import packages
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos'

// import icons
import { MdDelete } from 'react-icons/md';

// import components
import { UserNavbar  } from '../components/Navbar';
import Footer from '../components/Footer';

// import URL
import { url } from '../App';
//initialize animation on scroll
AOS.init();

//Orders component
function UserOrders() {
    //get and store user details
    let token = useRef(JSON.parse(localStorage.getItem('userDetails')).token);
    let user = useRef(JSON.parse(localStorage.getItem('userDetails')).user);

    // state variables
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        //get all the orders placed by the user 
        fetch(`${url}/user/orders/${user.current._id}`, {
            headers: { authorization: `bearer ${token.current}` },
        })
            .then((res) => res.json())
            .then((data) => {
                data.reverse();
                setOrders(data);
            })
            .catch((err) => console.log(err));
    }, []);

//to cancel order
    const cancelOrder = (id, index) => {
        fetch(`${url}/order/cancelorder/${id}`, {
            method: 'DELETE',
            headers: { authorization: `bearer ${token.current}` },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    let tempData = [...orders];
                    tempData.splice(index, 1);
                    setOrders(tempData);
                }
            })
            .catch((err) => console.log(err));
    };

    return (
        <div>
            {/* navbar for user */}
            <UserNavbar/>

            {/*orders section */}
            <section className="row justify-content-center m-4">
                {/* page title */}
                <h1 className="text-center">My Orders</h1>

                {/* orders list  */}
                <div className="col-md-6 justify-content-center">
                    {orders.length === 0 ? (
                        <div className="text-center">
                            <h1>Nothing Found :( </h1>
                            <Link to="/user/foods">
                                <button
                                    className="add">
                                    Order
                                </button>
                            </Link>
                        </div>
                    ) : (
                        orders.map((order, key) => {
                           return  (<div className="cancel d-flex mt-2 pt-3 w-100"  style={{backgroundColor:"var(--pri)",color:"var(--sec)",borderRadius:"20px"}} key={key}>
                                {order.orderStatus === 'processing' ? (
                                    <button 
                                        onClick={() =>
                                            cancelOrder(order._id, key)
                                        }
                                        className="text-left h-25 w-50 m-1 shadow-none text-warning mx-3 p-1"
                                        style={{backgroundColor:"transparent"}}
                                    >
                                        X Cancel Order
                                    </button>
                                ) : null}

                            

                                <div className="text-left w-100 m-1 mx-3" data-aos="zoom-in"> 
                                <img
                                    alt="foodimg"
                                    className="img-fluid"
                                    src={`${url}/food/image/${order.food.image}`}
                                    style={{
                                            width:"60px",height:"60px"
                                    }}/>
                                    <p className='m-0 ' style={{textTransform: 'uppercase'}}>{order.food.name}{' '}</p>
                                        <p ><span className='m-0 p-0'>From{' '}</span>
                                        <span>{order.restaurant.restaurantName}</span>
                                    </p>
                                    </div>

                                    <div className='text-left w-100 m-1'>
                                    <p className=''>
                                        {order.user.address}
                                    </p></div>

                                    <div className='text-left w-100 m-1'>
                                        <p>
                                            Quantity :
                                            <span style={{fontFamily: 'monospace',}}>
                                                {order.quantity}
                                            </span>
                                        </p>

                                        <p>
                                            Price:{' '}
                                            <span>
                                                {order.food.price *
                                                    order.quantity}
                                            </span>
                                        </p>

                                        <p className='d-flex '>Status:- {'  '}
                                            <span className='m-0 p-0'>
                                                {order.orderStatus}
                                            </span>
                                        </p>
                                    </div>
                                
                            </div>)}
                        ))
                    }
                </div>
            </section>

            {/* footer */}
            <Footer />
        </div>
    );
}

export default UserOrders;
