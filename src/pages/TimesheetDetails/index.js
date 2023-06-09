import classNames from 'classnames/bind';
import styles from './TimesheetDetails.module.scss';

const cx = classNames.bind(styles);

function TimesheetDetails() {
    return <div className={cx('wrapper')}>Timesheet Details</div>;
}

export default TimesheetDetails;
