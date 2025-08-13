import { useQuery } from '@tanstack/react-query';
import { licenseApi } from '../api';

export const useLicenseTypes = () => {
  return useQuery({
    queryKey: ['license_types'],
    queryFn: async () => {
      const response = await licenseApi.getLicenseTypes();
      return response.data;
    },
  });
};