import classNames from 'classnames/bind';
import styles from './TimeOffAdmin.module.scss';

const cx = classNames.bind(styles);

function TimeOffAdmin() {
    return <div className={cx('wrapper')}>Time off Admin</div>;
}

export default TimeOffAdmin;
