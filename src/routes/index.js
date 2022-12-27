import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import RoutesPath from './routePath';

function RoutesWrapper() {
  return (
    <Suspense
      fallback={
        <div className="loding_spinner">
          <CircularProgress />
        </div>
      }
    >
      <Routes>
        {RoutesPath.map(({ path, id, Component }) => {
          return <Route key={id} path={path} element={<Component />} />;
        })}
      </Routes>
    </Suspense>
  );
}

export default RoutesWrapper;
