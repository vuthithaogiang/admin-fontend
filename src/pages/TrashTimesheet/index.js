import classNames from 'classnames/bind';
import styles from './TrashTimesheet.module.scss';
import { useEffect, useState } from 'react';
import axios from '~/api/axios';
import AvatarDefault from '~/components/AvatarDefault';
import Tippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import { useNavigate } from 'react-router';

const cx = classNames.bind(styles);

function TrashTimesheet() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetDetails = async () => {
        try {
            const response = await axios.get('/timesheet/getAllInTrash');

            if (response.data === []) {
                console.log('no data');
            } else {
                setData(response.data);
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleRestore = async (timesheetId) => {
        try {
            const response = await axios.post(`/timesheet/restoreFromTrash/${timesheetId}`);

            if (response.data === 'undefined') {
                notifyError();
            } else {
                notifySuccess();
                window.location.reload(false);
            }
        } catch (error) {
            notifyError();
        }
    };

    useEffect(() => {
        fetDetails();
    }, []);

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
            {isLoading ? (
                <span>Loading data ...</span>
            ) : (
                <>
                    <div className={cx('wrapper')}>
                        <div className={cx('header')} onClick={() => navigate('/admin/timesheet')}>
                            <span>Go to timesheet</span>
                        </div>

                        <div className={cx('timesheet-filter')}>
                            <span className={cx('item-sort')}>Employee</span>
                            <span className={cx('item-sort')}>Delete At</span>
                            <span className={cx('item-sort')}>Date</span>
                            <span className={cx('item-sort')}>Time In</span>
                            <span className={cx('item-sort')}>Time out</span>
                            <span className={cx('item-sort')}>Late</span>
                            <span className={cx('item-sort')}>Total Worked</span>
                            <span className={cx('item-sort')}>Status</span>
                            <span className={cx('item-sort')}>Position</span>
                        </div>

                        {data.map((item) => (
                            <div className={cx('item')} key={item.timesheetId}>
                                <Tippy
                                    interactive
                                    render={(attrs) => (
                                        <div className={cx('full-name')} tabIndex={'-1'} {...attrs}>
                                            <PopperWrapper>
                                                <p>{item.employee.fullName}</p>
                                            </PopperWrapper>
                                        </div>
                                    )}
                                    placement="bottom-start"
                                >
                                    <div className={cx('thumbnail')}>
                                        {(item.employee.avatar === null) | (item.employee.avatar === '') ? (
                                            <AvatarDefault firstName={item.employee.firstName} color={'#3d81c2'} />
                                        ) : (
                                            <img src={item.employee.avatar} alt="avatar" />
                                        )}
                                    </div>
                                </Tippy>

                                <span>{item.updateAt.substr(11)} </span>

                                <span className={cx('date')}>
                                    <span className={cx('day-off-week')}>{item.dayOfWeek.substr(0, 3)}</span>{' '}
                                    {item.dayOfMonth} {item.monthInString}
                                </span>
                                {item.timeIn === null ? (
                                    <span>_</span>
                                ) : (
                                    <span className={cx('time-in')}>🔥 {item.timeIn.substr(11)}</span>
                                )}
                                {item.timeOut === null ? (
                                    <span>_</span>
                                ) : (
                                    <span className={cx('time-out')}>🚀 {item.timeOut.substr(11)}</span>
                                )}
                                <span>{item.minusLate}</span>
                                {item.toTalHourWork === null ? <span>_</span> : <span>{item.toTalHourWork}</span>}
                                {item.status === 1 ? (
                                    <span className={cx('status-present')}>Present</span>
                                ) : (
                                    <span className={cx('status-absent')}>Absent</span>
                                )}
                                <span className={cx('wrap-actions')}>
                                    {item.employee.position}

                                    <span className={cx('actions')}>
                                        <span className={cx('restore')} onClick={() => handleRestore(item.timesheetId)}>
                                            Restore
                                        </span>
                                        <span className={cx('delete')}>Delete</span>
                                    </span>
                                </span>
                            </div>
                        ))}
                    </div>
                </>
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

export default TrashTimesheet;
