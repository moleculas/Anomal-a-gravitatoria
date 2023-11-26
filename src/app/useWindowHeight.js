import { useState, useEffect } from 'react';

const useWindowHeight = () => {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  useEffect(() => {
    function updateWindowHeight() {
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', updateWindowHeight);
    updateWindowHeight();
    return () => {
      window.removeEventListener('resize', updateWindowHeight);
    };
  }, []);

  return windowHeight;
}

export default useWindowHeight;