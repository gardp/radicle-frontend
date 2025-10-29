import { useQuery } from '@tanstack/react-query';
import { licenseApi } from '../api';


//GETTING THE TRACK LICENSE OPTIONS FROM EACH TRACK, THEN THE LICENSE TYPES AND PERTAINING VALUES
export const useLicenseTypes = () => {
  return useQuery({
    queryKey: ['license_types'],
    queryFn: async () => {
      const response = await licenseApi.getLicenseTypes();
      console.log("my license types", response)
      return response;
    },
  });
};