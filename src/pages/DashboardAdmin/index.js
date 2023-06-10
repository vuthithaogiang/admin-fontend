import classNames from 'classnames/bind';
import styles from './DashboardAdmin.module.scss';
import images from '~/assets/images';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from '~/api/axios';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRange } from 'react-date-range';
import format from 'date-fns/format';
import { addDays } from 'date-fns';

const cx = classNames.bind(styles);

function DashboardAdmin() {
    const [activityLog, setActivityLog] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`/timesheetLog/get${filter}`);

            console.log(response.data);

            if (response.data === []) {
                console.log('no data');
            } else {
                setActivityLog(response.data);
                setIsLoading(false);
            }
        } catch (error) {
            console.log('error');
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [filter]);

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
                            <div className={cx('value')}>300</div>
                            <div className={cx('type')}>Total Request Time off</div>
                        </div>
                        <div className={cx('sts-item')}>
                            <div className={cx('thumb')}>
                                <img src={images.icon1} alt="icon" />
                                <span>
                                    <strong>+3Hs longer</strong> vs last month
                                </span>
                            </div>
                            <div className={cx('value')}>300</div>
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
                            <div className={cx('value')}>300</div>
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
                                            <img className={cx('log-avatar')} src={item.avatar} />
                                        </span>
                                        <span className={cx('full-name')}>
                                            <strong>{item.fullNameEmp}</strong> is present.
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default DashboardAdmin;
