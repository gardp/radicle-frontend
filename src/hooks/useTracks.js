// src/hooks/useTracks.js
import { useQuery } from '@tanstack/react-query';
import { musicApi } from '../api'; 

export const useTracks = () => {
  return useQuery({
    queryKey: ['tracks'], // I need the tracks identified by this key and also cached if needed
    queryFn: async () => {
      const response = await musicApi.getTracks();
      return response.data; // Extract the data from the axios response
    },
    // Assuming your api.js exports musicApi
  });
};

// // Hook to fetch the details of a SINGLE song
// export const useSongDetails = (songId) => {
//   return useQuery({
//     // The queryKey is crucial here!
//     // It includes the songId to make it unique for each song.
//     queryKey: ['song', songId], 
    
//     // The queryFn calls the specific API endpoint with the id.
//     queryFn: () => musicApi.getSongDetail(songId),
    
//     // This ensures the query only runs if a songId is provided.
//     enabled: !!songId, 
// });
// };
