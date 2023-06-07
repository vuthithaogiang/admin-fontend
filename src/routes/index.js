import CheckIn from '../pages/CheckIn';
import Home from '~/pages/Home';

const publicRoutes = [
    { path: '/', component: CheckIn },
    { path: '/home', component: Home },
];

const privteRoutes = [];

export { privteRoutes, publicRoutes };
