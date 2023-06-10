import classNames from 'classnames/bind';
import styles from './HistoryFurloughs.module.scss';
import { useEffect, useState } from 'react';
import axios from '~/api/axios';
import { useParams } from 'react-router';
import { faL } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function HistoryFurloughs() {
    const [isLoading, setIsLoading] = useState(true);
    const params = useParams();
    const [data, setData] = useState([]);

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`/furlough/getAllByEmpId/${params.empId}`);

            console.log(response.data);

            if (response.data.length === 0) {
                console.log('undefined!');
            } else {
                setData(response.data);
                setIsLoading(false);
            }
        } catch (error) {}
    };

    useEffect(() => {
        fetchDetails();
    }, [params.empId]);

    return (
        <>
            {isLoading === true && <span>Loading or No data ...</span>}

            {isLoading === false && (
                <div className={cx('wrapper')}>
                    <div className={cx('header')}>
                        <h3>Recent Furloughs</h3>
                    </div>

                    {data.map((item) => (
                        <div className={cx('item')} key={item.furloughId}>
                            {item.updateAt}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default HistoryFurloughs;
