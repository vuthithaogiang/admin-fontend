import classNames from 'classnames/bind';
import styles from './TimeOffAdmin.module.scss';
import { useEffect, useRef, useState } from 'react';
import axios from '~/api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarDays,
    faCalendar,
    faCheck,
    faClock,
    faFile,
    faFire,
    faXmark,
    faFlag,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import useOnClickOutside from '~/hooks/useOnClickOutside';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Calendar } from 'react-date-range';
import format from 'date-fns/format';

const cx = classNames.bind(styles);

function TimeOffAdmin() {
    const [isLoading, setIsLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const refModal = useRef();
    const [furloughs, setFurloughs] = useState([]);
    const [calendar, setCalendar] = useState('');
    const [openCalender, setOpenCalender] = useState(false);

    const refOne = useRef(null);

    const [profile, setProfile] = useState({});

    const toggleModal = () => {
        setModal(!modal);
    };
    if (modal) {
        document.body.classList.add('active-modal');
    } else {
        document.body.classList.remove('active-modal');
    }
    useOnClickOutside(refModal, toggleModal);

    const handelOpenProfile = (profile) => {
        if (profile != {}) {
            console.log(profile);
            setProfile(profile);
            setModal(true);
        } else {
        }
    };

    const fetDetails = async () => {
        try {
            let response;

            if (calendar === '') {
                response = await axios.get(`/furlough/getAll`);
            } else {
                response = await axios.get(`/furlough/getAllByDate/${calendar}`);
            }

            console.log(response.data);
            if (response.data === []) {
                document.alert('No data');
                console.log('no data');
            } else {
                setFurloughs(response.data);
                setIsLoading(false);
            }
        } catch (error) {
            console.log('failed');
        }
    };

    const handleSelectDate = (date) => {
        setCalendar(format(date, 'yyyy-MM-dd'));
    };

    useEffect(() => {
        fetDetails();
    }, [calendar]);

    return (
        <>
            {isLoading === true && <span>Loading data ...</span>}
            {isLoading === false && (
                <>
                    <div className={cx('wrapper')}>
                        <div className={cx('header')}>
                            <h4>History Furloughs</h4>
                            <div className={cx('due-date')}>
                                <FontAwesomeIcon
                                    icon={faCalendarDays}
                                    onClick={() => setOpenCalender((openCalender) => !openCalender)}
                                />
                                <span>Due Day</span>
                            </div>
                        </div>
                        {openCalender && (
                            <>
                                <div className={cx('container-calender')}>
                                    <Calendar date={new Date()} onChange={handleSelectDate}></Calendar>
                                </div>
                            </>
                        )}
                        <div className={cx('list-furlough')}>
                            {/* 1 */}
                            <div className={cx('item-sort')}>
                                <span>Employee</span>
                            </div>
                            {/* 2 */}
                            <div className={cx('item-sort')}>
                                <FontAwesomeIcon icon={faClock} />
                                <span>Created At</span>
                            </div>
                            {/* 3 */}
                            <div className={cx('item-sort')}>
                                <FontAwesomeIcon icon={faCalendar} />
                                <span>Days off</span>
                            </div>
                            {/* 4 */}
                            <div className={cx('item-sort')}>
                                <FontAwesomeIcon icon={faFile} />
                                <span>Note</span>
                            </div>
                            {/* 5 */}
                            <div className={cx('item-sort')}>
                                <FontAwesomeIcon icon={faFire} />
                                <span>Status</span>
                            </div>
                            {furloughs.map((item) => (
                                <>
                                    {/* 1 */}
                                    <div className={cx('item')} key={item.furloughId}>
                                        <img
                                            className={cx('avatar')}
                                            src={item.employee.avatar}
                                            alt="avatar"
                                            onClick={() => handelOpenProfile(item.employee)}
                                        />
                                    </div>

                                    {/* 2 */}
                                    <div className={cx('item')}>
                                        <span>{item.updateAt}</span>
                                    </div>

                                    <>
                                        {/* 3 */}
                                        <Tippy
                                            interactive
                                            render={(attrs) => (
                                                <div className={cx('time-off')} tabIndex={'-1'} {...attrs}>
                                                    <PopperWrapper>
                                                        <p className={cx('')}>
                                                            From:{' '}
                                                            <span className={cx('time-from')}>{item.offFrom}</span> -
                                                            To: <span className={cx('time-to')}>{item.offTo}</span>
                                                        </p>
                                                    </PopperWrapper>
                                                </div>
                                            )}
                                            placement="right"
                                        >
                                            <div className={cx('item', 'days-off')}>
                                                <span>📘 {item.totalDaysOff} days</span>
                                            </div>
                                        </Tippy>
                                    </>
                                    {/* 4 */}
                                    <div className={cx('item')}>
                                        <span>{item.note}</span>
                                    </div>
                                    {/* 5 */}
                                    <div className={cx('item')}>
                                        {item.status === 1 && (
                                            <span className={cx('accept')}>
                                                <FontAwesomeIcon icon={faCheck} />
                                            </span>
                                        )}
                                        {item.status === 0 && (
                                            <span className={cx('deny')}>
                                                <FontAwesomeIcon icon={faXmark} />
                                            </span>
                                        )}

                                        <span className={cx('btn-accept')}>Accept</span>
                                        <span className={cx('btn-deny')}>Deny</span>
                                    </div>
                                </>
                            ))}

                            {modal && profile !== {} && (
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
                                                <div className={cx('wrapper-avatar')}>
                                                    <img src={profile.avatar} alt="name" />
                                                </div>
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
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default TimeOffAdmin;
