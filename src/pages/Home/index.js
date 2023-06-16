import classNames from 'classnames/bind';

import styles from './Home.module.scss';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '~/api/axios';
import Sidebar from '~/components/Sidebar';
import Header from '~/components/Header';
import Dashboard from '../Dashboard';
import TimesheetDetails from '../TimesheetDetails';
import DaysOff from '../DaysOff';
import AddFurlough from '../AddFurlough';
import HistoryFurloughs from '~/components/HistoryFurloughs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCode, faCouch, faGear, faPencil } from '@fortawesome/free-solid-svg-icons';
import { faClipboard, faClock, faComment, faFile, faIdBadge } from '@fortawesome/free-regular-svg-icons';
import { faCodepen, faTeamspeak } from '@fortawesome/free-brands-svg-icons';

const cx = classNames.bind(styles);

function Home() {
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

    const [employeeInfo, setEmployeeInfo] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`/timesheetDetails/getAllByEmpId/${params.empId}/all`);

            console.log(response.data);

            if (response.data === []) {
                console.log('undefined!!');
            } else {
                setEmployeeInfo(response.data);
                setIsLoading(false);
            }
        } catch (error) {
            console.log('undefined!!');
        }
    };

    useEffect(() => {
        fetchDetails();
    }, [params.empId]);
    return (
        <div className={cx('wrapper')}>
            {isLoading === true && <span>Loading data....</span>}

            {isLoading === false && (
                <>
                    <div className={cx('sidebar')}>
                        <Sidebar listMenu={SIDEBARMENU} />
                    </div>

                    <div className={cx('content')}>
                        <Header avatar={employeeInfo[0].avatar} />

                        {params.children === 'dashboard' && <Dashboard />}

                        {params.children === 'timesheetDetails' && <TimesheetDetails />}

                        {params.children === 'daysOff' && <DaysOff />}

                        {params.children === 'furloughAdd' && <AddFurlough />}

                        {params.children === 'furlough' && <HistoryFurloughs />}
                    </div>
                </>
            )}
        </div>
    );
}

export default Home;
