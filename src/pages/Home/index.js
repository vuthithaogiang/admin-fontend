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

const cx = classNames.bind(styles);

function Home() {
    let params = useParams();

    const [employeeInfo, setEmployeeInfo] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`/timesheetDetails/getAllByEmpId/${params.empId}`);

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
                        <Sidebar />
                    </div>

                    <div className={cx('content')}>
                        <Header avatar={employeeInfo[0].avatar} />

                        {params.children === 'dashboard' && <Dashboard />}

                        {params.children === 'timesheetDetails' && <TimesheetDetails />}

                        {params.children === 'daysOff' && <DaysOff />}
                    </div>
                </>
            )}
        </div>
    );
}

export default Home;
