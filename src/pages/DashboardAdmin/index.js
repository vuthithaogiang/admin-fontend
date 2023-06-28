import classNames from 'classnames/bind';
import styles from './DashboardAdmin.module.scss';
import images from '~/assets/images';
import { useState } from 'react';
import { useEffect, useRef } from 'react';
import axios from '~/api/axios';
import AvatarDefault from '~/components/AvatarDefault';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faFlag } from '@fortawesome/free-solid-svg-icons';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import useOnClickOutside from '~/hooks/useOnClickOutside';
import { useNavigate } from 'react-router';

const cx = classNames.bind(styles);

function DashboardAdmin() {
    const monthName = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    var today = new Date();
    //  var date = new Date().toLocaleString('en-US', { month: 'long' });

    const [activityLog, setActivityLog] = useState([]);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('Today');
    const [month, setMonth] = useState(today.getMonth());
    const [profile, setProfile] = useState(null);
    const [furlough, setFurlough] = useState([]);
    const [modal, setModal] = useState(false);
    const refModal = useRef();
    const navigate = useNavigate();
    const [typeModal, setTypeModal] = useState('');

    const toggleModal = () => {
        setModal(!modal);
    };
    if (modal) {
        document.body.classList.add('active-modal');
    } else {
        document.body.classList.remove('active-modal');
    }
    useOnClickOutside(refModal, toggleModal);

    const handlePreviosMonth = () => {
        //console.log(month);
        if (month === 0) {
            setMonth(11);
        } else {
            setMonth((month) => month - 1);
        }
    };

    const handleNextMonth = () => {
        //console.log(month);
        if (month === 11) {
            setMonth(0);
        } else {
            setMonth((month) => month + 1);
        }
    };

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`/timesheetLog/get${filter}`);
            const response1 = await axios.get(`/stats/month=${month + 1}`);
            console.log(response.data);

            if ((response.data === []) | (response1.data === [])) {
                console.log('no data');
            } else {
                setActivityLog(response.data);

                setData(response1.data);
                setIsLoading(false);
            }
        } catch (error) {
            console.log('error');
        }
    };

    const handleOpenProfile = async (empId) => {
        try {
            const response = await axios.get(`/employee/getById/${empId}`);

            if (typeof response === 'undefined') {
                console.log('error');
            } else {
                setProfile(response.data);
                console.log(profile);
                setTypeModal('profile');
                setModal(true);
            }
        } catch (error) {
            console.log('error');
        }
    };

    const handleOpenHistoryFurlough = async (empId) => {
        try {
            const response = await axios.get(`/furlough/getAllByEmpIdAndMonth/empId=${empId}&month=${month + 1}`);
            console.log(response.data);

            if (response.data.length === 0) {
                console.log('no data');
            } else {
                setFurlough(response.data);
                setTypeModal('furlough');
                setModal(true);
            }
        } catch (error) {
            console.log('error');
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [filter, month]);

    return (
        <div className={cx('wrapper')}>
            {isLoading === true && <span>Loading data...</span>}
            {isLoading === false && (
                <>
                    <div className={cx('header')}>
                        <div className={cx('sts-item')}>
                            <div className={cx('thumb')}>
                                <img src={images.math} alt="icon" />
                                <span>
                                    <strong>+2 pairds</strong> vs last month
                                </span>
                            </div>
                            <div className={cx('value')}>5</div>
                            <div className={cx('type')}>Total Request Time off</div>
                        </div>
                        <div className={cx('sts-item')}>
                            <div className={cx('thumb')}>
                                <img src={images.icon1} alt="icon" />
                                <span>
                                    <strong>+3Hs longer</strong> vs last month
                                </span>
                            </div>
                            <div className={cx('value')}>1300</div>
                            <div className={cx('type')}>Total Offline hours</div>
                        </div>
                        <div className={cx('sts-item')}>
                            <div className={cx('thumb')}>
                                <img src={images.icon2} alt="icon" />
                                <span>
                                    <strong>+3Hs longer</strong> vs last month
                                </span>
                            </div>
                            <div className={cx('value')}>300</div>
                            <div className={cx('type')}>Total Overtime hours</div>
                        </div>
                        <div className={cx('sts-item')}>
                            <div className={cx('thumb')}>
                                <img src={images.icon3} alt="icon" />
                                <span>
                                    <strong>+3Hs longer</strong> vs last month
                                </span>
                            </div>
                            <div className={cx('value')}>94752</div>
                            <div className={cx('type')}>Total Working hours</div>
                        </div>
                    </div>
                    <div className={cx('timesheet-log')}>
                        <div className={cx('header')}>
                            <h4>Activity Log Timesheet</h4>
                            <div>
                                <div
                                    className={filter === 'Today' ? cx('active-btn', 'active') : cx('active-btn')}
                                    onClick={() => setFilter('Today')}
                                >
                                    Today
                                </div>
                                <div
                                    className={filter === 'All' ? cx('active-btn', 'active') : cx('active-btn')}
                                    onClick={() => setFilter('All')}
                                >
                                    View All
                                </div>
                            </div>
                        </div>
                        <div className={cx('container')}>
                            <div className={cx('content')}>
                                {activityLog.map((item) => (
                                    <div key={item.id} className={cx('log-item')}>
                                        <span>{item.dateToString}</span>
                                        <span className={cx('time')}>{item.timeToString}</span>
                                        <span>
                                            {(item.avatar === null) | (item.avatar === '') ? (
                                                <>
                                                    <AvatarDefault firstName={item.firstName} color={'#3d81c2'} />{' '}
                                                </>
                                            ) : (
                                                <img className={cx('log-avatar')} src={item.avatar} />
                                            )}
                                        </span>
                                        <span className={cx('full-name')}>
                                            <strong>{item.fullNameEmp}</strong> has just{' '}
                                            {item.type === 'check in' && (
                                                <span className={cx('type-checkin')}>{item.type}</span>
                                            )}
                                            {item.type === 'check out' && (
                                                <span className={cx('type-checkout')}>{item.type}</span>
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={cx('stats-in-month')}>
                        <div className={cx('header-stats-month')}>
                            <div className={cx('choose-month')}>
                                <span className={cx('wrap-icon')} onClick={() => handlePreviosMonth()}>
                                    <img src={images.arrowLeft} alt="icon" />
                                </span>
                                <span className={cx('month-value')}>{monthName[month]}</span>
                                <span className={cx('wrap-icon')} onClick={() => handleNextMonth()}>
                                    <img src={images.arrowRight1} alt="icon" />
                                </span>
                            </div>

                            <p>Statistic in month</p>
                        </div>

                        <div className={cx('stats-month-wrapper')}>
                            <div className={cx('title')}>
                                <span className={cx('title-item')}>
                                    <FontAwesomeIcon icon={faHashtag} />
                                    EmpId
                                </span>
                                <span className={cx('title-item')}>
                                    <FontAwesomeIcon icon={faHashtag} />
                                    Standard days
                                </span>
                                <span className={cx('title-item')}>
                                    <FontAwesomeIcon icon={faHashtag} />
                                    Days off <strong>(have furlough)</strong>
                                </span>

                                <span className={cx('title-item')}>
                                    <FontAwesomeIcon icon={faHashtag} />
                                    Days checked in
                                </span>

                                <span className={cx('title-item')}>
                                    <FontAwesomeIcon icon={faHashtag} />
                                    Payday
                                </span>
                            </div>
                            <div className={cx('stats-content')}>
                                {data !== [] &&
                                    data.map((item) => (
                                        <div className={cx('employee-item')} key={item.id}>
                                            <span
                                                className={cx('emp-id')}
                                                onClick={() => handleOpenProfile(item.empId)}
                                            >
                                                {item.empId}
                                            </span>
                                            <span>{item.totalStanderWork}</span>
                                            <span
                                                className={cx('days-off')}
                                                onClick={() => handleOpenHistoryFurlough(item.empId)}
                                            >
                                                {item.totalDaysOffHaveFurlough}
                                            </span>
                                            <span
                                                className={cx('days-checkin')}
                                                onClick={() => navigate('/admin/timesheet')}
                                            >
                                                {item.totalDaysWork}
                                            </span>
                                            <span>{item.totalDaysWorkPTO}</span>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>

                    {modal && profile !== null && typeModal === 'profile' && (
                        <>
                            <div className={cx('modal')}>
                                <div className={cx('overlay')} onClick={toggleModal}></div>
                                <div className={cx('modal-content')}>
                                    <div className={cx('thumbnail-img')}>
                                        <div className={cx('banner')}>
                                            <div className={cx('clear')} onClick={toggleModal}>
                                                <FontAwesomeIcon icon={faXmark} />
                                            </div>
                                        </div>
                                        {(profile.avatar === null) | (profile.avatar === '') ? (
                                            <>
                                                <div className={cx('wrapper-avatar')}>
                                                    <span>{profile.firstName.substr(0, 1)}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className={cx('wrapper-avatar')}>
                                                    <img src={profile.avatar} alt="name" />
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className={cx('profile-group')}>
                                        <div className={cx('profile-name')}>
                                            <h3>
                                                {profile.lastName} {profile.midName} {profile.firstName}
                                            </h3>
                                        </div>
                                        <div className={cx('address')}>
                                            <FontAwesomeIcon icon={faFlag} />
                                            <span>Ha Noi, Viet Nam</span>
                                        </div>

                                        <div className={cx('profile-infos')}>
                                            <span>{profile.email}</span>
                                            <span>{profile.dateOfBirth}</span>
                                            <span>{profile.position}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {modal && furlough !== [] && typeModal === 'furlough' && (
                        <>
                            <div className={cx('modal')}>
                                <div className={cx('overlay')} onClick={toggleModal}></div>
                                <div className={cx('modal-content-furlough')}>
                                    <PopperWrapper>
                                        {furlough.map((item, index) => (
                                            <div className={cx('repeat')} key={index}>
                                                {(item.employee.avatar === null) | (item.employee.avatar === '') ? (
                                                    <>
                                                        <span></span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <img src={item.employee.avatar} alt="name" />
                                                    </>
                                                )}
                                                <div className={cx('repeat-content')}>
                                                    <span className={cx('full-name-emp')}>
                                                        {item.employee.fullName}
                                                    </span>
                                                    <span>
                                                        send requests off {item.totalDaysOff} days from{' '}
                                                        <span className={cx('day-off-from')}> {item.offFrom}</span> to{' '}
                                                        <span className={cx('day-off-to')}>{item.offTo}</span> with
                                                        reason: {item.note}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </PopperWrapper>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default DashboardAdmin;
