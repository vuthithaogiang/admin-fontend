import classNames from 'classnames/bind';
import styles from './CheckIn.module.scss';
import { useRef, useState } from 'react';
import images from '~/assets/images';

import axios from '~/api/axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function CheckIn() {
    const dayOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    let time = new Date().toLocaleTimeString();

    const [ctime, setCtime] = useState(time);
    const [empId, setEmpId] = useState('');

    const navigate = useNavigate();

    const [success, setSucces] = useState(false);

    const empIdRef = useRef();

    const updateTime = () => {
        time = new Date().toLocaleTimeString();
        setCtime(time);
    };

    setInterval(updateTime, 1000);

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

    const handleLogin = () => {
        if (success === false || empId === '') {
            notifyWarning();
        } else {
            navigate(`view/${empId}/dashboard`);
        }
        console.log('handle login');
    };

    const handleLoginAdmin = () => {};

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
                        <button onClick={handleLogin}>Log in</button>
                    </div>

                    <div className={cx('login', 'admin')}>
                        <button onClick={handleLoginAdmin}>Go to Dashboard if You are admin</button>
                    </div>
                </div>

                <div className={cx('right')}>
                    <img src={images.house} alt="" />
                </div>
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
