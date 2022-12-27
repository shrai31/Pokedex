import { lazy } from 'react';

const PokedexDetails = lazy(() => import('../pages/PokedexDetails'));
const AllPokedex = lazy(() => import('../pages/Home'));

const RoutesPath = [
  {
    name: 'Home',
    path: '/',
    id: 1,
    Component: AllPokedex,
  },
  {
    name: 'PokeDetail',
    path: '/poke-details',
    id: 2,
    Component: PokedexDetails,
  },
];

export default RoutesPath;
