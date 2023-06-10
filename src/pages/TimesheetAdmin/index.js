import classNames from 'classnames/bind';
import styles from './TimesheetAdmin.module.scss';

const cx = classNames.bind(styles);

function TimesheetAdmin() {
    return <div className={cx('wrapper')}>Timesheet Admin</div>;
}

export default TimesheetAdmin;
