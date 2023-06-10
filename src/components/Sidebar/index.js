import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import images from '~/assets/images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCode, faCouch, faGear, faPencil } from '@fortawesome/free-solid-svg-icons';
import { faClipboard, faClock, faComment, faFile, faIdBadge } from '@fortawesome/free-regular-svg-icons';
import { faCodepen, faTeamspeak } from '@fortawesome/free-brands-svg-icons';
import Menu from '../Menu';
import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';

const cx = classNames.bind(styles);

function Sidebar() {
    let params = useParams();
    const SIDEBARMENU = [
        {
            type: 'Home',
            path: `/view/${params.empId}/dashboard`,
            children: [
                {
                    itemContent: 'Dashboard',
                    icon: <FontAwesomeIcon icon={faBars} />,
                    path: `/view/${params.empId}/dashboard`,
                },
                {
                    itemContent: 'Timesheet Details',
                    icon: <FontAwesomeIcon icon={faClock} />,
                    path: `/view/${params.empId}/timesheetDetails`,
                },
                {
                    itemContent: 'Day off',
                    icon: <FontAwesomeIcon icon={faCouch} />,
                    path: `/view/${params.empId}/daysOff`,
                },
            ],
        },
        {
            type: 'Team',
            path: `/view/${params.empId}/team`,
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
            path: `/view/${params.empId}/profile`,
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
            path: `/view/${params.empId}/furlough`,
            children: [
                {
                    itemContent: 'History Furloughs',
                    icon: <FontAwesomeIcon icon={faFile} />,
                    path: `/view/${params.empId}/furlough`,
                },
                {
                    itemContent: 'Add new',
                    icon: <FontAwesomeIcon icon={faClipboard} />,
                    path: `/view/${params.empId}/furloughAdd`,
                },
            ],
        },
        {
            type: 'Help',
            path: `/view/${params.empId}/help`,
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

            {SIDEBARMENU.map((menu) => (
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
