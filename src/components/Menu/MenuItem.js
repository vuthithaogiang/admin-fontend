import classNames from 'classnames/bind';
import styles from './Menu.module.scss';

const cx = classNames.bind(styles);

function MenuItem({ data, name, active, onClick }) {
    return (
        <div
            className={name === data.itemContent && active === true ? cx('menu-item', 'active') : cx('menu-item')}
            onClick={onClick}
        >
            <span className={cx('icon')}>{data.icon}</span>
            <span className={cx('name')}>{data.itemContent}</span>
        </div>
    );
}

export default MenuItem;
