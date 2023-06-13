import classNames from 'classnames/bind';
import styles from './Dashboard.module.scss';
import axios from '~/api/axios';
import { useEffect, useState } from 'react';
import images from '~/assets/images';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router';

const cx = classNames.bind(styles);

function Dashboard() {
    const dataDefault = [
        {
            name: 'MON',
            hours: null,
        },
        {
            name: 'TUE',
            hours: 0,
        },
        {
            name: 'WED',
            hours: 0,
        },
        {
            name: 'THUR',
            hours: 0,
        },
        {
            name: 'FRI',
            hours: 0,
        },
        {
            name: 'SAT',
            hours: 0,
        },
        {
            name: 'SUN',
            hours: 0,
        },
    ];

    const navigate = useNavigate();

    const [data, setData] = useState(dataDefault);
    const [isLoading, setIsLoading] = useState(true);
    const [employeeInfo, setEmployeeInfo] = useState([]);
    const [filter, setFilter] = useState('DESC');
    const [type, setType] = useState('');

    const [hoursTotal, setHoursTotal] = useState(0);

    const params = useParams();

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`/timesheetDetails/getAllByEmpIdOnWeek/${params.empId}`);
            const rechartData = await axios.get(`/timesheetDetails/getAllByEmpIdLastWeek/${params.empId}`);

            if ((response.data === []) | (rechartData === [])) {
                console.log('undefined!!');
            } else {
                setEmployeeInfo(response.data);

                const resultStats = [];
                let totalHs = 0;

                for (var i = 0; i < rechartData.data.length; i++) {
                    var object = {
                        name: rechartData.data[i].dayOfWeek.substr(0, 3),
                        hours: rechartData.data[i].totalWork === null ? 0 : rechartData.data[i].totalWork,
                    };

                    resultStats.push(object);
                    totalHs += rechartData.data[i].totalWork;
                }

                console.log(resultStats);
                setData(resultStats);
                setHoursTotal(totalHs);
                setIsLoading(false);
            }
        } catch (error) {
            console.log('undefined!!');
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [params.empId]);

    const sorting = (col) => {
        setType(col);

        if (filter === 'DESC') {
            const sorted = employeeInfo.sort((a, b) => (a[col] < b[col] ? 1 : -1));
            setEmployeeInfo(sorted);
            setFilter('ASC');
        }

        if (filter === 'ASC') {
            const sorted = employeeInfo.sort((a, b) => (a[col] > b[col] ? 1 : -1));
            setEmployeeInfo(sorted);

            setFilter('DESC');
        }
    };

    return (
        <>
            {isLoading === true && <span>Loading data ....</span>}

            {isLoading === false && (
                <>
                    <div className={cx('wrapper')}>
                        <div className={cx('header')}>
                            <div className={cx('info')}>
                                <div className={cx('name')}>
                                    <h3>Hello, {employeeInfo[0].fullNameEmp}!</h3>
                                    <p>Track your progress here. You almost reach a goal</p>
                                </div>
                                <div className={cx('today')}>
                                    <div>
                                        <img src={images.math} alt="icon" />
                                        <span>16 May, 2023</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={cx('stats')}>
                            {/* 1 */}
                            <div className={cx('stats-item')}>
                                <div className={cx('icon')}>
                                    <img src={images.group} alt="icon" />
                                </div>
                                <div className={cx('content')}>
                                    <span className={cx('title')}>Status</span>
                                    <span className={cx('number')}>On going</span>
                                </div>
                            </div>

                            {/* 2 */}
                            <div className={cx('stats-item')}>
                                <div className={cx('icon')}>
                                    <img src={images.clock} alt="icon" />
                                </div>
                                <div className={cx('content')}>
                                    <span className={cx('title')}>Minus Late</span>
                                    <span className={cx('number')}>
                                        {employeeInfo[0].minusLate}
                                        <strong>today</strong>
                                    </span>
                                </div>
                            </div>

                            {/* 3 */}
                            <div className={cx('stats-item')}>
                                <div className={cx('icon')}>
                                    <img src={images.calendar} alt="icon" />
                                </div>
                                <div className={cx('content')}>
                                    <span className={cx('title')}>Fisnished</span>
                                    <span className={cx('number')}>
                                        {hoursTotal}
                                        <strong>this week</strong>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className={cx('main')}>
                            <div className={cx('time-report')}>
                                <div className={cx('popups')}>
                                    <div className={cx('dots')}>
                                        <span className={cx('dot')}></span>
                                        <span className={cx('dot')}></span>
                                        <span className={cx('dot')}></span>
                                    </div>
                                </div>
                                <BarChart
                                    width={460}
                                    height={360}
                                    data={data}
                                    margin={{
                                        top: 20,
                                        right: 20,
                                        left: 15,
                                        bottom: 10,
                                    }}
                                    barSize={16}
                                >
                                    <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <CartesianGrid strokeDasharray="2 2" />
                                    <Bar dataKey="hours" fill="#010101" background={{ fill: '#fff' }} />
                                </BarChart>
                            </div>
                            <div className={cx('desc')}>
                                <div className={cx('desc-item')}>
                                    <div className={cx('icon')}>
                                        <img src={images.icon1} alt="icon" />
                                    </div>
                                    <div>
                                        <p>Your Activity</p>
                                        <span>Progress increased in this week</span>
                                    </div>
                                </div>
                                <div className={cx('desc-item')}>
                                    <div className={cx('icon')}>
                                        <img src={images.icon2} alt="icon" />
                                    </div>
                                    <div>
                                        <p>Check Furlough</p>
                                        <span>Check accept/deny</span>
                                    </div>
                                </div>

                                <div className={cx('desc-item')}>
                                    <div className={cx('icon')}>
                                        <img src={images.icon3} alt="icon" />
                                    </div>
                                    <div>
                                        <p>Follow Up</p>
                                        <span>Follow Total of hourr working</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={cx('recent-checkin')}>
                            <h4>Recent your Check In in this week:</h4>
                            <div className={cx('timesheet-filter')}>
                                <span className={cx('item-sort')}>Employee</span>
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
                                    Time Out
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
                                <span className={cx('item-sort')}>Position</span>
                            </div>

                            {employeeInfo.map((item) => (
                                <div className={cx('item')} key={item.id}>
                                    <div className={cx('thumb-nail')}>
                                        <img src={item.avatar} alt="avatar" className={cx('avatar')} />
                                    </div>

                                    <span>{item.dateIn}</span>
                                    {item.timeIn === null ? <span>_</span> : <span>{item.timeInString}</span>}
                                    {item.timeOut === null ? <span>_</span> : <span>{item.timeOutString}</span>}
                                    <span>{item.minusLate}</span>
                                    {item.totalWork === null ? <span>_</span> : <span>{item.totalWork}</span>}
                                    {item.status === 1 && <span className={cx('status-present')}>Present</span>}
                                    {item.status === 0 && <span className={cx('status-absent')}>Absent</span>}
                                    <span>{item.position}</span>
                                </div>
                            ))}

                            <div className={cx('view-all')}>
                                <button onClick={() => navigate(`/view/${params.empId}/timesheetDetails`)}>
                                    View all
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default Dashboard;
