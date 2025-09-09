

import { useContext } from 'react';
import { ApiContext } from '@/context/ApiContext';

export const useApi = () => {
  const APIs = useContext(ApiContext);

  if (!APIs) {
    throw new Error('useApi must be used within a ApiContext');
  }

  return APIs;
};
