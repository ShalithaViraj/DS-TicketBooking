import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

import AlertMsg from '../common/AlertMsg';
import GridFunctions from '../common/Grid/GridFunctions';
import Payment from '../Payment';

const Cart = (props) => {

    const [isPaymentShow, setPaymentShow] = useState(false);
    const [intCount, setCount] = useState(1);
    const [objSelectMovie, setSelectMovie] = useState({});
    const [showUpdateTicketCount, setUpdateTicketCount] = useState(false);
    const [arrCart, setCart] = useState([]);
    const [objPay, setPay] = useState({
        strDesc: "",
        dblAmount: 0,
    })

    useEffect(() => {
        fetchCartDetails();
    }, [props.show]);

    const cartColumns = [
        {
            name: "Movie Name",
            grow: 1.5,
            selector: "strMovieName",
        },
        {
            name: "Ticket Qty",
            grow: 0.2,
            selector: "intTicketCount",
        },
        {
            name: "Total Price",
            grow: 0.2,
            selector: "dblAmount",
        },
        {
            name: "Theater Name",
            grow: 0.6,
            selector: "strTheaterName",
        },
        {
            name: "Theater Location",
            grow: 0.8,
            selector: "strTheaterLocation",
        },
        {
            name: "Time Slot",
            grow: 0.2,
            selector: "strTimeSlot",
        },
        {
            name: "Action",
            grow: 0.8,
            cell: (row) => (
                <>
                    <button
                        className="btn btn-sm btn-warning m-0 p-2"
                        onClick={() => { setSelectMovie(row); setUpdateTicketCount(true); setCount(row.intTicketCount); }}
                    >
                        <i className="fas fa-edit" />
                    </button>
                    <button
                        className="btn btn-sm btn-danger m-0 p-2 ml-2"
                        onClick={() => { setSelectMovie(row); fnDelete();}}
                    >
                        <i className="fas fa-trash" />
                    </button>
                </>
            ),
        },
    ];

    const fetchCartDetails = async () => {
        if(props.show) {
            try {
                const resCart = await axios.get('http://localhost:5000/api/cart/getCart', {
                    headers: {
                        'auth-token': JSON.parse(localStorage.getItem('objUser')).strToken
                    }
                });
                if (resCart.data.booStatus) {
                    setCart(resCart.data.objResponse);
                } else { AlertMsg(false, resCart.data.objResponse) }
            } catch (err) {
                AlertMsg(false, err.response.data.objResponse);
            }
        }
    };

    const fnClear = () => {
        setCart([]);
        setUpdateTicketCount(false);
        setSelectMovie({});
        setCount(1);
        setPay({
            strDesc: "",
            dblAmount: 0,
        });
    };

    const UpdateTicketCount = () => {
        return (
            <Modal
                show={showUpdateTicketCount}
                size="md"
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body>
                    {
                        <>
                            <div className="row m-0 p-0 justify-content-center">
                                <div className="col-md-12 m-0 p-0 text-center">
                                    <span className='font-weight-bold h4'>Update Ticket Count Details</span>
                                    <span className='font-weight-bold h4 text-danger float-right'><i className="fa fa-times-circle" onClick={() => { setUpdateTicketCount(false); }} /></span>
                                </div>
                            </div>
                            <div className="row m-0 p-0 col-md-12 d-flex justify-content-center">
                                <div className="col-md-12 m-0 p-0 text-center">
                                    <input type="text" className='form-control form-control-sm text-center font-weight-bold' value={intCount} name="intCount" id="intCount" disabled />
                                </div>
                            </div>
                            <div className="row d-flex justify-content-center">
                                <div className="col-md-8">
                                    <div className="d-flex align-items-center mt-2 p-0 m-0">
                                        <button className='btn btn-success font-weight-bold w-50' onClick={() => { setCount(intCount + 1) }}> <i className="fa fa-plus-circle" /> </button>
                                        <button className='btn btn-primary font-weight-bold w-100' onClick={() => fnUpdate()}> Update </button>
                                        <button className='btn btn-danger font-weight-bold w-50' onClick={() => { intCount == 1 ? setCount(1) : setCount(intCount - 1) }}> <i className="fa fa-minus-circle" /> </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                </Modal.Body>
            </Modal>
        )
    };

    const fnUpdate = async () => {
        try {
            const resCart = await axios.put('http://localhost:5000/api/cart/editCart', {
                strMovieCode: objSelectMovie.strMovieCode,
                intTicketCount: intCount,
                strTimeSlot: objSelectMovie.strTimeSlot
            }, {
                headers: {
                    'auth-token': JSON.parse(localStorage.getItem('objUser')).strToken
                }
            });
            AlertMsg(resCart.data.booStatus, resCart.data.objResponse);
            setCount(1);
            setUpdateTicketCount(false);
            setSelectMovie({});
            fetchCartDetails();
        } catch (err) {
            fnClear();
            AlertMsg(false, err.response.data.objResponse);
        }
    };

    const fnDelete = async () => {
        try {
            const resCart = await axios.delete('http://localhost:5000/api/cart/deleteCart', {
                headers: {
                    'auth-token': JSON.parse(localStorage.getItem('objUser')).strToken
                }
            }, {
                strMovieCode: objSelectMovie.strMovieCode,
                strTimeSlot: objSelectMovie.strTimeSlot
            });
            AlertMsg(resCart.data.booStatus, resCart.data.objResponse);
            setSelectMovie({});
            fetchCartDetails();
        } catch (err) {
            fnClear();
            AlertMsg(false, err.response.data.objResponse);
        }
    };

    const fnPayment = () => {
        if(arrCart.length > 0) {
            const dblAmount = arrCart.reduce((acc, obj) => { return acc + obj.dblAmount }, 0);
            setPay({
                strDesc: `Total Amount : USD ${(dblAmount/300).toFixed(2)} (LKR ${dblAmount.toFixed(2)} /= , 1USD = LKR300)`,
                dblAmount: (dblAmount/300).toFixed(2),
            });
            setPaymentShow(true);
        } else { AlertMsg(false, "Please add tickets to cart!") }
    };

    const fnReservation = async (resPayment) => {
        setPaymentShow(false);
        const arrMovieReservation = arrCart.map((obj) => {
            return {
                strMovieCode: obj.strMovieCode,
                intTicketCount: obj.intTicketCount,
                dblAmount: obj.dblAmount,
                strTheaterCode: obj.strTheaterCode,
                strTimeSlot: obj.strTimeSlot
            }
        });

        try {
            const resReservation = await axios.post('http://localhost:5000/api/reservation/addReservation', {
                arrMovieReservation: arrMovieReservation,
                objPaymentDetails: { ...resPayment.payer, ...resPayment.purchase_units[0] }
            }, {
                headers: {
                    'auth-token': JSON.parse(localStorage.getItem('objUser')).strToken
                }
            });
            AlertMsg(resReservation.data.booStatus, resReservation.data.objResponse);
            setTimeout(() => {
                props.onHide(true);
                fnClear();
            }, 250);
        } catch (err) {
            AlertMsg(false, err.response.data.objResponse);
        }

        
    };

    return <>
        {UpdateTicketCount()}
        <Payment 
            show={isPaymentShow}  
            onHide={() => setPaymentShow(false)} 
            desc={objPay.strDesc}
            dblAmount= {objPay.dblAmount}
            fnCallBack={(resPayment) => fnReservation(resPayment)}
        />
        <Modal
            {...props}
            size="xl"
            backdrop="static"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body>
                {
                    <>
                        <div className="row m-0 p-0 justify-content-center">
                            <div className="col-md-12 m-0 p-0 text-center">
                                <span className='font-weight-bold h4'>Cart Details</span>
                                <span className='font-weight-bold h4 text-danger float-right'><i className="fa fa-times-circle" onClick={() => { fnClear(); props.onHide(); }} /></span>
                            </div>
                        </div>
                        <div className="row m-0 p-0 col-md-12">
                            <div className="col-md-12 m-0">
                                <GridFunctions
                                    title="Movie Cart Details"
                                    columns={cartColumns}
                                    dataSet={arrCart}
                                    strHeight={"45vh"}
                                />
                            </div>
                        </div>
                        <div className="row m-0 p-0 col-md-12">
                            <div className="col-md-12 m-0">
                                <button className='btn btn-success btn-block font-weight-bold' onClick={() => fnPayment()}>Order Now</button>
                            </div>
                        </div>
                    </>
                }
            </Modal.Body>
        </Modal>
    </>
}

export default Cart;