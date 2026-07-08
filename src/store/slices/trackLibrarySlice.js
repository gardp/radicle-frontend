import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { libraryApi, trackApi, trackLicenseOptionApi } from '../../api';

// ========================================
// DATA MODELS
// ========================================

// Empty structure templates
const trackLicenseOption = {
  trackLicenseOptionId: "",
  trackId: "",
  licenseType: {
    licenseTypeId: "",
    licenseTypeName: "",
    licenseTerm: "",
    licenseTemplate: "",
    downloadLimit: "",
    streamingLimit: "",
    price: "",
    currency: "",
  }
};

const track = {
  trackId: "",
  trackTitle: "",
  trackAlternateTitle: "",
  trackVersionSubtitle: "",
  trackArtistFeaturesLine: "",
  trackDuration: "",
  trackBpm: "",
  trackDescription: "",
  trackKey: "",
  trackGenres: [],
  trackMoods: [],
  trackTags: [],
  trackInstruments: [],
  trackLyrics: "",
  trackVocalDescription: "",
  trackTimeSignature: "",
  trackReleaseDate: "",
  trackThumbnail: "",
  trackVinylThumbnail: "",
  trackCoverArt: "",
  trackBuyLink: "",
  trackDownloadLink: "",
  trackStreamLink: "",
  trackDonationLink: "",
  trackLicenseOptions: [],
  trackStorageFileDescription: "",
  trackStorageFilePath: "",
  trackStorageFileFormatName: "",
  trackStorageFileFormatExtension: "",
  trackStorageFileFormatBitDepth: "",
  trackStorageFileFormatSampleRate: "",
};

const trackLibrary = {
  libraryId: "",
  libraryName: "",
  tracks: [],
};

// ========================================
// INITIAL STATE
// ========================================

const initialState = {
  libraries: [], // Array of trackLibrary objects or enriched libraries
  isLoading: false,
  error: null,
  lastFetched: null,
};

// ========================================
// THUNKS (Fetch data and populate structures)
// ========================================

/**
 * Fetch all libraries with their tracks and license options
 * This is what you'd call instead of useLibraries()
 */

