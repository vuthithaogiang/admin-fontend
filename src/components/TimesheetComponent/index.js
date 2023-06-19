import classNames from 'classnames/bind';
import styles from './TimesheetComponent.module.scss';
import AvatarDefault from '../AvatarDefault';
import Tippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function TimesheetComponent({ item, onClick, actions }) {
    return (
        <>
            <div className={cx('wrapper')}>
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
                    <div className={cx('thumbnail')} onClick={onClick}>
                        {(item.avatar === null) | (item.avatar === '') ? (
                            <AvatarDefault firstName={item.firstName} color={'#3d81c2'} />
                        ) : (
                            <img src={item.avatar} alt="avatar" />
                        )}
                    </div>
                </Tippy>

                <span className={cx('date')}>
                    <span className={cx('day-off-week')}>{item.dayOfWeek.substr(0, 3)}</span> {item.dayOfMonth}{' '}
                    {item.monthInString}
                </span>
                {item.timeIn === null ? <span>_</span> : <span className={cx('time-in')}>🔥 {item.timeInString}</span>}
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
                <span className={cx('wrap-actions')}>
                    {item.position}
                    {actions && (
                        <span className={cx('actions')}>
                            <span>
                                {' '}
                                <FontAwesomeIcon icon={faPen} />
                            </span>
                            <span>
                                {' '}
                                <FontAwesomeIcon icon={faTrash} />
                            </span>
                        </span>
                    )}
                </span>
            </div>
        </>
    );
}

export default TimesheetComponent;
