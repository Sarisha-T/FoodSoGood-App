// import packages
import { useEffect, useRef, useState } from 'react';

// import icons
import { MdDone, MdClose } from 'react-icons/md';

// import component
import { RestaurantNavbar } from '../components/Navbar';

// import URL
import { url } from '../App';

//restaurant order component
function RestaurantOrders() {
    //get user details
    const token = useRef(JSON.parse(localStorage.getItem('userDetails')).token);
    const restaurant = useRef(
        JSON.parse(localStorage.getItem('userDetails')).user,
    );

    //state variables
    const [allOrders, setAllOrders] = useState([]);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        //fetch all orders of that restaurant
        fetch(`${url}/restaurant/orders/${restaurant.current._id}`, {
            method: 'GET',
            headers: { authorization: `bearer ${token.current}` },
        })
            .then((res) => res.json())
            .then((data) => {
                data.reverse();
                setAllOrders(data);
                setOrders(data);
            })
            .catch((err) => console.log(err));
    }, []);

    //function to approve an order
    const orderApprove = (id, index) => {
        fetch(`${url}/order/orderstate/${id}`, {
            method: 'PUT',
            headers: {
                authorization: `bearer ${token.current}`,
                'content-type': 'application/json',
            },
            body: JSON.stringify({ orderStatus: 'approved' }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    let ordersCopy = [...orders];
                    ordersCopy[index].orderStatus = 'approved';
                    setOrders(ordersCopy);
                }
            })
            .catch((err) => console.log(err));
    };

    //to reject orders
    const orderReject = (id, index) => {
        let food = orders[index].food._id;
        let quantity = orders[index].quantity;
        console.log(quantity);
        fetch(`${url}/order/orderstate/${id}`, {
            method: 'PUT',
            headers: {
                authorization: `bearer ${token.current}`,
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                orderStatus: 'rejected',
                food: food,
                quantity: quantity,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    let ordersCopy = [...orders];
                    ordersCopy[index].orderStatus = 'rejected';
                    setOrders(ordersCopy);
                }
            })
            .catch((err) => console.log(err));
    };

    //to display orders according to each message state
    const filterOrder = (value) => {
        console.log(allOrders);
        if (value === 'all') {
            setOrders(allOrders);
        } else if (value === 'processing') {
            let ordersCopy = [...allOrders];
            let filteredData = ordersCopy.filter(
                (order) => order.orderStatus === 'processing',
            );
            setOrders(filteredData);
        } else if (value === 'rejected') {
            let ordersCopy = [...allOrders];
            let filteredData = ordersCopy.filter(
                (order) => order.orderStatus === 'rejected',
            );
            setOrders(filteredData);
        } else if (value === 'approved') {
            let ordersCopy = [...allOrders];
            let filteredData = ordersCopy.filter(
                (order) => order.orderStatus === 'approved',
            );
            setOrders(filteredData);
        }
    };

    return (
        <div className="">
            {/* navbar */}
            <RestaurantNavbar/>
            <section className="row justify-content-center m-4">
                <div className="">
                    <h1 className="text-center icons my-2">Orders Received</h1>

                    <div className='d-flex justify-content-center'>
                        
                        <select onChange={(event) =>
                                filterOrder(event.target.value)
                                
                            }
                            id="order"
                            className='add icons bg-success'>
                                
                            <option value="all" className='bg-success'>All Orders</option>
                            <option value="processing" className='bg-warning' >Processing</option>
                            <option value="approved" className='bg-success'>Approved</option>
                            <option value="rejected" className='bg-danger'>Rejected</option>
                        </select>
                    </div>
                </div>

                {/* order */}
                <div className="col-md-6 justify-content-center">
                    {orders.length === 0 ? (
                        <div>
                             <h1>No Items Found :( </h1>
                        </div>
                    ) : (
                        orders.map((order, key) => (
                            <div className=" "  style={{backgroundColor:"var(--pri)",color:"var(--sec)",borderRadius:"20px"}} key={key}>
                                <div className="d-flex mt-2 pt-3 w-100">
                                    <div className='text-left w-100 m-1'>
                                    <img
                                        src={`${url}/food/image/${order.food?.image}`}
                                        alt="order-img"
                                        className="img-fluid"
                                        style={{width:"60px",height:"60px"}}
                                    />

                                    
                                        <p className='m-0 ' style={{textTransform: 'uppercase'}}>
                                            {order.food?.name}
                                        </p></div>
                                        <div className='text-left w-100 m-1'>
                                            <p>Username:{' '}{order.user.username}
                                              
                                            </p>
                                            <p>Address :{' '}{order.user.address}</p>
                                            <div>
                                                <p>Email : {' '}{order.user.email}</p>

                                                <p>Mobile :{' '}{order.user.mobile}</p>
                                            </div>
                                        </div>

                                        <div className='text-left w-100 m-1'>
                                            <p>
                                                Quantity:{' '}{order.quantity}
                                            </p>
                                            <p>
                                                Status:{' '}
                                                <span
                                                    style={{
                                                        fontFamily: 'monospace',
                                                        textTransform:'uppercase',
                                                    }}
                                                >
                                                    {order.orderStatus}
                                                </span>
                                            </p>
                                            
                                            <p>Ordered at : {new Date(order.createdAt,).toLocaleTimeString()}{' '}</p>
                                            <p> Ordered on : {new Date(order.createdAt,).toLocaleDateString()}</p>
                                        </div>
                                    

                                    {order.orderStatus === 'processing' ? (
                                        <div className="d-flex h-25">
                                            <button
                                                onClick={() =>
                                                    orderApprove(order._id, key)
                                                }
                                                className="bg-success text-light icon border-0 mx-2"
                                            >
                                                <MdDone/>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    orderReject(order._id, key)
                                                }
                                                className="bg-danger text-light icon border-0 mx-2"
                                            >
                                                <MdClose
                                                    style={{
                                                        fontSize: '18px',
                                                    }}
                                                />
                                            </button>
                                        </div>
                                    ) : null}
                                </div>  
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}

export default RestaurantOrders;