export const fetchLibrariesWithTracks = createAsyncThunk(
  'trackLibrary/fetchLibrariesWithTracks',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🚀 Starting fetchLibrariesWithTracks...');
      // 1. Fetch all libraries
      const librariesResponse = await libraryApi.getLibraries();
      console.log('✅ Fetched libraries:', librariesResponse);
      // 2. For each library, fetch tracks and license options
      const enrichedLibraries = await Promise.all(
        librariesResponse.map(async (library) => {
          const trackLibrary = {
            libraryId: library.library_id,
            libraryName: library.library_name,
            tracks: [],
          };
          // if library has tracks, fetch track details from the track_id array of the library
          //IMPORTANT‼️ remember that now I only get the preview audio file for the tracks in the library and all the audio files
          if (library.tracks && library.tracks.length > 0) {
            trackLibrary.tracks = await Promise.all(
              library.tracks.map(async (trk) => { //mapping thru each track object in the library in the tracks array 
                console.log('🚀 Fetching track details for each track:', trk);
                try {
                  const trackDetail = await trackApi.getTrackDetail(trk.track_id);
                  // Fetch all license options for this track
                  const licensingOptions = await trackLicenseOptionApi.getTrackLicenseOptionByTrackId(trk.track_id);
                  console.log('✅ Fetched licensing options:', licensingOptions);
                  //Now destructure the licensingOptions list into the trackLicenseOption object
                  const trackLicenseOptions = await licensingOptions.map(option => ({
                    trackLicenseOptionId: option.track_license_option_id,
                    licenseType: {
                      licenseTypeId: option.license_type.license_type_id,
                      licenseTypeName: option.license_type.license_type_name,
                      licenseTypeFormat: option.license_type.license_type_format,
                      licenseTerm: option.license_type.license_term,
                      licenseTemplate: option.license_type.license_template,
                      fileFormatName: option.license_type.license_type_format,
                      songsPerLicense: option.license_type.songs_per_license,
                      monetizedDownloadLimit: option.license_type.monetized_download_limit,
                      monetizedStreamingLimit: option.license_type.monetized_streaming_limit,
                      monetizedRadioPlays: option.license_type.monetized_radio_plays,
                      monetizedVideoStreamingLimit: option.license_type.monetized_video_streaming_limit,
                      price: parseFloat(option.license_type.price),
                      currency: option.license_type.currency,
                    },
                  }));
                  console.log('✅ Fetched track license options now:', trackLicenseOptions);
                  console.log('✅ Fetched STORAGE FILE:HERE!!!');
                  //the library request serializes it so that the track_storage_file description gets sent to the front end in "track_storage_desc" as computed below
                  const targetDescription = "PREVIEW"
                    // trackLibrary.libraryName === "ORIGINAL"
                    //   ? "ORIGINAL"
                    //   : trackLibrary.libraryName === "REMIXES"
                    //   ? "REMIX"
                    //   : "SAMPLE";

                  // Find the correct preview audio based on the targetdescription... 
                  // So if the library is NEW FEATURES, find the ORIGINAL SONG preview audio, else find the SAMPLE preview audio
                  const selectedPreviewAudio = trk.preview_audio?.find(
                    p => p.track_storage_desc === targetDescription
                  );

                  console.log(`Fetched trackDetail+LicensingOptions+SelectedPreview ${trk.track_id}:`, trackDetail, licensingOptions, selectedPreviewAudio);

                  // Transform the trackDetail to our track structure
                  const track = {
                    trackId: trackDetail.track_id || "",
                    trackTitle: trackDetail.title || "",
                    trackAlternateTitle: trackDetail.alternate_titles || "",
                    trackVersionSubtitle: trackDetail.version_subtitle || "",
                    trackArtistFeaturesLine: trackDetail.artists_features_line || "",
                    trackContributorId: trackDetail.contributor_id || "",
                    trackDuration: trackDetail.duration_seconds || "",
                    trackBpm: trackDetail.bpm || "",
                    trackDescription: trackDetail.description || "",
                    trackKey: trackDetail.key || "",
                    trackGenres: trackDetail.genres || [],
                    trackMoods: trackDetail.moods || [],
                    trackTags: trackDetail.tags || [],
                    trackInstruments: trackDetail.instruments || [],
                    trackLyrics: trackDetail.lyrics || "",
                    trackVocalDescription: trackDetail.vocal_description || "",
                    trackTimeSignature: trackDetail.time_signature || "",
                    trackReleaseDate: trackDetail.release_date || "",
                    trackThumbnail: trackDetail.thumbnail || "",
                    trackVinylThumbnail: trackDetail.vinyl_thumbnail || "",
                    trackCoverArt: trackDetail.cover_art || "",
                    trackBuyLink: targetDescription === "REMIX" ? null : (trackDetail.buy_link || ""), // remove the beat leasing buylink for remix tracks
                    trackStreamLink: targetDescription === "PREVIEW" ? null : (trackDetail.stream_link || ""),
                    trackDownloadLink: targetDescription === "PREVIEW" ? null : (trackDetail.download_link || ""),
                    trackDonationLink: trackDetail.donation_link || "",
                    trackLicenseOptions: trackLicenseOptions || [],
                    trackStorageFileDescription: targetDescription, // This is the storage file description for the audio_file selected 
                    trackAudioIsrc: selectedPreviewAudio[0]?.isrc_code || "",
                    trackAudioIswc: selectedPreviewAudio[0]?.iswc_code || "",
                    trackAudioFilePath: selectedPreviewAudio[0]?.file_path || "",
                    trackAudioFileFormatName: selectedPreviewAudio[0]?.file_format?.name || "",
                    trackAudioFileFormatExtension: selectedPreviewAudio[0]?.file_format?.extension || "",
                    trackAudioFileFormatBitDepth: selectedPreviewAudio[0]?.file_format?.bit_depth || "",
                    trackAudioFileFormatSampleRate: selectedPreviewAudio[0]?.file_format?.sample_rate || "",
                  };

                  return track;
                } catch (error) {
                  console.error(`Failed to fetch track ${trackId}:`, error);
                  return null;
                }
              })
            );

            // Filter out failed fetches
            trackLibrary.tracks = trackLibrary.tracks.filter(t => t !== null);
          }

          return trackLibrary;
        })
      );

      return enrichedLibraries;
    } catch (error) {
      console.error('Failed to fetch libraries:', error);
      return rejectWithValue(error.message);
    }
  });

// ========================================
// SLICE
// ========================================

const trackLibrarySlice = createSlice({
  name: 'trackLibrary',
  initialState,
  reducers: {
    // You can add synchronous actions here if needed
    clearLibraries: (state) => {
      state.libraries = [];
      state.error = null;
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLibrariesWithTracks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLibrariesWithTracks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.libraries = action.payload;
        state.lastFetched = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchLibrariesWithTracks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch libraries';
      });
  },
});

// ========================================
// ACTIONS & SELECTORS
// ========================================

export const { clearLibraries } = trackLibrarySlice.actions;

// Selectors to select state elements
export const selectLibraries = (state) => state.trackLibrary.libraries;
export const selectIsLoading = (state) => state.trackLibrary.isLoading;
export const selectError = (state) => state.trackLibrary.error;
export const selectLastFetched = (state) => state.trackLibrary.lastFetched;

// Selector to get all tracks from all libraries flattened (memoized)
// Selector to get all tracks from all libraries flattened
// export const selectAllTracks = (state) => {
//   return state.trackLibrary.libraries.flatMap(library => library.tracks || []);
// };
export const selectAllTracks = createSelector(
  [selectLibraries],
  (libraries) => {
    return libraries.flatMap(library => library.tracks || []);
  }
);

export default trackLibrarySlice.reducer;


// Rule of Thumb
// Need to fetch from API? → Use createAsyncThunk + extraReducers
// Simple state update? → Use reducers