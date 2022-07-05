import { useEffect, useState } from 'react';

import Logo from './logo.png';
import './Header.css';

import User from '../../User';
import Cart from '../../Cart';
import BookingDetails from '../../BookingDetails';

const Header = () => {
    const [isReserShow, setReserShow] = useState(false);
    const [isCartShow, setCartShow] = useState(false);
    const [isUserSectionShow, setUserSectionShow] = useState(false);
    const [isLogged, setLogged] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('objUser')) { setLogged(true); }
    }, []);

    return (
        <>
            <BookingDetails show={isReserShow}  onHide={() => setReserShow(false)} />
            <Cart show={isCartShow}  onHide={() => setCartShow(false)} />
            <User show={isUserSectionShow} onHide={() => setUserSectionShow(false)} />
            <div className="row m-0 p-1 header-background">
                <div className="col-md-2">
                    <img src={Logo} width="125" height="45" alt="Logo" />
                </div>
                <div className="col-md-7"></div>
                <div className="col-md-3 mt-1">
                    {
                        isLogged
                            ? <>
                                <span className="badge badge-warning mt-2 float-right" onClick={() => { localStorage.removeItem('objUser'); window.location.reload(); }}>Log Out</span>
                                <span className='text-white font-weight-bold float-right mt-1 ml-2 mr-2' style={{ fontSize: '18px' }}>
                                    Hi, {JSON.parse(localStorage.getItem('objUser')).strUserName}
                                </span>
                                <span className="badge badge-primary mt-2 float-right ml-2" onClick={() => setCartShow(true)}><i className="fa fa-shopping-cart" /></span>
                                <span className="badge badge-secondary mt-2 float-right" onClick={() => setReserShow(true)}><i className="fa fa-user" /></span>
                            </>
                            : <button className="btn btn-signin btn-block font-weight-bold" onClick={() => setUserSectionShow(true)}>
                                Sign In/ Register
                            </button>
                    }
                </div>
            </div>
        </>

    )
}

export default Header;