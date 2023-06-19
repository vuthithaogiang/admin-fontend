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
    faPen,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import useOnClickOutside from '~/hooks/useOnClickOutside';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Calendar, DateRange } from 'react-date-range';
import format from 'date-fns/format';
import { addDays } from 'date-fns';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import AvatarDefault from '~/components/AvatarDefault';

const cx = classNames.bind(styles);

function TimeOffAdmin() {
    const [isLoading, setIsLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const refModal = useRef();
    const [furloughs, setFurloughs] = useState([]);
    const [calendar, setCalendar] = useState('');
    const [openCalender, setOpenCalender] = useState(false);
    const [profile, setProfile] = useState({});
    const [itemFurlough, setItemFurlough] = useState({});
    const [itemDelete, setItemDelete] = useState({});
    const [note, setNote] = useState('');
    const [typeHandleFurlough, setTypeHandleFurlough] = useState('');

    const [itemUpdate, setItemUpdate] = useState({});

    const [isSendingRequest, setIsSendingRequest] = useState(false);
    //const [sendSuccess, setSendSuccess] = useState(false);

    const stateDefault = [
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 0),
            key: 'selection',
        },
    ];

    const [state, setState] = useState(stateDefault);

    const toggleModal = () => {
        setModal(!modal);
    };
    if (modal) {
        document.body.classList.add('active-modal');
    } else {
        document.body.classList.remove('active-modal');
    }
    useOnClickOutside(refModal, toggleModal);

    const notifyError = () => {
        toast.error(`Send request failed! 🎉`, {
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
        toast.success(`Send request successfully! 🎉`, {
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

    const handelOpenProfile = (profile) => {
        if (profile !== {}) {
            console.log(profile);
            setProfile(profile);
            setTypeHandleFurlough('openProfile');
            setModal(true);
        } else {
        }
    };

    const handleShowFormAcceptFurlough = (furlough) => {
        if (furlough !== {}) {
            setItemFurlough(furlough);
            setTypeHandleFurlough('accept');
            setModal(true);
        }
    };

    const handleShowFormDenyFurlough = (furlough) => {
        if (furlough !== {}) {
            setItemFurlough(furlough);
            setTypeHandleFurlough('deny');
            setModal(true);
        }
    };

    const handleShowFormDeleteFurlough = async (item) => {
        if (item !== {}) {
            setItemDelete(item);
            setTypeHandleFurlough('delete');
            setModal(true);
        }
    };

    const handleShowFormUpdateFurlough = (item) => {
        if (item !== {}) {
            setItemUpdate(item);
            setTypeHandleFurlough('update');
            setModal(true);
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

    const handleAccepted = async (itemFurlough) => {
        setIsSendingRequest(true);

        console.log(itemFurlough);
        try {
            const body = {
                furloughId: itemFurlough.furLoughInteger,
                offFrom: itemFurlough.offFrom,
                offTo: itemFurlough.offTo,
                note: itemFurlough.note,
            };
            const response = await axios.patch('/furlough/accept', body);

            console.log(response.data);

            if (response.data === 'undefined') {
                console.log('failed');
            } else {
                setIsSendingRequest(false);
                notifySuccess();
            }
        } catch (error) {
            notifyError();
        }
    };

    const handleDenied = async (itemFurlough) => {
        setIsSendingRequest(true);

        try {
            const body = {
                furloughId: itemFurlough.furLoughInteger,
                offFrom: itemFurlough.offFrom,
                offTo: itemFurlough.offTo,
                note: itemFurlough.note,
            };
            const response = await axios.patch('/furlough/deny', body);

            console.log(response.data);

            if (response.data === 'undefined') {
                console.log('failed');
                notifyError();
            } else {
                setIsSendingRequest(false);
                notifySuccess();
            }
        } catch (error) {
            notifyError();
        }
    };

    const handleSubmitUpdate = async (itemUpdate) => {
        setIsSendingRequest(true);

        if (note !== '') {
            try {
                const body = {
                    furloughId: itemUpdate.furLoughInteger,
                    offFrom: format(state[0].startDate, 'yyyy-MM-dd'),
                    offTo: format(state[0].endDate, 'yyyy-MM-dd'),
                    note: note,
                };

                const response = axios.patch('/furlough/update', body);

                if (response.data === 'undefined') {
                    notifyError();
                } else {
                    setIsSendingRequest(false);
                    notifySuccess();
                    window.location.reload(false);
                }
            } catch (error) {
                notifyError();
            }
        } else {
            notifyError();
        }
    };

    const handleDelete = async (itemDelete) => {
        setIsSendingRequest(true);

        try {
            const response = await axios.delete(`/furlough/delete/${itemDelete}`);

            if (response.data === null) {
                notifyError();
            } else {
                setIsSendingRequest(false);
                setModal(false);
                notifySuccess();
            }
        } catch (error) {
            notifyError();
        }
    };

    useEffect(() => {
        fetDetails();
    }, [calendar, isSendingRequest]);

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
                            <div className={cx('wrap-filter')}>
                                <div className={cx('item-sort')}>
                                    <span>Actions</span>
                                </div>
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
                            </div>
                            {furloughs.map((item) => (
                                <div className={cx('wrap-item')} key={item.furloughId}>
                                    <div className={cx('item')}>
                                        <div className={cx('actions')}>
                                            <span
                                                className={cx('edit')}
                                                onClick={() => handleShowFormUpdateFurlough(item)}
                                            >
                                                <FontAwesomeIcon icon={faPen} />
                                            </span>
                                            <span
                                                onClick={() => handleShowFormDeleteFurlough(item)}
                                                className={cx('delete')}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </span>
                                        </div>
                                    </div>
                                    {/* 1 */}
                                    <div className={cx('item', 'group-avatar')}>
                                        {item.employee.avatar ? (
                                            <>
                                                {' '}
                                                <img
                                                    className={cx('avatar')}
                                                    src={item.employee.avatar}
                                                    alt="avatar"
                                                    onClick={() => handelOpenProfile(item.employee)}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <AvatarDefault firstName={item.employee.firstName} color={'#3d81c2'} />
                                            </>
                                        )}
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

                                        <span
                                            className={cx('btn-accept')}
                                            onClick={() => handleShowFormAcceptFurlough(item)}
                                        >
                                            Accept
                                        </span>
                                        <span
                                            className={cx('btn-deny')}
                                            onClick={() => handleShowFormDenyFurlough(item)}
                                        >
                                            Deny
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {modal && profile !== {} && typeHandleFurlough === 'openProfile' && (
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

                            {modal && typeHandleFurlough === 'accept' && (
                                <>
                                    <div className={cx('modal')}>
                                        <div className={cx('overlay')} onClick={toggleModal}></div>
                                        <div className={cx('modal-content-furlough')}>
                                            {' '}
                                            <PopperWrapper>
                                                {isSendingRequest === false && (
                                                    <>
                                                        <div className={cx('repeat')}>
                                                            <img src={itemFurlough.employee.avatar} alt="avatar" />
                                                            <div className={cx('repeat-content')}>
                                                                <span className={cx('full-name-emp')}>
                                                                    {itemFurlough.employee.fullName}
                                                                </span>
                                                                <span>
                                                                    send requests off {itemFurlough.totalDaysOff} days
                                                                    from{' '}
                                                                    <span className={cx('day-off-from')}>
                                                                        {' '}
                                                                        {itemFurlough.offFrom}
                                                                    </span>{' '}
                                                                    to
                                                                    <span className={cx('day-off-to')}>
                                                                        {' '}
                                                                        {itemFurlough.offTo}
                                                                    </span>{' '}
                                                                    with reason: {itemFurlough.note}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className={cx('btns-action')}>
                                                            <p>Are you sure acccept that request?</p>
                                                            <div>
                                                                <button
                                                                    className={cx('yes')}
                                                                    onClick={() => handleAccepted(itemFurlough)}
                                                                >
                                                                    Yes
                                                                </button>
                                                                <button onClick={toggleModal}>No</button>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                                {isSendingRequest === true && <span>Sending requuest</span>}
                                            </PopperWrapper>
                                        </div>
                                    </div>
                                </>
                            )}

                            {modal && typeHandleFurlough === 'deny' && (
                                <>
                                    <div className={cx('modal')}>
                                        <div className={cx('overlay')} onClick={toggleModal}></div>
                                        <div className={cx('modal-content-furlough')}>
                                            {' '}
                                            {isSendingRequest === false && (
                                                <>
                                                    <PopperWrapper>
                                                        <div className={cx('repeat')}>
                                                            <img src={itemFurlough.employee.avatar} alt="avatar" />
                                                            <div className={cx('repeat-content')}>
                                                                <span className={cx('full-name-emp')}>
                                                                    {itemFurlough.employee.fullName}
                                                                </span>
                                                                <span>
                                                                    send requests off {itemFurlough.totalDaysOff} days
                                                                    from{' '}
                                                                    <span className={cx('day-off-from')}>
                                                                        {' '}
                                                                        {itemFurlough.offFrom}
                                                                    </span>{' '}
                                                                    to{' '}
                                                                    <span className={cx('day-off-to')}>
                                                                        {itemFurlough.offTo}
                                                                    </span>{' '}
                                                                    with reason: {itemFurlough.note}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className={cx('btns-action')}>
                                                            <p>Are you sure deny that request?</p>
                                                            <div>
                                                                <button
                                                                    className={cx('yes')}
                                                                    onClick={() => handleDenied(itemFurlough)}
                                                                >
                                                                    Yes
                                                                </button>
                                                                <button onClick={toggleModal}>No</button>
                                                            </div>
                                                        </div>
                                                    </PopperWrapper>
                                                </>
                                            )}
                                            {isSendingRequest === true && <span>Sending request</span>}
                                        </div>
                                    </div>
                                </>
                            )}

                            {modal && typeHandleFurlough === 'update' && (
                                <>
                                    <div className={cx('modal')}>
                                        <div className={cx('overlay')} onClick={toggleModal}></div>
                                        <div className={cx('modal-content-furlough')}>
                                            {isSendingRequest === false && (
                                                <div>
                                                    <PopperWrapper className={cx('wrap-form')}>
                                                        <div className={cx('repeat-content', 'update')}>
                                                            <span className={cx('full-name-emp')}>
                                                                {itemUpdate.employee.fullName}
                                                            </span>
                                                            <span>
                                                                send requests off {itemUpdate.totalDaysOff} days from{' '}
                                                                <span className={cx('day-off-from')}>
                                                                    {' '}
                                                                    {state === stateDefault
                                                                        ? itemUpdate.offFrom
                                                                        : format(state[0].startDate, 'yyyy-MM-dd')}
                                                                </span>{' '}
                                                                to
                                                                <span className={cx('day-off-to')}>
                                                                    {' '}
                                                                    {state === stateDefault
                                                                        ? itemUpdate.offTo
                                                                        : format(state[0].endDate, 'yyyy-MM-dd')}
                                                                </span>{' '}
                                                                with reason: {note === '' ? itemUpdate.note : note}
                                                            </span>
                                                        </div>
                                                        <div className={cx('form')}>
                                                            <div className={cx('form-group')}>
                                                                <div className={cx('form-label')}>
                                                                    <FontAwesomeIcon icon={faClock} />
                                                                    <span>Time off Type</span>
                                                                </div>

                                                                <div className={cx('content')}>
                                                                    <div
                                                                        className={
                                                                            note === 'PTO'
                                                                                ? cx('item', 'active')
                                                                                : cx('item')
                                                                        }
                                                                        onClick={() => setNote('PTO')}
                                                                    >
                                                                        <p>PTO</p>
                                                                    </div>
                                                                    <div
                                                                        className={
                                                                            note === 'Slick Leave'
                                                                                ? cx('item', 'active')
                                                                                : cx('item')
                                                                        }
                                                                        onClick={() => setNote('Slick Leave')}
                                                                    >
                                                                        <p>Slick Leave</p>
                                                                    </div>
                                                                    <div
                                                                        className={
                                                                            note === 'Parent Duty'
                                                                                ? cx('item', 'active')
                                                                                : cx('item')
                                                                        }
                                                                        onClick={() => setNote('Parent Duty')}
                                                                    >
                                                                        <p>Parent Duty</p>
                                                                    </div>
                                                                    <div
                                                                        className={
                                                                            note === `Covid-19 Family Care`
                                                                                ? cx('item', 'active')
                                                                                : cx('item')
                                                                        }
                                                                        onClick={() => setNote('Covid-19 Family Care')}
                                                                    >
                                                                        <p>Covid-19 Family Care</p>
                                                                    </div>
                                                                    <div
                                                                        className={
                                                                            note === 'Vacation'
                                                                                ? cx('item', 'active')
                                                                                : cx('item')
                                                                        }
                                                                        onClick={() => setNote('Vacation')}
                                                                    >
                                                                        <p>Vacation</p>
                                                                    </div>
                                                                    <div
                                                                        className={
                                                                            note === `Covid-19 Selfcare`
                                                                                ? cx('item', 'active')
                                                                                : cx('item')
                                                                        }
                                                                        onClick={() => setNote('Covid-19 Selfcare')}
                                                                    >
                                                                        <p>Covid-19 Selfcare</p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className={cx('form-group')}>
                                                                <div className={cx('form-label')}>
                                                                    <FontAwesomeIcon icon={faCalendar} />
                                                                    <span>Start-Time Off</span>
                                                                </div>
                                                                <div className={cx('content')}>
                                                                    <div className={cx('calender-wrap')}>
                                                                        <DateRange
                                                                            onChange={(item) =>
                                                                                setState([item.selection])
                                                                            }
                                                                            showSelectionPreview={true}
                                                                            moveRangeOnFirstSelection={false}
                                                                            months={1}
                                                                            ranges={state}
                                                                            direction="horizontal"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className={cx('form-group')}>
                                                                <div className={cx('form-label')}>
                                                                    <FontAwesomeIcon icon={faFile} />
                                                                    <span>Time Off Reason</span>
                                                                </div>

                                                                <div className={cx('content')}>
                                                                    <textarea placeholder="Add reason"></textarea>
                                                                </div>
                                                            </div>

                                                            <div className={cx('submit')}>
                                                                <button onClick={toggleModal}>Cancel</button>
                                                                <button
                                                                    className={cx('send')}
                                                                    onClick={() => handleSubmitUpdate(itemUpdate)}
                                                                >
                                                                    Save
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </PopperWrapper>
                                                </div>
                                            )}

                                            {isSendingRequest === true && <span>Sending request</span>}
                                        </div>
                                    </div>
                                </>
                            )}
                            {modal && typeHandleFurlough === 'delete' && (
                                <>
                                    <div className={cx('modal')}>
                                        <div className={cx('overlay')} onClick={toggleModal}></div>
                                        <div className={cx('modal-content-furlough')}>
                                            {' '}
                                            {isSendingRequest === false && (
                                                <>
                                                    <PopperWrapper>
                                                        <div className={cx('repeat')}>
                                                            <img src={itemDelete.employee.avatar} alt="avatar" />
                                                            <div className={cx('repeat-content')}>
                                                                <span className={cx('full-name-emp')}>
                                                                    {itemDelete.employee.fullName}
                                                                </span>
                                                                <span>
                                                                    send requests off {itemFurlough.totalDaysOff} days
                                                                    from{' '}
                                                                    <span className={cx('day-off-from')}>
                                                                        {' '}
                                                                        {itemDelete.offFrom}
                                                                    </span>{' '}
                                                                    to{' '}
                                                                    <span className={cx('day-off-to')}>
                                                                        {itemDelete.offTo}
                                                                    </span>{' '}
                                                                    with reason: {itemDelete.note}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className={cx('btns-action')}>
                                                            <p>Are you sure want to delete that request?</p>
                                                            <div>
                                                                <button
                                                                    className={cx('yes')}
                                                                    onClick={() =>
                                                                        handleDelete(itemDelete.furLoughInteger)
                                                                    }
                                                                >
                                                                    Yes
                                                                </button>
                                                                <button onClick={toggleModal}>No</button>
                                                            </div>
                                                        </div>
                                                    </PopperWrapper>
                                                </>
                                            )}
                                            {isSendingRequest === true && <span>Sending request</span>}
                                        </div>
                                    </div>
                                </>
                            )}
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
            )}
        </>
    );
}

export default TimeOffAdmin;
