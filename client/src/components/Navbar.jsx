// import packages
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineLogout } from "react-icons/ai";
import { TiShoppingCart } from "react-icons/ti";
import {  ImSwitch,ImClipboard,ImSpoonKnife} from "react-icons/im";

// navbar for user
function UserNavbar() {
    // get userdata
    const userData = JSON.parse(localStorage.getItem('userDetails')).user;
    

    // navigate function
    const navigate = useNavigate();

    return (
    <>
        <nav className="navbar navbar-expand-lg back shadow-lg p-1">
            <div className='container'>
                 {/* Webpage TITLE */}
                <Link to="/home">
                    <a className="navbar-brand front">
                        FoodSoGood
                    </a>
                </Link>

                {/* NAV LINKS*/}
                <ul className='navul navbar-nav ml-auto'>
                        <Link className="nav-l nav-link front" style={{color:'var(--nav)'}} to="/user/foods">
                            <li className='icons mx-1'><ImSpoonKnife/></li>
                            <li className='text-center' style={{fontSize:'.7rem'}}>FOODS</li>
                        </Link>
                        <Link className="nav-l nav-link front" style={{color:'var(--nav)'}} to="/user/orders">
                            <li className='icons mx-2'><ImClipboard/></li>
                            <li className='text-center' style={{fontSize:'.7rem'}}> <span className='text-uppercase'>{userData?.username}'s </span><br></br>ORDERS</li>
                        </Link>
                        <Link className="nav-l nav-link front" style={{color:'var(--nav)'}} to="/user/cart">
                            <li className='icons mx-2'><TiShoppingCart/></li>
                            <li className='text-center' style={{fontSize:'.7rem'}}>CART</li>
                        </Link>
                    <li className="nav-item nav-link front cursor icons"
                            onClick={() => {
                                localStorage.removeItem('userDetails');
                                navigate('/user/login');
                            }}
                            style={{ cursor: 'pointer' }}
                            >
                            <ImSwitch className='mx-1' style={{color:'white'}}/>
                            <li className='text-center' style={{fontSize:'.7rem'}}>LOGOUT</li>
                        </li>
                   
                 </ul>
            </div>
        </nav>
        
    </>
 );
}

//navbar for restaurant
function RestaurantNavbar() {
    // get userdata
    const userData = JSON.parse(localStorage.getItem('userDetails')).user;

    // navigate function 
    const navigate = useNavigate();
     return (
        <>
            <nav className="navbar navbar-expand-lg back shadow-lg p-1">
                <div className='container'>
                     {/* Webpage TITLE */}
                    <Link to="/home">
                        <h1 className="navbar-brand">
                        FoodSoGood
                        </h1>
                    </Link>

                    {/* NAV LINKS */}
                    <ul className='navul navbar-nav ml-auto'>
                        <Link className="nav-l nav-link front" style={{color:'var(--nav)'}} to="/restaurant/orders">
                            <li className='icons mx-2'><ImClipboard/></li>
                            <li className='text-center' style={{fontSize:'.7rem'}}>ORDERS</li>
                        </Link>
                        <Link className="nav-l nav-link front" style={{color:'var(--nav)'}} to="/restaurant/foodss">
                            <li className='icons mx-1'><ImSpoonKnife/></li>
                            <li className='text-center' style={{fontSize:'.7rem'}}>{(userData.restaurantName).toUpperCase()}'s</li>
                        
                        </Link>
                    
                        <li className="nav-item nav-link front cursor icons"
                            onClick={() => {
                                localStorage.removeItem('userDetails');
                                navigate('/restaurant/login');
                            }}
                            style={{ cursor: 'pointer' }}
                            >
                            <ImSwitch className='mx-1' style={{color:'white'}}/>
                            <li className='text-center' style={{fontSize:'.7rem'}}>LOGOUT</li>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    );
}

export { UserNavbar, RestaurantNavbar };
