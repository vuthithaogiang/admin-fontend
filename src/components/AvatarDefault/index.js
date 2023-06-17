import classNames from 'classnames/bind';
import styles from './AvatarDefault.module.scss';

const cx = classNames.bind(styles);

function AvatarDefault({ firstName, color }) {
    return (
        <div
            className={cx('wrapper')}
            style={{
                backgroundColor: color,
            }}
        >
            <span>{firstName.substr(0, 1)}</span>
        </div>
    );
}

export default AvatarDefault;
