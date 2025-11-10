// src/hooks/useTracks.js
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { libraryApi } from '../api'; 
import { trackApi } from '../api'; 
import { trackLicenseOptionApi } from '../api'; 
import { trackStorageFileApi } from '../api'; 
import { useDispatch, useSelector } from 'react-redux';
import { fetchLibrariesWithTracks, selectAllTracks, selectIsLoading, selectError, selectLastFetched, selectLibraries, clearLibraries } from '../store/slices/trackLibrarySlice';

//GETTING THE LIBRARY, FETCH THE TRACKS, THEN TRACKSTORAGEFILES FROM THE CORRECT NAMES, THEN PASS TO AUDIOPLAYER

// creating an array of libraries to append all the libraries
// let trackLibraries = [];
// // creating a trackLicenseOption object that will go in the trackLicenseOption array of each track
// const trackLicenseOption = {
//   // Get the trackLicenseOption for the trackLicenseOption array
// trackLicenseOptionID: "",
// trackId: "",
// licenseType: {
//   licenseTypeId: "",
//   licenseTypeName: "",
//   licenseTypeTemplate: "",
//   price: "",
//   currency: "",
// }
// };
// // creating a track object that will go in the track array of each library
// const track = {
// trackID: "",
// trackTitle: "",
// trackAlterTitle: "",
// trackVersionSubTitle: "",
// trackArtistFeaturesLine: "",
// trackDuration: "",
// trackBPM: "",
// trackDescription: "",
// trackKey: "",
// trackGenres: "",
// trackMoods: "",
// trackTags: "",
// trackInstruments: "",
// trackLyrics: "",  
// trackVocalDescription: "",
// trackTimeSignature: "",
// trackReleaseDate: "",
// trackThumbnail: "",
// trackVinylThumbnail: "",
// trackCoverArt: "",
// trackBuyLink: "",
// trackDownloadLink: "",
// trackStreamLink: "",
// trackDonationLink: "",
// // I use the track_id to access the TrackLicence Option as the trackLicenseOption table joins track and track and license type and storageFile
// // append all the trackLicenseOptions for each track
// trackLicenseOptions: [],
// // for each trackLicenseOption get trackLicenseOption.trackStorageFile (for the id)-> 
// // use this trackStorageFile.id to get trackStorageFile and  check if the fileFormat name is Stem. If it is, pass it below
// // Add fileformat to trackStorageFile serializer
// trackStorageFileDescription: "",
// trackStorageFileBitDepth: "",
// trackStorageFilePath: "",
// trackStorageFileFormat: "",
// trackStorageFileFormatName: "",
// trackStorageFileFormatExtension: "",
// trackStorageFileFormatBitDepth: "",
// trackStorageFileFormatSampleRate: "",
// };

// starting with the libraries object
// const trackLibrary = {
//   // Get the libraries
// libraryID: "",
// libraryName: "",
// // append all the tracks for each library
// tracks: [],
// }; 

// GETTING LIBRARIES
export const useLibraries = () => {
  return useQuery({
    queryKey: ['libraries'],
    queryFn: async () => {
      const response = await libraryApi.getLibraries();
      console.log('check out my libraries ', response)
      return response; // Extract the data from the axios response. the response.data already extracted in the api
    },
  });
}

export const useLibraryDetail = (libraryId) => {
  return useQuery({
    queryKey: ['library', libraryId],
    queryFn: async () => {
      const response = await libraryApi.getLibraryDetail(libraryId);
      console.log('check out my library detail ', response)
      return response; 
    },
  })
}

// GETTING TRACKS
export const useTracks = () => {
  return useQuery({
    queryKey: ['tracks'], // I need the tracks identified by this key and also cached if needed
    queryFn: async () => {
      const response = await trackApi.getTracks();
      console.log('check out my tracks', response)
      return response; // Extract the data from the axios response. the response.data already extracted in the api
    },
  });
};

export const useTrackDetail = (trackId) => {
  return useQuery({
    queryKey: ['track', trackId],
    queryFn: async () => {
      const response = await trackApi.getTrackDetail(trackId);
      console.log('check out my track detail ', response)
      return response; 
    },
  })
}

// *******GETTING TRACK LICENSE OPTION BY trackID*******
// GETTING TRACK LICENSE OPTION BY trackLicenseOptionId
export const useTrackLicenseOption = () => {
  return useQuery({
    queryKey: ['track-license-option'],
    queryFn: async () => {
      const response = await trackLicenseOptionApi.getTrackLicenseOption();
      console.log('check out my track license option ', response)
      return response; 
    },
  })
}

// GETTING TRACK LICENSE OPTION BY trackLicenseOptionId
export const useTrackLicenseOptionById = (trackLicenseOptionId) => {
  return useQuery({
    queryKey: ['track-license-option', trackLicenseOptionId],
    queryFn: async () => {
      const response = await trackLicenseOptionApi.getTrackLicenseOptionById(trackLicenseOptionId);
      console.log('check out my track license option ', response)
      return response; 
    },
  })
}

// GETTING TRACK LICENSE OPTION BY trackId
export const useTrackLicenseOptionByTrackId = (trackId) => {
  return useQuery({
    queryKey: ['track-license-option-track-id', trackId],
    queryFn: async () => {
      const response = await trackLicenseOptionApi.getTrackLicenseOptionByTrackId(trackId);
      console.log('check out my track license option by track id', response)
      return response; 
    },
  })
}

// Inside each track option, you take the track storage file and check if file format name is Stem
export const useTrackStorageFile = (trackStorageFileId) => {
  return useQuery({
    queryKey: ['track-storage-file', trackStorageFileId],
    queryFn: async () => {
      const response = await trackStorageFileApi.getTrackStorageFile(trackStorageFileId);
      console.log('check out my track storage file ', response)
      return response; 
    },
  })
}

//custom hook to get all tracks from all libraries
export const useAllLibrariesWithTracks = (autoFetch = true) => {
  console.log('hook running....')
  const dispatch = useDispatch();
  const librariesWithTracks = useSelector(selectLibraries);
  const tracks = useSelector(selectAllTracks)
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const lastFetched = useSelector(selectLastFetched);

  console.log('librariesWithTracks length', librariesWithTracks.length)

  useEffect(() => {
    console.log('librariesWithTracks length', librariesWithTracks.length)
    console.log('useTracks autoFetch', autoFetch)
    console.log('useTracks isLoading', isLoading)
    console.log('useTracks error', error)
    if (librariesWithTracks.length===0 && autoFetch && !isLoading && !error) {
      dispatch(fetchLibrariesWithTracks());
    }
    // console.log('here librariesWithTracks', librariesWithTracks)
  }, [dispatch, librariesWithTracks.length, autoFetch, isLoading, error]);


  const refetch = () => {
    dispatch(fetchLibrariesWithTracks())
  };
  // refetch();
  return {
    librariesWithTracks,
    tracks,
    isLoading,
    error,
    refetch,
    lastFetched,

  }
};



