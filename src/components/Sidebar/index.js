import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import images from '~/assets/images';

import Menu from '../Menu';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const cx = classNames.bind(styles);

function Sidebar({ listMenu }) {
    useEffect(() => {}, []);

    const handleChangeMenu = () => {
        console.log('change menu');
    };
    return (
        <div className={cx('wrapper')}>
            <Link to="/">
                <div className={cx('logo')}>
                    <img src={images.logo} alt="Employee Timesheet" />
                    <p>Employee Timesheet</p>
                </div>
            </Link>

            {listMenu.map((menu) => (
                <Menu
                    type={menu.type}
                    key={menu.type}
                    to={menu.path}
                    items={menu.children}
                    onChange={handleChangeMenu}
                ></Menu>
            ))}
        </div>
    );
}

export default Sidebar;
