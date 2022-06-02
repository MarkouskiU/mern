import { Route, Navigate, Routes } from 'react-router-dom';
import { LinksPage, CreatePage, DetailPage, AuthPage } from './modules';

export const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Routes>
        <Route path='/links' exacl element={<LinksPage />} />
        <Route path='/create' exacl element={<CreatePage />} />
        <Route path='/detail/:id' element={<DetailPage />} />
        <Route path='*' element={<Navigate to="/create" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path='/' exacl element={<AuthPage />} />
      <Route path='*' element={<Navigate to="/" />} />
    </Routes>
  );
};
