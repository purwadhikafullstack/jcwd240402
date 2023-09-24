import { useState } from 'react';

const useFilterState = (initialState) => {
  const [state, setState] = useState(initialState);

  const setFilteredState = (updates) => {
    setState(prevState => ({
      ...prevState,
      ...updates
    }));
  };

  return [state, setFilteredState];
};

export default useFilterState;
