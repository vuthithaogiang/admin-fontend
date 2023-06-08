import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import MenuItem from './MenuItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

const defaultFn = () => {};

function Menu({ items = [], onChange = defaultFn, type, children }) {
    const [data, setData] = useState(items);

    const [show, setShow] = useState(true);

    const [name, setName] = useState('Dashboard');
    const [active, setActive] = useState(true);

    const handleShowMenu = () => {
        setShow(!show);
    };

    useEffect(() => {
        show === true ? setData(items) : setData([]);
    }, [show]);

    return (
        <div className={cx('menu')} onChange={onChange}>
            <div className={cx('type-menu')}>
                <span>{type}</span>
                <FontAwesomeIcon onClick={handleShowMenu} icon={faAngleDown} />
            </div>
            {data.map((item, index) => (
                <MenuItem
                    key={index}
                    data={item}
                    name={name}
                    active={active}
                    onClick={() => {
                        setName(item.itemContent);
                        setActive(!active);
                    }}
                />
            ))}
            <div>{children}</div>
        </div>
    );
}

export default Menu;
