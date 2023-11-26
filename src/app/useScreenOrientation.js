import { useState, useEffect } from 'react';

const useScreenOrientation = () => {
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  const handleResize = () => {
    setIsPortrait(window.innerHeight > window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); 

  return isPortrait;
};

export default useScreenOrientation;