// import packages
import { Link } from 'react-router-dom';

//homepage component
function Home() {
    return (
        <div className="mainn">
            {/* PAGE TITLE */}
             <nav className="text-center">
                    <h1 className="navbar-brand mt-4">
                        FoodSoGood
                    </h1>
                </nav>
            <div className=" d-flex mt-5 justify-content-center ">
                {/* HOMEPAGE NAVIGATIONS */}
                     {/* FOR USER */}
                    <div className="choice-card shadow-lg" style={{backgroundColor:"var(--transparent)"}}>
                        <div className="">
                            
                            <h1 className='icons'>
                                User account Login
                            </h1>
                            <Link to="/user/login">
                                <button className="add mt-3 mb-3 icons">
                                    Lets EAT!
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* FOR RESTAURANTS */}
                    <div className="choice-card shadow-lg" style={{backgroundColor:"var(--transparent)"}}>
                        <div className="background">
                             <h1 className='icons'>
                                Business account Login
                            </h1>
                            <Link to="/restaurant/login">
                                <button className="add mt-3 mb-3 icons">Join Business</button>
                            </Link>
                        </div>
                    </div>
                
            </div>
        </div>
    );
}

export default Home;
