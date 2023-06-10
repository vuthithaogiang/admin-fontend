import classNames from 'classnames/bind';
import styles from './HistoryFurloughs.module.scss';
import { useEffect, useState } from 'react';
import axios from '~/api/axios';
import { useParams } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faCheck, faClock, faFile, faFire, faXmark } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';

const cx = classNames.bind(styles);

function HistoryFurloughs() {
    const [isLoading, setIsLoading] = useState(true);
    const params = useParams();
    const [data, setData] = useState([]);

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`/furlough/getAllByEmpId/${params.empId}`);

            console.log(response.data);

            if (response.data.length === 0) {
                console.log('undefined!');
            } else {
                setData(response.data);
                setIsLoading(false);
            }
        } catch (error) {}
    };

    useEffect(() => {
        fetchDetails();
    }, [params.empId]);

    return (
        <>
            {isLoading === true && <span>Loading or No data ...</span>}

            {isLoading === false && (
                <div className={cx('wrapper')}>
                    <div className={cx('header')}>
                        <h3>Recent Furloughs</h3>
                    </div>

                    <div className={cx('list-furlough')}>
                        {/* 1 */}
                        <div className={cx('item-sort')}>
                            <span>Employee</span>
                        </div>
                        {/* 2 */}
                        <div className={cx('item-sort')}>
                            <FontAwesomeIcon icon={faClock} />
                            <span>Update At</span>
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
                        {data.map((item) => (
                            <>
                                {/* 1 */}
                                <div className={cx('item')} key={item.furloughId}>
                                    <span className={cx('avatar')}>
                                        <img src={item.employee.avatar} alt="avatar" />
                                    </span>
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
                                                        From: <span className={cx('time-from')}>{item.offFrom}</span> -
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
                                </div>
                            </>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default HistoryFurloughs;
