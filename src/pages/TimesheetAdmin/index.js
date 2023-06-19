import classNames from 'classnames/bind';
import styles from './TimesheetAdmin.module.scss';
import { useEffect, useRef, useState } from 'react';
import axios from '~/api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';
import format from 'date-fns/format';
import { addDays } from 'date-fns';
import { useNavigate } from 'react-router';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import AvatarDefault from '~/components/AvatarDefault';
import Tippy from '@tippyjs/react/headless';
import useOnClickOutside from '~/hooks/useOnClickOutside';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const cx = classNames.bind(styles);

function TimesheetAdmin() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [typeRequest, setTypeRequest] = useState('today');
    const [root, setRoot] = useState('getAll');
    const [type, setType] = useState('');
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState('DESC');
    const [modal, setModal] = useState(false);
    const [typeHandle, setTypeHandle] = useState('');
    const [timesheetIdDelete, setTimesheetIdDelete] = useState(null);
    const [timesheetEdit, setTimesheetEdit] = useState({});
    const refModal = useRef();
    const [timeInValue, setTimeInValue] = useState(null);
    const [timeOutValue, setTimeOutValue] = useState(null);

    const stateDefault = [
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 0),
            key: 'selection',
        },
    ];

    const [state, setState] = useState(stateDefault);
    const [openCalender, setOpenCalender] = useState(false);

    const toggleModal = () => {
        setModal(!modal);
    };
    if (modal) {
        document.body.classList.add('active-modal');
    } else {
        document.body.classList.remove('active-modal');
    }
    useOnClickOutside(refModal, toggleModal);

    const handleOpenModalDelete = (timesheetId) => {
        if (timesheetId) {
            setTypeHandle('delete');
            setTimesheetIdDelete(timesheetId);
            setModal(true);
        }
    };

    const handleOpenModalFormEdit = (item) => {
        if (item) {
            setTypeHandle('edit');
            setTimesheetEdit(item);
            setModal(true);
        }
    };

    const handleDelete = async (timesheetId) => {
        console.log(timesheetId);

        try {
            const response = await axios.post(`/timesheet/saveToTrash/${timesheetId}`);

            if (response.data === 'undefined') {
                notifyError();
            } else {
                notifySuccess();
                // window.location.reload(false);
            }
        } catch (error) {
            notifyError();
        }
    };

    const handleEdit = async (timesheet) => {
        if (timeInValue === null || timeOutValue === null) {
            notifyError();
        } else {
            var timeInString = `${timeInValue.$H}:${timeInValue.$m}:${timeInValue.$s}`;
            var timeOutString = `${timeOutValue.$H}:${timeOutValue.$m}:${timeOutValue.$s}`;
            console.log(timeInString);
            console.log(timeOutString);

            var formData = {
                timesheetId: timesheet.timesheetId,
                timeIn: `${timesheet.dateIn} ${timeInString}`,
                timeOut: `${timesheet.dateIn} ${timeOutString}`,
            };

            try {
                const response = await axios.put(`/timesheet/edit`, formData);

                if (response.data === 'undefined') {
                    notifyError();
                } else {
                    notifySuccess();
                    // window.location.reload(true);
                }
            } catch (error) {
                notifyError();
            }
        }
    };

    const fetDetails = async () => {
        try {
            if (typeRequest === 'dueDate') {
                const body = {
                    dateFrom: format(state[0].startDate, 'yyyy-MM-dd'),
                    dateTo: format(state[0].endDate, 'yyyy-MM-dd'),
                };
                const response = await axios.post(`/timesheetDetails/${root}/${typeRequest}`, body);
                if (response.data === []) {
                    console.log('no data');
                } else {
                    setData(response.data);
                    setIsLoading(false);
                }
            } else {
                const response = await axios.get(`/timesheetDetails/${root}/${typeRequest}`);
                if (response.data === []) {
                    console.log('no data');
                } else {
                    setData(response.data);
                    setIsLoading(false);
                }
            }
        } catch (error) {
            console.log('failed!');
        }
    };

    useEffect(() => {
        fetDetails();
    }, [typeRequest, state, root]);

    const sorting = (col) => {
        setType(col);

        if (filter === 'DESC') {
            const sorted = data.sort((a, b) => (a[col] < b[col] ? 1 : -1));
            setData(sorted);
            setFilter('ASC');
        }

        if (filter === 'ASC') {
            const sorted = data.sort((a, b) => (a[col] > b[col] ? 1 : -1));
            setData(sorted);

            setFilter('DESC');
        }
    };

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

    return (
        <>
            {isLoading === true && <span>Loading data...</span>}
            {isLoading === false && (
                <div className={cx('wrapper')}>
                    <div className={cx('header')}>
                        <div>
                            <h4
                                onClick={() => {
                                    setRoot('getAll');
                                    setTypeRequest('today');
                                }}
                            >
                                Timesheet Details
                            </h4>
                            <span className={cx('go-to-trash')} onClick={() => navigate('/admin/trash')}>
                                Go to Trash{' '}
                            </span>
                        </div>
                        <div className={cx('type')}>
                            <span
                                onClick={() => {
                                    setTypeRequest('dueDate');
                                    setOpenCalender((openCalender) => !openCalender);
                                }}
                                className={typeRequest === 'dueDate' ? cx('active') : cx('')}
                            >
                                <FontAwesomeIcon icon={faCalendar} />
                                Due Date
                            </span>
                            {openCalender && (
                                <>
                                    <div className={cx('calender-wrap')}>
                                        <DateRange
                                            onChange={(item) => setState([item.selection])}
                                            showSelectionPreview={true}
                                            moveRangeOnFirstSelection={false}
                                            months={1}
                                            ranges={state}
                                            direction="horizontal"
                                        />
                                    </div>
                                </>
                            )}
                            <span
                                onClick={() => setTypeRequest('today')}
                                className={typeRequest === 'today' ? cx('active') : cx('')}
                            >
                                Today
                            </span>
                            <span
                                onClick={() => setTypeRequest('thisWeek')}
                                className={typeRequest === 'thisWeek' ? cx('active') : cx('')}
                            >
                                This week
                            </span>
                            <span
                                onClick={() => setTypeRequest('lastWeek')}
                                className={typeRequest === 'lastWeek' ? cx('active') : cx('')}
                            >
                                Last week
                            </span>
                            {/* <span
                                onClick={() => setTypeRequest('thisMonth')}
                                className={typeRequest === 'thisMonth' ? cx('active') : cx('')}
                            >
                                This Month
                            </span> */}
                            <span
                                onClick={() => setTypeRequest('all')}
                                className={typeRequest === 'all' ? cx('active') : cx('')}
                            >
                                View All
                            </span>
                        </div>
                    </div>

                    <div className={cx('timesheet-filter')}>
                        <span className={cx('item-sort')} onClick={() => sorting('empId')}>
                            Employee
                            {type !== 'empId' && <FontAwesomeIcon icon={faSort} />}
                            {type === 'empId' && filter === 'ASC' && (
                                <FontAwesomeIcon className={cx('icon-down')} icon={faSortDown} />
                            )}
                            {type === 'empId' && filter === 'DESC' && (
                                <FontAwesomeIcon className={cx('icon-up')} icon={faSortUp} />
                            )}
                        </span>
                        <span className={cx('item-sort')} onClick={() => sorting('dateIn')}>
                            Date
                            {type !== 'dateIn' && <FontAwesomeIcon icon={faSort} />}
                            {type === 'dateIn' && filter === 'ASC' && (
                                <FontAwesomeIcon className={cx('icon-down')} icon={faSortDown} />
                            )}
                            {type === 'dateIn' && filter === 'DESC' && (
                                <FontAwesomeIcon className={cx('icon-up')} icon={faSortUp} />
                            )}
                        </span>
                        <span className={cx('item-sort')} onClick={() => sorting('timeIn')}>
                            Time In
                            {type !== 'timeIn' && <FontAwesomeIcon icon={faSort} />}
                            {type === 'timeIn' && filter === 'ASC' && (
                                <FontAwesomeIcon className={cx('icon-down')} icon={faSortDown} />
                            )}
                            {type === 'timeIn' && filter === 'DESC' && (
                                <FontAwesomeIcon className={cx('icon-up')} icon={faSortUp} />
                            )}
                        </span>
                        <span className={cx('item-sort')} onClick={() => sorting('timeOut')}>
                            Time out
                            {type !== 'timeOut' && <FontAwesomeIcon icon={faSort} />}
                            {type === 'timeOut' && filter === 'ASC' && (
                                <FontAwesomeIcon className={cx('icon-down')} icon={faSortDown} />
                            )}
                            {type === 'timeOut' && filter === 'DESC' && (
                                <FontAwesomeIcon className={cx('icon-up')} icon={faSortUp} />
                            )}
                        </span>
                        <span className={cx('item-sort')} onClick={() => sorting('minusLate')}>
                            Late
                            {type !== 'minusLate' && <FontAwesomeIcon icon={faSort} />}
                            {type === 'minusLate' && filter === 'ASC' && (
                                <FontAwesomeIcon className={cx('icon-down')} icon={faSortDown} />
                            )}
                            {type === 'minusLate' && filter === 'DESC' && (
                                <FontAwesomeIcon className={cx('icon-up')} icon={faSortUp} />
                            )}
                        </span>
                        <span className={cx('item-sort')} onClick={() => sorting('totalWork')}>
                            Total Worked
                            {type !== 'totalWork' && <FontAwesomeIcon icon={faSort} />}
                            {type === 'totalWork' && filter === 'ASC' && (
                                <FontAwesomeIcon className={cx('icon-down')} icon={faSortDown} />
                            )}
                            {type === 'totalWork' && filter === 'DESC' && (
                                <FontAwesomeIcon className={cx('icon-up')} icon={faSortUp} />
                            )}
                        </span>
                        <span className={cx('item-sort')}>Status</span>
                        <span className={cx('item-sort')} onClick={() => sorting('position')}>
                            Position
                            {type !== 'position' && <FontAwesomeIcon icon={faSort} />}
                            {type === 'position' && filter === 'ASC' && (
                                <FontAwesomeIcon className={cx('icon-down')} icon={faSortDown} />
                            )}
                            {type === 'position' && filter === 'DESC' && (
                                <FontAwesomeIcon className={cx('icon-up')} icon={faSortUp} />
                            )}
                        </span>
                    </div>

                    {data.map((item) => (
                        <div className={cx('wrapper-item')} key={item.timesheetId}>
                            <Tippy
                                interactive
                                render={(attrs) => (
                                    <div className={cx('full-name')} tabIndex={'-1'} {...attrs}>
                                        <PopperWrapper>
                                            <p>{item.fullNameEmp}</p>
                                        </PopperWrapper>
                                    </div>
                                )}
                                placement="bottom-start"
                            >
                                <div className={cx('thumbnail')} onClick={() => setRoot(`getAllByEmpId/${item.empId}`)}>
                                    {(item.avatar === null) | (item.avatar === '') ? (
                                        <AvatarDefault firstName={item.firstName} color={'#3d81c2'} />
                                    ) : (
                                        <img src={item.avatar} alt="avatar" />
                                    )}
                                </div>
                            </Tippy>

                            <span className={cx('date')}>
                                <span className={cx('day-off-week')}>{item.dayOfWeek.substr(0, 3)}</span>{' '}
                                {item.dayOfMonth} {item.monthInString}
                            </span>

                            <span className={cx('time-in')}>
                                {item.timeIn === null ? <>_</> : <>🎉{item.timeInString}</>}
                            </span>

                            <span className={cx('time-out')}>
                                {item.timeOut === null ? <>_</> : <>🚀{item.timeOutString}</>}
                            </span>

                            <span>{item.minusLate}</span>
                            {item.totalWork === null ? <span>_</span> : <span>{item.totalWork}</span>}
                            {item.status === 1 ? (
                                <span className={cx('status-present')}>Present</span>
                            ) : (
                                <span className={cx('status-absent')}>Absent</span>
                            )}
                            <span className={cx('wrap-actions')}>
                                {item.position}

                                <span className={cx('actions')}>
                                    <span onClick={() => handleOpenModalFormEdit(item)}>
                                        {' '}
                                        <FontAwesomeIcon icon={faPen} />
                                    </span>
                                    <span onClick={() => handleOpenModalDelete(item.timesheetId)}>
                                        {' '}
                                        <FontAwesomeIcon icon={faTrash} />
                                    </span>
                                </span>
                            </span>
                        </div>
                    ))}

                    {modal && typeHandle === 'delete' && timesheetIdDelete !== null && (
                        <>
                            <div className={cx('modal')}>
                                <div className={cx('overlay')} onClick={toggleModal}></div>
                                <div className={cx('modal-content')}>
                                    <PopperWrapper>
                                        <div className={cx('modal-btns-action')}>
                                            <p>Are you sure want to delete that timesheet?</p>
                                            <div>
                                                <button
                                                    className={cx('yes')}
                                                    onClick={() => handleDelete(timesheetIdDelete)}
                                                >
                                                    Yes
                                                </button>
                                                <button onClick={toggleModal}>No</button>
                                            </div>
                                        </div>
                                    </PopperWrapper>
                                </div>
                            </div>
                        </>
                    )}
                    {modal && typeHandle === 'edit' && timesheetEdit !== {} && (
                        <>
                            <div className={cx('modal')}>
                                <div className={cx('overlay')} onClick={toggleModal}></div>
                                <div className={cx('modal-content')}>
                                    <PopperWrapper>
                                        <div className={cx('modal-header')}>
                                            <span className={cx('full-name-emp')}>{timesheetEdit.fullNameEmp}</span>
                                            <span>
                                                is present in{' '}
                                                <span className={cx('datein')}>
                                                    {timesheetEdit.dayOfWeek} {timesheetEdit.dayOfMonth}{' '}
                                                    {timesheetEdit.monthInString}
                                                </span>
                                                . Check in:
                                                <span className={cx('checkin')}>{timesheetEdit.timeInString}</span> &
                                                Check out:
                                                <span className={cx('checkout')}>
                                                    {timesheetEdit.timeOut === null && <> _ </>}{' '}
                                                    {timesheetEdit.timeOutString}
                                                </span>
                                                with total misnus late: {timesheetEdit.minusLate}
                                            </span>
                                        </div>
                                        <div className={cx('modal-form')}>
                                            <div className={cx('group-item')}>
                                                <span className={cx('label')}>Time in</span>
                                                <div className={cx('value')}>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs} style={{}}>
                                                        <TimePicker
                                                            label="Basic time picker"
                                                            value={timeInValue}
                                                            onChange={(value) => setTimeInValue(value)}
                                                        />
                                                    </LocalizationProvider>
                                                </div>
                                            </div>
                                            <div className={cx('group-item')}>
                                                <span className={cx('label')}>Time out</span>
                                                <div className={cx('value')}>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <TimePicker
                                                            label="Basic time picker"
                                                            value={timeOutValue}
                                                            onChange={(value) => setTimeOutValue(value)}
                                                        />
                                                    </LocalizationProvider>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={cx('modal-btns-action')}>
                                            <p>Are you sure want to change that timesheet?</p>
                                            <div>
                                                <button className={cx('yes')} onClick={() => handleEdit(timesheetEdit)}>
                                                    Yes
                                                </button>
                                                <button onClick={toggleModal}>No</button>
                                            </div>
                                        </div>
                                    </PopperWrapper>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

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

export default TimesheetAdmin;
