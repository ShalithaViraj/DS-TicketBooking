import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

import AlertMsg from '../common/AlertMsg';
import GridFunctions from '../common/Grid/GridFunctions';

const BookingDetails = (props) => {

    const [arrReser, setReser] = useState([]);

    useEffect(() => {
        fetchCartDetails();
    }, [props.show]);

    const reservColumns = [
        {
            name: "Reservation Code",
            grow: 1,
            selector: "strReservationCode",
        },
        {
            name: "Payment Info",
            grow: 3,
            cell: (row) => (<span>{row.objPaymentDetails.description}</span>)
        },
        {
            name: "Cancel",
            grow: 0.5,
            cell: (row) => (<span className= { row.booCancel ? "badge badge-warning" : "badge badge-success" }>{row.booCancel ? "Cancelled" : "Active"}</span>)
        },
        {
            name: "Reservation Date",
            grow: 1.5,
            selector: "dtmCreatedDate",
        },
        {
            name: "Action",
            grow: 1,
            cell: (row) => (
                <>
                    <button
                        className="btn btn-sm btn-danger m-0 p-2 ml-2"
                        onClick={() => { fnDeleteReservation(row.strReservationCode) }}
                    >
                        <i className="fas fa-trash" />
                    </button>
                </>
            ),
        },
    ];

    const fetchCartDetails = async () => {
        if (props.show) {
            try {
                const resReser = await axios.get('http://localhost:5000/api/reservation/getReservation', {
                    headers: {
                        'auth-token': JSON.parse(localStorage.getItem('objUser')).strToken
                    }
                });
                if (resReser.data.booStatus) {
                    setReser(resReser.data.objResponse);
                } else { AlertMsg(false, resReser.data.objResponse) }
            } catch (err) {
                AlertMsg(false, err.response.data.objResponse);
            }
        }
    };

    const fnDeleteReservation = async (strReserCode) => {
        try {
            const resReser = await axios.put('http://localhost:5000/api/reservation/cancelReservation', {
                strReservationCode: strReserCode
            }, {
                headers: {
                    'auth-token': JSON.parse(localStorage.getItem('objUser')).strToken
                }
            });
            if (resReser.data.booStatus) {
                setReser(resReser.data.objResponse);
                fetchCartDetails();
            } else { AlertMsg(false, resReser.data.objResponse) }
        } catch (err) {
            AlertMsg(false, err.response.data.objResponse);
        }
    }

    return <Modal
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
                            <span className='font-weight-bold h4'>Reservation Details</span>
                            <span className='font-weight-bold h4 text-danger float-right'><i className="fa fa-times-circle" onClick={() => { props.onHide(); }} /></span>
                        </div>
                    </div>
                    <div className="row m-0 p-0 col-md-12">
                        <div className="col-md-12 m-0">
                            <GridFunctions
                                title="Movie Reservation Details"
                                columns={reservColumns}
                                dataSet={arrReser}
                                strHeight={"45vh"}
                            />
                        </div>
                    </div>
                </>
            }
        </Modal.Body>
    </Modal>
}

export default BookingDetails;