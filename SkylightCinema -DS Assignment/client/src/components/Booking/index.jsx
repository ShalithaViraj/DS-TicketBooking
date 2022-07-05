import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

import AlertMsg from '../common/AlertMsg';

const Booking = (props) => {
    const { objMovie } = props;

    const [intCount, setCount] = useState(1);
    const [objSelectTheater, setTheater] = useState({});

    const fnClear = () => {
        setCount(1);
        setTheater({});
    };

    const MovieTheater = ({ objTheater }) => {
        return <>
            <div className="col-md-12 m-0 p-0 mt-3">
                <span class="badge badge-dark p-2 w-100" style={{ fontSize: '18px' }}>
                    <i class="fa fa-map-marker mr-2" /> 
                    {objTheater.strTheaterLocation + " (Ticket Price: LKR " + objTheater.dblAmount + " /= )"}
                </span>
            </div>
            <div className="col-md-12 m-0 p-0 mt-3">
                {
                    objTheater.arrTimeSlots.map((strTime) => (
                        <span className=" ml-2 p-2 badge badge-pill badge-success" onClick={() => fnSetTheater(objTheater, strTime)}>{strTime}</span>
                    ))
                }
            </div>
        </>
    };

    const fnSetTheater = (objTheater, strTime) => {
        let objEditTheater = { ...objTheater};
        delete objEditTheater.arrTimeSlots;
        objEditTheater.strTimeSlot = strTime;
        setTheater(objEditTheater);
    }

    const PriceDetails = () => {
        return <div className="col-md-12 m-0 p-0">
                    <h5 className='font-weight-bold d-flex justify-content-center h4'>Ticket Price Details</h5>
            <div className="card w-100">
                <div className="card-body">
                    <h5 className='font-weight-bold d-flex justify-content-center h2'>
                        { objSelectTheater.strTheaterCode ? "LKR " + (objSelectTheater.dblAmount * intCount).toFixed(2) + " /=" : "Please select theater to continue reservation..." }
                    </h5>
                    <div className="row d-flex justify-content-center">
                        <div className="col-md-4">
                            <div className="d-flex align-items-center mt-2 p-0 m-0">
                                <button className='btn btn-success font-weight-bold w-50' onClick={() => { setCount(intCount + 1) }}> <i className="fa fa-plus-circle" /> </button>
                                <button className='btn btn-secondary font-weight-bold w-100' disabled> {intCount} </button>
                                <button className='btn btn-danger font-weight-bold w-50' onClick={() => { intCount == 1 ? setCount(1) : setCount(intCount - 1) }}> <i className="fa fa-minus-circle" /> </button>
                            </div>
                        </div>
                    </div>
                    <div className="row d-flex justify-content-center mt-3">
                        <button className='col-md-6 btn btn-primary font-weight-bold w-100' onClick={() => fnAddToCart()}> Add To Cart </button>
                    </div>
                </div>
            </div>
        </div>
    };

    const fnAddToCart = async () => {
        if(!objSelectTheater.strTheaterCode) { AlertMsg(false, "Please select theater and time slot!") }
        else {
            try {
                const resCart = await axios.post('http://localhost:5000/api/cart/addCart', {
                    objCartDetails: {
                        strMovieCode: objMovie.strMovieCode,
                        intTicketCount: intCount,
                        strTheaterCode: objSelectTheater.strTheaterCode,
                        strTimeSlot: objSelectTheater.strTimeSlot
                    }
                }, {
                    headers: {
                        'auth-token': JSON.parse(localStorage.getItem('objUser')).strToken
                    }
                });
                AlertMsg(resCart.data.booStatus, resCart.data.objResponse);
                fnClear();
                props.onHide(true);
            } catch (err) {
                fnClear();
                AlertMsg(false, err.response.data.objResponse);
            }
        }
    };

    return <Modal
        {...props}
        size="xl"
        backdrop="static"
        aria-labelledby="contained-modal-title-vcenter"
        centered
    >
        <Modal.Body>
            {
                objMovie.arrTheaters && <>
                    <div className="row m-0 p-0 justify-content-center">
                        <div className="col-md-12 m-0 p-0 text-center">
                            <span className='font-weight-bold h4'>Movie Details</span>
                            <span className='font-weight-bold h4 text-danger float-right'><i className="fa fa-times-circle" onClick={() => { props.onHide(); fnClear(); }} /></span>
                        </div>
                    </div>
                    <div className="row m-0 p-0">
                        <div className="col-md-4 m-0 p-0">
                            <div className="m-2 p-0" style={{ width: '278px' }}>
                                <div className="card m-0 p-0">
                                    <img className="card-img-top card-movie-poster m-0 p-0" src="http://localhost:5000/MoviePosters/MOV2548578-poster.jpg" alt="Movie Poster" />
                                    <div className="card-body">
                                        <h5 className="card-title">{objMovie.strMovieName}</h5>
                                        <p className="card-text">{objMovie.strMovieDesc}</p>
                                        <div className="d-flex align-items-center">
                                            <p className="card-text font-weight-bold"><i className="fa fa-clock-o text-success mr-2" aria-hidden="true" /> {objMovie.strMovieRunTime} </p>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <p className="card-text font-weight-bold"><i className="fa fa-star text-primary mr-2" aria-hidden="true" /> {objMovie.strMovieIMDB} </p>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <p className="card-text font-weight-bold" onClick={() => window.open(`${objMovie.strMovieTrailer}`, '_blank')}>
                                                <i className="fa fa-youtube-play text-danger mr-2" aria-hidden="true" /> Watch Trailer
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8 m-0 p-0 mt-2">
                            <h5 className='font-weight-bold d-flex justify-content-center h4'>Theater Details</h5>
                            <div className="row m-0 p-0">
                                {
                                    objMovie.arrTheaters.map((obj) => <MovieTheater objTheater={obj} id={obj.strTheaterLocation} />)
                                }
                            </div>
                            <div className="row m-0 p-0 mt-4">
                                <PriceDetails />
                            </div>
                        </div>
                    </div>
                </>
            }
        </Modal.Body>
    </Modal>
}

export default Booking;