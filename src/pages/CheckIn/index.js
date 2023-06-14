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
import { faEnvelope, faEye, faLock } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function CheckIn() {
    const dayOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    let time = new Date().toLocaleTimeString();
    const navigate = useNavigate();

    const [ctime, setCtime] = useState(time);
    const [empId, setEmpId] = useState('');
    const [success, setSucces] = useState(false);
    const [modal, setModal] = useState(false);
    const [isSendingRequest, setIsSendingRequest] = useState(false);
    const [seePassword, setSeePassword] = useState(false);

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

    const notifyError = () => {
        toast.error(`Emp${empId} checkin faild!`, {
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

    const notifySuccess = () => {
        toast.success(`Emp${empId} checkin success!`, {
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
        toast.warn('🦄 Please check in first!', {
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
        try {
            const response = await axios.post(`timesheet?empId=${empId}`);
            console.log(response.data);

            if (typeof response.data === 'undefined') {
                setSucces(false);
                notifyError();
            } else {
                setSucces(true);
                notifySuccess();
            }
        } catch (error) {
            if (error.response?.status === 500 || error.response?.status === 400) {
                console.log('emp id error!');
                setSucces(false);
                notifyError();
            }
        }
    };

    const handleOpenFormLogin = () => {
        setModal(true);
        setType('form-employee');
    };

    const handleLogin = () => {
        if (success === false || empId === '') {
            notifyWarning();
        } else {
            navigate(`view/${empId}/dashboard`);
        }
        console.log('handle login');
    };

    const handleLoginAdmin = () => {
        navigate('/admin/dashboard');
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
                        <button onClick={handleLoginAdmin}>Go to Dashboard if You are admin</button>
                    </div>
                </div>

                <div className={cx('right')}>
                    <img src={images.house} alt="" />
                </div>

                {modal && type === 'form-employee' && (
                    <>
                        {isSendingRequest === false && (
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
                                                <div className={cx('form-group')}>
                                                    <label htmlFor="email" className={cx('form-label')}>
                                                        {' '}
                                                        <FontAwesomeIcon icon={faEnvelope} />
                                                    </label>
                                                    <input
                                                        className={cx('form-login-input')}
                                                        id="email"
                                                        placeholder="Email"
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
                                                        placeholder="Password"
                                                        type={seePassword === false && 'password'}
                                                    />
                                                    <FontAwesomeIcon
                                                        className={cx('see-password')}
                                                        icon={faEye}
                                                        onClick={toggleSeePassword}
                                                    />
                                                </div>

                                                <div className={cx('form-group', 'form-group-login')}>
                                                    <button className={cx('btn-login')}>Log In</button>
                                                </div>
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

                        {isSendingRequest === true && <span>Sending request....</span>}
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
