import classNames from 'classnames/bind';

import styles from './AddFurlough.module.scss';
import images from '~/assets/images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faClock, faFile } from '@fortawesome/free-solid-svg-icons';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import format from 'date-fns/format';
import { useEffect, useState } from 'react';
import { addDays } from 'date-fns';

const cx = classNames.bind(styles);

function AddFurlough() {
    const [calender, setCalender] = useState('');
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 7),
            key: 'selection',
        },
    ]);

    useEffect(() => {
        setCalender(format(new Date(), 'yyyy-MM-dd'));
    }, []);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('form')}>
                    <div className={cx('form-group')}>
                        <div className={cx('form-label')}>
                            <FontAwesomeIcon icon={faClock} />
                            <span>Time off Type</span>
                        </div>

                        <div className={cx('content')}>
                            <div className={cx('item')}>
                                <p>PTO</p>
                            </div>
                            <div className={cx('item')}>
                                <p>Slick Leave</p>
                            </div>
                            <div className={cx('item')}>
                                <p>Parent Duly</p>
                            </div>
                            <div className={cx('item')}>
                                <p>Covid-19 Family Care</p>
                            </div>
                            <div className={cx('item')}>
                                <p>Vacation</p>
                            </div>
                            <div className={cx('item')}>
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
                                <DateRangePicker
                                    onChange={(item) => setState([item.selection])}
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

                    <div className={cx('submit')}></div>
                </div>

                <div className={cx('img')}>
                    <img src={images.decoration2} alt="decor" />
                </div>
            </div>
        </div>
    );
}

export default AddFurlough;
