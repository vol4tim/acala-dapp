import React, { FC } from 'react';
import { Route, Routes } from 'react-router';
import { CouncilDetails } from './components/CouncilDetails';

import { Overview } from './components/Overview';

const PageGovernance: FC = () => {
  return (
    <Routes>
      <Route
        element={<Overview />}
        path='/'
      />
      <Route
        element={<CouncilDetails />}
        path='/councils'
      />
    </Routes>
  );
};

export default PageGovernance;
