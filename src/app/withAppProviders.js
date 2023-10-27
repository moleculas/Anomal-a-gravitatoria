import { StyledEngineProvider } from '@mui/material/styles';
import AppContext from './AppContext';

const withAppProviders = (Component) => (props) => {
  const WrapperComponent = () => (
    <AppContext.Provider
      value={{
        //routes,
      }}
    >
      <StyledEngineProvider injectFirst>
        <Component {...props} />
      </StyledEngineProvider>
    </AppContext.Provider>
  );

  return WrapperComponent;
};

export default withAppProviders;
