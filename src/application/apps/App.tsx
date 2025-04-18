import { Route, Routes } from 'react-router';

import { HomePage } from '@/presentation/pages/pages';

export function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
    </Routes>
  );
}
