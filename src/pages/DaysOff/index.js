import classNames from 'classnames/bind';
import styles from './DaysOff.module.scss';

const cx = classNames.bind(styles);

function DaysOff() {
    return <div className={cx('wrapper')}>Days off</div>;
}

export default DaysOff;
