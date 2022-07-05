import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';

import AlertMsg from '../common/AlertMsg';
import axios from 'axios';

const User = (props) => {
    const [strState, setState] = useState("L");
    const [objLogin, setLogin] = useState({
        strUserEmail: '',
        strUserPassword: ''
    });
    const [objRegister, setRegister] = useState({
        strUserName: '',
        strUserPassword: '',
        strUserEmail: '',
        strUserMobile: ''
    });

    const LoginForm = () => {
        return <>
            <div className="col-md-12 m-0 p-0">
                <div className="form-group">
                    <label htmlFor="strUserEmail">Email</label>
                    <input autoFocus type="email" className="form-control" value={objLogin.strUserEmail} onChange={(e) => fnHandleLoginOnChange(e)} id="strUserEmail" name="strUserEmail" placeholder="Enter email" autoComplete='off' />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password" className="form-control" value={objLogin.strUserPassword} onChange={(e) => fnHandleLoginOnChange(e)} id="strUserPassword" name="strUserPassword" placeholder="Enter password" autoComplete='off' />
                </div>
            </div>
            <div className="col-md-12 m-0 p-0">
                <button className='btn btn-primary w-100 font-weight-bold' onClick={() => fnLogin() }>Login</button>
                <button className='btn btn-success w-100 font-weight-bold mt-2' onClick={() => setState("R") }>Register As New User</button>
            </div>
        </>
    };

    const fnHandleLoginOnChange = (e) => {
        e.persist();
        setLogin((objLogin) => ({
            ...objLogin,
            [e.target.name]: e.target.value,
        }));
    };

    const RegisterForm = () => {
        return <>
            <div className="col-md-12 m-0 p-0">
                <div className="form-group">
                    <label htmlFor="strUserName">User Name</label>
                    <input autoFocus type="email" className="form-control" value={objRegister.strUserName} onChange={(e) => fnHandleRegisterOnChange(e)} id="strUserName" name="strUserName" placeholder="Enter user name" autoComplete='off' />
                </div>
                <div className="form-group">
                    <label htmlFor="strUserMobile">User Mobile</label>
                    <input autoFocus type="email" className="form-control" value={objRegister.strUserMobile} onChange={(e) => fnHandleRegisterOnChange(e)} id="strUserMobile" name="strUserMobile" placeholder="Enter user mobile" autoComplete='off' />
                </div>
                <div className="form-group">
                    <label htmlFor="strUserEmail">Email</label>
                    <input autoFocus type="email" className="form-control" value={objRegister.strUserEmail} onChange={(e) => fnHandleRegisterOnChange(e)} id="strUserEmail" name="strUserEmail" placeholder="Enter email" autoComplete='off' />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password" className="form-control" value={objRegister.strUserPassword} onChange={(e) => fnHandleRegisterOnChange(e)} id="strUserPassword" name="strUserPassword" placeholder="Enter password" autoComplete='off' />
                </div>
            </div>
            <div className="col-md-12 m-0 p-0">
                <button className='btn btn-success w-100 font-weight-bold mt-2' onClick={() => fnRegisterUser()}>Register As New User</button>
            </div>
        </>
    };

    const fnHandleRegisterOnChange = (e) => {
        e.persist();
        setRegister((objRegister) => ({
            ...objRegister,
            [e.target.name]: e.target.value,
        }));
    };

    const fnRegisterUser = async () => {
        if (objRegister.strUserName == "") showValidationError(false, "Please enter user name!");
        else if (objRegister.strUserPassword == "") showValidationError(false, "Please enter password!");
        else if (objRegister.strUserEmail == "") showValidationError(false, "Please enter email!");
        else if (objRegister.strUserMobile == "") showValidationError(false, "Please enter mobile no!");
        else {
            try {
                const resRegister = await axios.post('http://localhost:5000/api/user/register', objRegister);
                AlertMsg(resRegister.data.booStatus, resRegister.data.objResponse);
                fnClear();
                setState("L");
            } catch (err) {
                AlertMsg(false, err.response.data.objResponse);
            }
        }
    };

    const fnLogin = async () => {
        if (objLogin.strUserName == "") showValidationError(false, "Please enter user name!");
        else if (objLogin.strUserPassword == "") showValidationError(false, "Please enter password!");
        else {
            try {
                const resSignIn = await axios.post('http://localhost:5000/api/user/signin', objLogin);
                fnClear();
    
                if(resSignIn.data.booStatus) {
                    localStorage.setItem('objUser', JSON.stringify(resSignIn.data.objResponse));
                    props.onHide(true);
                    window.location.reload();
                } else {
                    AlertMsg(false, resSignIn.data.objResponse);
                }  
            } catch (err) {
                AlertMsg(false, err.response.data.objResponse);
            }
        }
    };

    const fnClear = () => {
        setRegister({
            strUserName: '',
            strUserPassword: '',
            strUserEmail: '',
            strUserMobile: ''
        });
        setLogin({
            strUserEmail: '',
            strUserPassword: ''
        });
    };

    return <Modal
        {...props}
        size="md"
        backdrop="static"
        aria-labelledby="contained-modal-title-vcenter"
        centered
    >
        <Modal.Body>
            <div className="row m-0 p-0 justify-content-center">
                <div className="col-md-12 m-0 p-0 text-center">
                    <span className='font-weight-bold h4'>{strState === "L" ? "Sign In" : "Register"}</span>
                    <span className='font-weight-bold h4 text-danger float-right'><i className="fa fa-times-circle" onClick={() => { setState("L"); props.onHide() }} /></span>
                </div>
                {strState === "L" ? LoginForm() : RegisterForm()}
            </div>
        </Modal.Body>
    </Modal>
}

export default User;