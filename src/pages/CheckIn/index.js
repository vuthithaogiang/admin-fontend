import classNames from 'classnames/bind';
import styles from './CheckIn.module.scss';
import { useState } from 'react';
import images from '~/assets/images';

const cx = classNames.bind(styles);

function CheckIn() {
    const dayOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

    let time = new Date().toLocaleTimeString();

    console.log(new Date().getDay());

    const [ctime, setCtime] = useState(time);

    const updateTime = () => {
        time = new Date().toLocaleTimeString();
        setCtime(time);
    };

    setInterval(updateTime, 1000);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('left')}>
                <div className={cx('clock')}>
                    <div className={cx('inner-clock')}>
                        <div className={cx('week-day')}>
                            {dayOfWeek.map((item, index) => (
                                <span className={index + 1 == new Date().getDay() ? cx('active') : cx('')} key={index}>
                                    {item}
                                </span>
                            ))}
                        </div>
                        <div className={cx('alarm')}>{ctime}</div>
                    </div>
                </div>

                <div className={cx('check-in')}>
                    <div className={cx('form-input')}>
                        <label for="inp" class="inp">
                            <input type="text" className={cx('input')} id="inp" placeholder="&nbsp;" />
                            <span className={cx('label')}>Employee ID</span>
                        </label>

                        <div className={cx('send')}></div>
                    </div>
                </div>
            </div>

            <div className={cx('right')}>
                <img src={images.house} alt="" />
            </div>
        </div>
    );
}

export default CheckIn;
