import classNames from 'classnames/bind';

import styles from './Home.module.scss';
import images from '~/assets/images';

const cx = classNames.bind(styles);

function Home() {
    return (
        <div className={cx('wrapper')}>
            <img
                src="https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fpublic.notion-static.com%2F7a24b673-191c-47e4-8a8c-ab13f73b7e81%2FScreen_Shot_2017-11-20_at_5.00.53_PM.png?width=40&userId=c64114a1-a62c-4dbb-af63-e984bc27827b&cache=v2"
                alt="icon"
            />

            <img src={images.send} alt="icon" />
        </div>
    );
}

export default Home;
