import classNames from 'classnames/bind';
import styles from './Dashboard.module.scss';

const cx = classNames.bind(styles);

function Dashboard() {
    return <div className={cx('wrapper')}>dasboard</div>;
}

export default Dashboard;
