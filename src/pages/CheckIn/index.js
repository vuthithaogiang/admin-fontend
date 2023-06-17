import classNames from 'classnames/bind';
import styles from './CheckIn.module.scss';
import { useRef, useState } from 'react';
import images from '~/assets/images';

import axios from '~/api/axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import useOnClickOutside from '~/hooks/useOnClickOutside';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEye, faLock, faUser } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function CheckIn() {
    const dayOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    let time = new Date().toLocaleTimeString();
    const navigate = useNavigate();

    const [ctime, setCtime] = useState(time);
    const [empId, setEmpId] = useState('');
    const [success, setSucces] = useState(false);
    const [modal, setModal] = useState(false);

    const [seePassword, setSeePassword] = useState(false);

    const [empIdInput, setEmpIdInput] = useState('');
    const [passwordValueInput, setPasswordValueInput] = useState('');

    const [empIdAdmin, setEmpIdAdmin] = useState('');
    const [passwordAdmin, setPasswordAdmin] = useState('');

    const [status, setStatus] = useState('');
    const [statusAdmin, setStatusAdmin] = useState('');

    const [type, setType] = useState('');

    const toggleModal = () => {
        setModal(!modal);
    };

    const toggleSeePassword = () => {
        setSeePassword(!seePassword);
    };

    const empIdRef = useRef();
    const refModal = useRef();

    const updateTime = () => {
        time = new Date().toLocaleTimeString();
        setCtime(time);
    };

    setInterval(updateTime, 1000);

    if (modal) {
        document.body.classList.add('active-modal');
    } else {
        document.body.classList.remove('active-modal');
    }

    useOnClickOutside(refModal, toggleModal);

    const notifyError = (typeCheck) => {
        toast.error(`Emp${empId} ${typeCheck} faild!`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
        });
    };

    const notifySuccess = (typeCheck) => {
        toast.success(`Emp${empId} ${typeCheck} success!`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
        });
    };

    const notifyWarning = () => {
        toast.warn(`🦄 Please try again!`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
        });
    };

    const handleSubmit = async () => {
        if (empId === '') {
            notifyWarning();
        } else {
            try {
                const response = await axios.post(`timesheet?empId=${empId}`);
                console.log(response.data);

                if (typeof response.data === 'undefined') {
                    setSucces(false);
                    notifyError();
                } else {
                    setSucces(true);

                    if (response.data.timeOut !== null) {
                        notifySuccess('check out');
                    } else {
                        notifySuccess('check in');
                    }
                }
            } catch (error) {
                if (error.response?.status === 500 || error.response?.status === 400) {
                    console.log('emp id error!');
                    setSucces(false);
                    notifyError();
                }
            }
        }
    };

    const handleOpenFormLogin = () => {
        setModal(true);
        setType('form-employee');
    };

    const handleOpenFormLoginAdmin = () => {
        setModal(true);
        setType('form-admin');
    };

    const handleLogin = async () => {
        if (empIdInput.trim() === '' || passwordValueInput.trim() === '') {
            setStatus('Field is empty!');
        } else {
            const body = {
                empId: empIdInput,
                password: passwordValueInput,
            };

            try {
                const response = await axios.post(`/employee/auth`, body);
                console.log(response);

                if (response.data) {
                    setStatus(response.data);
                }
            } catch (error) {
                if (error.response?.status === 500 || error.response?.status === 400) {
                    console.log('failed!');
                }
            }
        }
    };

    const handleLoginAdmin = async () => {
        if (empIdAdmin.trim() === '' || passwordAdmin.trim() === '') {
            setStatusAdmin('Field is empty!');
        } else {
            const body = {
                empId: empIdAdmin,
                password: passwordAdmin,
            };

            try {
                const response = await axios.post(`/employee/authAdmin`, body);
                console.log(response);

                if (response.data) {
                    setStatusAdmin(response.data);
                }
            } catch (error) {
                if (error.response?.status === 500 || error.response?.status === 400) {
                    console.log('failed!');
                }
            }
        }
    };

    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('left')}>
                    <div className={cx('clock')}>
                        <div className={cx('inner-clock')}>
                            <div className={cx('week-day')}>
                                {dayOfWeek.map((item, index) => (
                                    <span
                                        className={index + 1 === new Date().getDay() ? cx('active') : cx('')}
                                        key={index}
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                            <div className={cx('alarm')}>{ctime}</div>
                        </div>
                    </div>

                    <div className={cx('check-in')}>
                        <div className={cx('form-input')}>
                            <label htmlFor="inp" className={cx('inp')}>
                                <input
                                    type="text"
                                    required
                                    ref={empIdRef}
                                    value={empId}
                                    onChange={(e) => setEmpId(e.target.value)}
                                    className={cx('input')}
                                    id="inp"
                                    placeholder="&nbsp;"
                                />
                                <span className={cx('label')}>Employee ID</span>
                            </label>

                            <div onClick={handleSubmit} className={cx('send')}>
                                <img src={images.send} alt="icon" />
                            </div>
                        </div>
                    </div>

                    <div className={cx('separate')}>
                        <span>OR</span>
                    </div>
                    <div className={cx('login')}>
                        <button onClick={handleOpenFormLogin}>Log in</button>
                    </div>

                    <div className={cx('login', 'admin')}>
                        <button onClick={handleOpenFormLoginAdmin}>Go to Dashboard if You are admin</button>
                    </div>
                </div>

                <div className={cx('right')}>
                    <img src={images.house} alt="" />
                </div>

                {modal && type === 'form-employee' && (
                    <>
                        <>
                            <div className={cx('modal')}>
                                <div className={cx('overlay')} onClick={toggleModal}></div>
                                <PopperWrapper className={cx('modal-content')}>
                                    <div className={cx('inner-content')}>
                                        <div className={cx('form-login')}>
                                            <div className={cx('form-header')}>
                                                <h3>Hello Again! Welcome back</h3>
                                                <p>Welcome back! Pleaase enter your details.</p>
                                            </div>
                                            {status !== 'Authenticated Employee' && (
                                                <>
                                                    <div className={cx('form-group')}>
                                                        <label htmlFor="empId" className={cx('form-label')}>
                                                            {' '}
                                                            <FontAwesomeIcon icon={faUser} />
                                                        </label>
                                                        <input
                                                            className={cx('form-login-input')}
                                                            id="EmpId"
                                                            placeholder="Employee Id"
                                                            value={empIdInput}
                                                            onChange={(e) => setEmpIdInput(e.target.value)}
                                                            type="text"
                                                        />
                                                    </div>

                                                    <div className={cx('form-group')}>
                                                        <label htmlFor="password" className={cx('form-label')}>
                                                            <FontAwesomeIcon icon={faLock} />
                                                        </label>
                                                        <input
                                                            className={cx('form-login-input')}
                                                            id="password"
                                                            value={passwordValueInput}
                                                            onChange={(e) => setPasswordValueInput(e.target.value)}
                                                            placeholder="Password"
                                                            type={seePassword === false && 'password'}
                                                        />
                                                        <FontAwesomeIcon
                                                            className={cx('see-password')}
                                                            icon={faEye}
                                                            onClick={toggleSeePassword}
                                                        />
                                                    </div>

                                                    {type === 'form-employee' && (
                                                        <>
                                                            <div className={cx('form-group', 'form-group-login')}>
                                                                <button
                                                                    className={cx('btn-login')}
                                                                    onClick={handleLogin}
                                                                >
                                                                    Log in
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}

                                                    {/* {type === 'form-admin' && (
                                                        <>
                                                            <div className={cx('form-group', 'form-group-login')}>
                                                                <button
                                                                    className={cx('btn-login')}
                                                                    onClick={handleLoginAdmin}
                                                                >
                                                                    Go to Dashboard
                                                                </button>
                                                            </div>
                                                        </>
                                                    )} */}
                                                </>
                                            )}

                                            {status !== '' && (
                                                <>
                                                    {status === 'Authenticated Employee' && (
                                                        <>
                                                            <span className={cx('status-success')}>
                                                                <span className={cx('wrap-icon-success')}>
                                                                    <FontAwesomeIcon icon={faCheck} />
                                                                </span>
                                                                <span> {status}</span>
                                                                <div
                                                                    className={cx('go-to-dashboard')}
                                                                    onClick={() =>
                                                                        navigate(`/view/${empIdInput}/dashboard`)
                                                                    }
                                                                >
                                                                    Go to Dashboard
                                                                </div>
                                                            </span>
                                                        </>
                                                    )}

                                                    {status !== 'Authenticated Employee' && (
                                                        <>
                                                            <span className={cx('status')}>{status}</span>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        <div className={cx('video')}>
                                            <video autoPlay muted loop playsInline className={cx('video')}>
                                                <source
                                                    src="https://i.etsystatic.com/site-assets/impact/impact-page/header-hero.mp4"
                                                    type="video/mp4"
                                                ></source>
                                            </video>
                                        </div>
                                    </div>
                                </PopperWrapper>
                            </div>
                        </>
                    </>
                )}

                {modal && type === 'form-admin' && (
                    <>
                        <div className={cx('modal')}>
                            <div className={cx('overlay')} onClick={toggleModal}></div>
                            <PopperWrapper className={cx('modal-content')}>
                                <div className={cx('inner-content')}>
                                    <div className={cx('form-login')}>
                                        <div className={cx('form-header')}>
                                            <h3>Hello Again! Welcome back</h3>
                                            <p>Welcome back! Pleaase enter your details.</p>
                                        </div>
                                        {statusAdmin !== 'Authenticated Admin' && (
                                            <>
                                                <div className={cx('form-group')}>
                                                    <label htmlFor="empId" className={cx('form-label')}>
                                                        {' '}
                                                        <FontAwesomeIcon icon={faUser} />
                                                    </label>
                                                    <input
                                                        className={cx('form-login-input')}
                                                        id="EmpId"
                                                        placeholder="Employee Id"
                                                        value={empIdAdmin}
                                                        onChange={(e) => setEmpIdAdmin(e.target.value)}
                                                        type="text"
                                                    />
                                                </div>

                                                <div className={cx('form-group')}>
                                                    <label htmlFor="password" className={cx('form-label')}>
                                                        <FontAwesomeIcon icon={faLock} />
                                                    </label>
                                                    <input
                                                        className={cx('form-login-input')}
                                                        id="password"
                                                        value={passwordAdmin}
                                                        onChange={(e) => setPasswordAdmin(e.target.value)}
                                                        placeholder="Password"
                                                        type={seePassword === false && 'password'}
                                                    />
                                                    <FontAwesomeIcon
                                                        className={cx('see-password')}
                                                        icon={faEye}
                                                        onClick={toggleSeePassword}
                                                    />
                                                </div>

                                                {type === 'form-admin' && (
                                                    <>
                                                        <div className={cx('form-group', 'form-group-login')}>
                                                            <button
                                                                className={cx('btn-login')}
                                                                onClick={handleLoginAdmin}
                                                            >
                                                                Go to Dashboard
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </>
                                        )}

                                        {statusAdmin !== '' && (
                                            <>
                                                {statusAdmin === 'Authenticated Admin' && (
                                                    <>
                                                        <span className={cx('status-success')}>
                                                            <span className={cx('wrap-icon-success')}>
                                                                <FontAwesomeIcon icon={faCheck} />
                                                            </span>
                                                            <span> {statusAdmin}</span>
                                                            <div
                                                                className={cx('go-to-dashboard')}
                                                                onClick={() => navigate(`/admin/dashboard`)}
                                                            >
                                                                Go to Dashboard
                                                            </div>
                                                        </span>
                                                    </>
                                                )}

                                                {statusAdmin !== 'Authenticated Admin' && (
                                                    <>
                                                        <span className={cx('status')}>{statusAdmin}</span>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <div className={cx('video')}>
                                        <video autoPlay muted loop playsInline className={cx('video')}>
                                            <source
                                                src="https://i.etsystatic.com/site-assets/impact/impact-page/header-hero.mp4"
                                                type="video/mp4"
                                            ></source>
                                        </video>
                                    </div>
                                </div>
                            </PopperWrapper>
                        </div>
                    </>
                )}
            </div>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            ></ToastContainer>
        </>
    );
}

export default CheckIn;
