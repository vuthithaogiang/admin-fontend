import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import images from '~/assets/images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCode, faCouch, faGear, faPencil } from '@fortawesome/free-solid-svg-icons';
import { faClipboard, faClock, faComment, faFile, faIdBadge } from '@fortawesome/free-regular-svg-icons';
import { faCodepen, faTeamspeak } from '@fortawesome/free-brands-svg-icons';
import Menu from '../Menu';

const cx = classNames.bind(styles);

function Sidebar() {
    const SIDEBARMENU = [
        {
            type: 'Home',
            children: [
                {
                    itemContent: 'Dashboard',
                    icon: <FontAwesomeIcon icon={faBars} />,
                    path: '/dashboard',
                },
                {
                    itemContent: 'Timesheet Details',
                    icon: <FontAwesomeIcon icon={faClock} />,
                    path: '/timesheetDetails',
                },
                {
                    itemContent: 'Day off',
                    icon: <FontAwesomeIcon icon={faCouch} />,
                    path: '/daysOff',
                },
            ],
        },
        {
            type: 'Team',
            children: [
                {
                    itemContent: 'UI/UX Design',
                    icon: <FontAwesomeIcon icon={faPencil} />,
                    path: '',
                },
                {
                    itemContent: 'Fontend',
                    icon: <FontAwesomeIcon icon={faCodepen} />,
                    path: '',
                },
                {
                    itemContent: 'BackEnd',
                    icon: <FontAwesomeIcon icon={faCode} />,
                    path: '',
                },
                {
                    itemContent: 'Telesale',
                    icon: <FontAwesomeIcon icon={faTeamspeak} />,
                    path: '',
                },
            ],
        },
        {
            type: 'Profile',
            children: [
                {
                    itemContent: 'View Profile',
                    icon: <FontAwesomeIcon icon={faIdBadge} />,
                    path: '',
                },
            ],
        },
        {
            type: 'Furlough',
            children: [
                {
                    itemContent: 'History Furloughs',
                    icon: <FontAwesomeIcon icon={faFile} />,
                    path: '',
                },
                {
                    itemContent: 'Add new',
                    icon: <FontAwesomeIcon icon={faClipboard} />,
                    path: '',
                },
            ],
        },
        {
            type: 'Help',
            children: [
                {
                    itemContent: 'Setting',
                    icon: <FontAwesomeIcon icon={faGear} />,
                    path: '',
                },
                {
                    itemContent: 'Send Feedback',
                    icon: <FontAwesomeIcon icon={faComment} />,
                    path: '',
                },
            ],
        },
    ];

    const handleChangeMenu = () => {
        console.log('change menu');
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('logo')}>
                <img src={images.logo} alt="Employee Timesheet" />
                <p>Employee Timesheet</p>
            </div>

            {SIDEBARMENU.map((menu) => (
                <Menu type={menu.type} key={menu.type} items={menu.children} onChange={handleChangeMenu}></Menu>
            ))}
        </div>
    );
}

export default Sidebar;
