import Admin from '~/pages/Admin';
import CheckIn from '../pages/CheckIn';
import Home from '~/pages/Home';

const publicRoutes = [
    { path: '/', component: CheckIn },

    {
        path: '/view/:empId/:children',
        component: Home,
    },
    { path: '/admin/:type', component: Admin },
];

const privteRoutes = [];

export { privteRoutes, publicRoutes };
