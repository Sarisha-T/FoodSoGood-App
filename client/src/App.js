// import packages
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import bootstrap from '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import 'aos/dist/aos.css';
import 'bootstrap'

// import css file
import './index.css';

// importing components
import Home from './pages/Home';
import UserLanding from './pages/UserLanding';
import UserRegister from './pages/UserRegister';
import UserLogin from './pages/UserLogin';
import UserFoods from './pages/UserFoods';
import UserRestaurants from './pages/UserRestaurants';
import Cart from './pages/Cart';
import UserOrders from './pages/UserOrders';
import Payment from './pages/Payment';
import Restaurant from './pages/Restaurant';
import RestaurantRegister from './pages/RestaurantRegister';
import RestaurantLogin from './pages/RestaurantLogin';
import RestaurantFoods from './pages/RestaurantFoods';
import RestaurantOrders from './pages/RestaurantOrders';

// App component
export default function App() {
    //check whether user is logged in
    const UserAuth = ({ children, redirectTo }) => {
        let isAuth = localStorage.getItem('userDetails');

        if (isAuth != null) {
            if (JSON.parse(isAuth).user.role === 'user') {
                return children;
            } else {
                return <Navigate to="/restaurant/orders" />;
            }
        } else {
            return <Navigate to={redirectTo} />;
        }
    };

    //check whether restaurant is logged in
    const RestaurantAuth = ({ children, redirectTo }) => {
        let isAuth = localStorage.getItem('userDetails');

        if (isAuth != null) {
            if (JSON.parse(isAuth).user.role === 'restaurant') {
                return children;
            } else {
                return <Navigate to="/home" />;
            }
        } else {
            return <Navigate to={redirectTo} />;
        }
    };

    // land to page based on which user
    const HomeAuth = () => {
        let user = localStorage.getItem('userDetails');
        if (user !== null) {
            let role = JSON.parse(user).user.role;
            if (role === 'user') {
                return <Navigate to="/home" />;
            } else if (role === 'restaurant') {
                return <Navigate to="/restaurant/orders" />;
            }
        } else {
            return <Home/>;
        }
    };

    //land to page based on which user from landing page
    const UserLandingPageAuth = () => {
        let user = localStorage.getItem('userDetails');
        if (user !== null) {
            let role = JSON.parse(user).user.role;
            if (role === 'user') {
                return <UserLanding />;
            } else if (role === 'restaurant') {
                return <Navigate to="/restaurant/orders" />;
            }
        } else {
            return <Navigate to="/" />;
        }
    };

    return (
        <BrowserRouter>
            {/* INITIALIZE ROUTES*/}

            <Routes>
                <Route path="/" element={<HomeAuth />} />
                <Route path="/user/login" element={<UserLogin/>} />
                <Route path="/user/register" element={<UserRegister/>} />
                <Route path="/restaurant/login" element={<RestaurantLogin />} />
                <Route
                    path="/restaurant/register"
                    element={<RestaurantRegister />}
                />

                <Route path="/home" element={<UserLandingPageAuth />} />
                <Route
                    path="/restaurant/orders"
                    element={
                        <RestaurantAuth redirectTo="/restaurant/login">
                            <RestaurantOrders />
                        </RestaurantAuth>
                    }
                />
                <Route
                    path="/restaurant/foodss"
                    element={
                        <RestaurantAuth redirectTo="/restaurant/login">
                            <RestaurantFoods />
                        </RestaurantAuth>
                    }
                />
                <Route
                    path="/user/foods"
                    element={
                        <UserAuth redirectTo="/user/login">
                            <UserFoods />
                        </UserAuth>
                    }
                />
                <Route
                    path="/restaurantslist"
                    element={
                        <UserAuth redirectTo="/user/login">
                            <UserRestaurants />
                        </UserAuth>
                    }
                />
                <Route
                    path="/user/cart"
                    element={
                        <UserAuth redirectTo="/user/login">
                            <Cart />
                        </UserAuth>
                    }
                />
                <Route
                    path="/user/orders"
                    element={
                        <UserAuth redirectTo="/user/login">
                            <UserOrders />
                        </UserAuth>
                    }
                />
                <Route
                    path="/payment/:id"
                    element={
                        <UserAuth redirectTo="/user/login">
                            <Payment />
                        </UserAuth>
                    }
                />
                <Route
                    path="/user/restaurant/:id"
                    element={
                        <UserAuth redirectTo="/user/login">
                            <Restaurant />
                        </UserAuth>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

// url
export const url = 'http://localhost:8000';
