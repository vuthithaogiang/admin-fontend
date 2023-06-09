import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function MenuItem({ data, name, active, onClick }) {
    return (
        <Link to={data.path}>
            <div
                className={name === data.itemContent && active === true ? cx('menu-item', 'active') : cx('menu-item')}
                onClick={onClick}
            >
                <span className={cx('icon')}>{data.icon}</span>
                <span className={cx('name')}>{data.itemContent}</span>
            </div>
        </Link>
    );
}

export default MenuItem;
