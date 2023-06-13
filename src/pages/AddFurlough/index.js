import classNames from 'classnames/bind';

import styles from './AddFurlough.module.scss';
import images from '~/assets/images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faClock, faFile } from '@fortawesome/free-solid-svg-icons';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import format from 'date-fns/format';
import { useState } from 'react';
import { addDays } from 'date-fns';
import axios from '~/api/axios';
import { useParams } from 'react-router';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const cx = classNames.bind(styles);

function AddFurlough() {
    const [sucess, setSucces] = useState(false);
    const params = useParams();
    const [note, setNote] = useState('');
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 1),
            key: 'selection',
        },
    ]);

    const notifyError = () => {
        toast.error(`Emp${params.empId} send furlough faild!`, {
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
        toast.success(`Emp${params.empId} send fulough success!`, {
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

    const handleSubmit = async () => {
        if (note !== '') {
            try {
                const response = await axios.post(
                    `/furlough?empId=${params.empId}`,
                    {
                        offTo: format(state[0].endDate, 'yyyy-MM-dd'),
                        offFrom: format(state[0].startDate, 'yyyy-MM-dd'),
                        note: note,
                    },
                    {
                        headers: { 'Content-Type': 'application/json' },
                    },
                );

                console.log(response);

                if (response.data === 'undefined') {
                    setSucces(false);

                    notifyError();
                } else {
                    setSucces(true);
                    notifySuccess();
                }
            } catch (error) {
                setSucces(false);
                notifyError();
            }
        } else {
            notifyError();
        }
    };

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
                            <div
                                className={note === 'PTO' ? cx('item', 'active') : cx('item')}
                                onClick={() => setNote('PTO')}
                            >
                                <p>PTO</p>
                            </div>
                            <div
                                className={note === 'Slick Leave' ? cx('item', 'active') : cx('item')}
                                onClick={() => setNote('Slick Leave')}
                            >
                                <p>Slick Leave</p>
                            </div>
                            <div
                                className={note === 'Parent Duty' ? cx('item', 'active') : cx('item')}
                                onClick={() => setNote('Parent Duty')}
                            >
                                <p>Parent Duty</p>
                            </div>
                            <div
                                className={note === `Covid-19 Family Care` ? cx('item', 'active') : cx('item')}
                                onClick={() => setNote('Covid-19 Family Care')}
                            >
                                <p>Covid-19 Family Care</p>
                            </div>
                            <div
                                className={note === 'Vacation' ? cx('item', 'active') : cx('item')}
                                onClick={() => setNote('Vacation')}
                            >
                                <p>Vacation</p>
                            </div>
                            <div
                                className={note === `Covid-19 Selfcare` ? cx('item', 'active') : cx('item')}
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

                    <div className={cx('submit')}>
                        <button>Cancel</button>
                        <button className={cx('send')} onClick={handleSubmit}>
                            Save
                        </button>
                    </div>
                </div>

                <div className={cx('img')}>
                    <img src={images.decoration2} alt="decor" />
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
        </div>
    );
}

export default AddFurlough;
