import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import withAppProviders from './withAppProviders';
import { ThemeProvider } from '@mui/material/styles';
import theme from './temaConfig';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

//componentes
import Componente from "./Componente";

const emotionCacheOptions = {
  ltr: {
    key: 'muiltr',
    stylisPlugins: [],
    insertionPoint: document.getElementById('emotion-insertion-point'),
  },
};

const App = () => {
  const baseName = process.env.NODE_ENV === "development" ? "/" : "/repositorio";
  return (
    <CacheProvider value={createCache(emotionCacheOptions["ltr"])}>
      <ThemeProvider theme={theme}>
        <Router basename={baseName}>
          <Routes>
            <Route path="/" element={<Componente />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default withAppProviders(App)();
