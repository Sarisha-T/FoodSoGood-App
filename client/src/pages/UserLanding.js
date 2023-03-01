// import packages
import { Link } from 'react-router-dom';

//import components
import { UserNavbar  } from '../components/Navbar';
import Foodcard from "../components/Foodcard";
import RestaurantCard from '../components/RestaurantCard';
import Footer from '../components/Footer';

import AOS from 'aos'
//initialize animation on scroll
AOS.init()


//user landing page 
function UserLanding() {
    return (
        <div>
            {/* navbar */}
            <UserNavbar/>

   {/*Foods section */}
  
   <section className="container">
               
                <div className="row mx-7 d-flex justify-content-center mt-5" >
                   <Foodcard/>
                   <div className='d-flex justify-content-center '  style={{backgroundColor:"var(--pri)",borderRadius:"0px 0px 20px 20px "}}>
                   <Link className='mb-3 m-0'  to="/user/foods">
                        <button className='add icons text-light shadow-lg p-2'  data-aos="zoom-in" style={{ cursor: 'pointer', border:"1px solid white" }}>
                            SEE ALL FOODS!!!
                        </button>
                    </Link></div>
                </div>
        </section>

            {/* Restaurants section */}
            <section className="container">
                <div className="row mx-7 d-flex justify-content-center">
                  <RestaurantCard/>
                  <div className='d-flex justify-content-center m-0 mb-5 ' style={{backgroundColor:"var(--pri)",borderRadius:"0px 0px 20px 20px "}}>
                  <Link  className='mb-3 ' to="/restaurantslist">
                        <button className='add icons text-light shadow-lg p-2' data-aos="zoom-in" style={{ cursor: 'pointer', color: 'var(--header)',border:"1px solid white" }}>
                            View Restaurants
                        </button>
                    </Link></div>
                </div>
            </section>
            {/* footer */}
            <Footer />
        </div>
    );
}

export default UserLanding;
