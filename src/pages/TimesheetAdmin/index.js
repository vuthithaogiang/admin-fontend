import classNames from 'classnames/bind';
import styles from './TimesheetAdmin.module.scss';
import { useEffect, useRef, useState } from 'react';
import axios from '~/api/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';

import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';
import format from 'date-fns/format';
import { addDays } from 'date-fns';

const cx = classNames.bind(styles);

function TimesheetAdmin() {
    const [isLoading, setIsLoading] = useState(true);
    const [typeRequest, setTypeRequest] = useState('getAllThisWeek');
    const [type, setType] = useState('');
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState('DESC');
    const stateDefault = [
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 0),
            key: 'selection',
        },
    ];

    const [state, setState] = useState(stateDefault);
    const [openCalender, setOpenCalender] = useState(false);

    // useOnClickOutside(refCalender, setOpenCalender(false));

    const fetDetails = async () => {
        try {
            if (typeRequest === 'getAllFromDateToOtherDate') {
                const body = {
                    dateFrom: format(state[0].startDate, 'yyyy-MM-dd'),
                    dateTo: format(state[0].endDate, 'yyyy-MM-dd'),
                };
                const response = await axios.post(`/timesheetDetails/${typeRequest}`, body);
                if (response.data === []) {
                    console.log('no data');
                } else {
                    setData(response.data);
                    setIsLoading(false);
                }
            } else {
                const response = await axios.get(`/timesheetDetails/${typeRequest}`);
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
    }, [typeRequest, state]);

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

    return (
        <>
            {isLoading === true && <span>Loading data...</span>}
            {isLoading === false && (
                <div className={cx('wrapper')}>
                    <div className={cx('header')}>
                        <h4>Timesheet Details</h4>
                        <div className={cx('type')}>
                            <span
                                onClick={() => {
                                    setTypeRequest('getAllFromDateToOtherDate');
                                    setOpenCalender((openCalender) => !openCalender);
                                }}
                                className={typeRequest === 'getAllFromDateToOtherDate' ? cx('active') : cx('')}
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
                                onClick={() => setTypeRequest('getAllToday')}
                                className={typeRequest === 'getAllToday' ? cx('active') : cx('')}
                            >
                                Today
                            </span>
                            <span
                                onClick={() => setTypeRequest('getAllThisWeek')}
                                className={typeRequest === 'getAllThisWeek' ? cx('active') : cx('')}
                            >
                                This week
                            </span>
                            <span
                                onClick={() => setTypeRequest('getAllLastWeek')}
                                className={typeRequest === 'getAllLastWeek' ? cx('active') : cx('')}
                            >
                                Last week
                            </span>
                            <span
                                onClick={() => setTypeRequest('getAllThisMonth')}
                                className={typeRequest === 'getAllThisMonth' ? cx('active') : cx('')}
                            >
                                This Month
                            </span>
                            <span
                                onClick={() => setTypeRequest('getAll')}
                                className={typeRequest === 'getAll' ? cx('active') : cx('')}
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
                        <div className={cx('item')} key={item.id}>
                            <div className={cx('thumbnail')}>
                                <img src={item.avatar} alt="avatar" />
                            </div>

                            <span className={cx('date')}>
                                <span className={cx('day-off-week')}>{item.dayOfWeek.substr(0, 3)}</span> {item.dateIn}
                            </span>
                            {item.timeIn === null ? (
                                <span>_</span>
                            ) : (
                                <span className={cx('time-in')}>🔥 {item.timeInString}</span>
                            )}
                            {item.timeOut == null ? (
                                <span>_</span>
                            ) : (
                                <span className={cx('time-out')}>🚀 {item.timeOutString}</span>
                            )}
                            <span>{item.minusLate}</span>
                            {item.totalWork === null ? <span>_</span> : <span>{item.totalWork}</span>}
                            {item.status === 1 ? (
                                <span className={cx('status-present')}>Present</span>
                            ) : (
                                <span className={cx('status-absent')}>Absent</span>
                            )}
                            <span>{item.position}</span>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default TimesheetAdmin;
