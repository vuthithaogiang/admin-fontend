import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import AvatarDefault from '../AvatarDefault';

const cx = classNames.bind(styles);

function Header({ avatar, firstName }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('search')}>
                <FontAwesomeIcon icon={faSearch} />
                <input placeholder="Search" />
            </div>

            <div className={cx('notify')}>
                <FontAwesomeIcon icon={faBell} />
            </div>
            {avatar ? (
                <>
                    <div className={cx('avatar')}>
                        <img src={avatar} alt="" />
                    </div>
                </>
            ) : (
                <>
                    <AvatarDefault firstName={firstName} color={'#3d81c2'} />
                </>
            )}
        </div>
    );
}

export default Header;
