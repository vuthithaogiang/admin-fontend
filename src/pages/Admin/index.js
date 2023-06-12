import classNames from 'classnames/bind';
import styles from './Admin.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faClock, faFile } from '@fortawesome/free-solid-svg-icons';

import { faCode, faCouch, faGear, faPencil } from '@fortawesome/free-solid-svg-icons';
import { faClipboard, faComment, faIdBadge } from '@fortawesome/free-regular-svg-icons';
import { faCodepen, faTeamspeak } from '@fortawesome/free-brands-svg-icons';

import { useParams } from 'react-router';
import DashboardAdmin from '../DashboardAdmin';
import TimeOffAdmin from '../TimeOffAdmin';
import TimesheetAdmin from '../TimesheetAdmin';
import Sidebar from '~/components/Sidebar';

const cx = classNames.bind(styles);

function Admin() {
    let params = useParams();

    const SIDEBARMENU = [
        {
            type: 'Home',
            path: '',
            children: [
                {
                    itemContent: 'Dashboard Admin',
                    icon: <FontAwesomeIcon icon={faBars} />,
                    path: `/admin/dashboard`,
                },
                {
                    itemContent: 'Timesheet Details',
                    icon: <FontAwesomeIcon icon={faClock} />,
                    path: `/admin/timesheet`,
                },
                {
                    itemContent: 'Day off',
                    icon: <FontAwesomeIcon icon={faCouch} />,
                    path: '',
                },
            ],
        },

        {
            type: 'Time off Request',
            path: '',
            children: [
                {
                    itemContent: 'History Furloughs',
                    icon: <FontAwesomeIcon icon={faFile} />,
                    path: `/admin/timeoff`,
                },
                {
                    itemContent: 'Add new',
                    icon: <FontAwesomeIcon icon={faClipboard} />,
                    path: `/admin/timeoff`,
                },
            ],
        },
        {
            type: 'Team',
            path: '',
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
            path: '',
            children: [
                {
                    itemContent: 'View Profile',
                    icon: <FontAwesomeIcon icon={faIdBadge} />,
                    path: '',
                },
            ],
        },

        {
            type: 'Help',
            path: '',
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

    return (
        <div className={cx('wrapper')}>
            <>
                <div className={cx('sidebar')}>
                    <Sidebar listMenu={SIDEBARMENU} />
                </div>

                <div className={cx('content')}>
                    {params.type === 'dashboard' && <DashboardAdmin />}

                    {params.type === 'timesheet' && <TimesheetAdmin />}

                    {params.type === 'timeoff' && <TimeOffAdmin />}
                </div>
            </>
        </div>
    );
}

export default Admin;
