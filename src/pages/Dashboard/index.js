import classNames from 'classnames/bind';
import styles from './Dashboard.module.scss';
import axios from '~/api/axios';
import { useState } from 'react';
import images from '~/assets/images';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const cx = classNames.bind(styles);

function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);

    const data = [
        {
            name: 'MON',
            hours: 8,
        },
        {
            name: 'TUE',
            hours: 6,
        },
        {
            name: 'WED',
            hours: 8,
        },
        {
            name: 'THUR',
            hours: 5,
        },
        {
            name: 'FRI',
            hours: 2,
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

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <div className={cx('info')}>
                    <div className={cx('name')}>
                        <h3>Hello, Margaret!</h3>
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
                            100
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
                            30h
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
        </div>
    );
}

export default Dashboard;
