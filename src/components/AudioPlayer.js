import React, { useState, useEffect, useRef } from "react";
import AudioControls from "./AudioControl";
import TrackFrame from "./TrackFrame";
import SearchBar from "./SearchBar"; // Import the SearchBar component
import "../styles/AudioPlayer.css";
import { API_BASE_URL } from "../api";

// const AudioPlayer = ({ libraries, playerTitle }) => {
const AudioPlayer = ({ libraries, playerTitle, onTrackChange }) => {
  // console.log("AudioPlayer received libraries:", libraries); // Debug log
  // desctructure tracks from libraries
  // State
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  // console.log("Initial render - isPlaying:", isPlaying, "isActive:", isActive);
  const [currentLibTrackIndex, setCurrentLibTrackIndex] = useState({ libraryIndex: 0, trackIndex: 0 }); //I don't need to have a separate state for the library index as it is already set in TrackFrame based on the active library.
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  // Filter tracks based on search term in the pertaining library
  const filteredLibraries = libraries.map(lib => ({
    ...lib,
    tracks: lib.tracks?.filter(track =>
      (track.trackTitle || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (track.trackArtist || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (track.trackBpm || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (track.trackDescription || "").toLowerCase().includes(searchTerm.toLowerCase())
    ) || []
  }));

  // Use filteredTracks for display, but manage currentTrackIndex based on the original tracks array
  // This assumes currentTrackIndex refers to the index in the *original* `tracks` prop.
  // If a track is filtered out, the player might behave unexpectedly if it was the current track.
  // A more robust solution would involve updating currentTrackIndex when tracks are filtered,
  // or ensuring the currently playing track is always part of filteredTracks.
  const currentLibrary = libraries[currentLibTrackIndex.libraryIndex]; //the current library by default
  // console.log('This is the current library', currentLibrary)
  const tracks = currentLibrary?.tracks || [];
  const currentTrack = tracks[currentLibTrackIndex.trackIndex];
  const { trackTitle, trackArtist, trackStorageFilePath, vinylThumbnail } = currentTrack || {}; // So that is the current track by default- Add guard for undefined currentTrack
  // Construct the full, playable URL. The browser automatically adds/resolves the base host url automatically...so don't add in development phase
  const fullAudioUrl = trackStorageFilePath ? `${trackStorageFilePath}` : ''; // extracting the audioFile from currentTrack above
  // const fullAudioUrl = trackStorageFilePath ? `${API_BASE_URL}${trackStorageFilePath}` : '';
  // Refs
  // const audioRef = useRef(new Audio(fullAudioUrl)); //giving that audio file to a ref
  // const audioRef = useRef(new Audio(fullAudioUrl));
  // Refs

  console.log("This is the full audio url", fullAudioUrl)
  const audioRef = useRef(null);
  const intervalRef = useRef();
  const isReady = useRef(false);

  // const currentTrackProgress = audioRef.current.duration
  //   ? `${trackProgress}%`
  //   : "0%";
  const duration = audioRef.current?.duration || 0;

  const currentTrackPercent = duration
    ? (trackProgress / duration) * 100  // 0–100
    : 0;
  const trackStyling = `
      -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentTrackPercent}%, #fff), color-stop(${currentTrackPercent}%, #777))
    `;

  const startTimer = () => {
    // Clear any timers already running
    clearInterval(intervalRef.current);
    if (audioRef.current) {
      console.log('timer audio object:', audioRef.current);
      console.log('timer audio src:', audioRef.current.src);
      console.log('timer currentTime', audioRef.current.currentTime);
    }
    intervalRef.current = setInterval(() => {
      if (audioRef.current?.ended) {
        setTrackProgress(audioRef.current.duration);
        handlePause();
        console.log('Audio currentTime:', audioRef.current.currentTime);
        console.log('Audio duration:', audioRef.current.duration);
        console.log('trackprogress:', trackProgress);
        console.log('currentPercentage:', currentTrackPercent);
        // clearInterval(intervalRef.current);
      } else if (audioRef.current) {
        // const newPercentage = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setTrackProgress(audioRef.current.currentTime); // Update progress
      }
      console.log('timer currentTime', audioRef.current.currentTime);
    }, 1000);
  };
  //   const startTimer = () => { 
  //   // Clear any timers already running
  //   clearInterval(intervalRef.current);
  //   if(audioRef.current) {
  //     console.log('timer audio object:', audioRef.current);
  //     console.log('timer audio src:', audioRef.current.src);
  //     console.log('timer currentTime', audioRef.current.currentTime);
  //   }
  //   intervalRef.current = setInterval(() => {
  //     if (audioRef.current?.ended) {
  //       if (audioRef.current) {
  //         setTrackProgress(audioRef.current.duration); 
  //         console.log('Audio currentTime:', audioRef.current.currentTime);
  //         console.log('Audio duration:', audioRef.current.duration);
  //       }
  //       handlePause();
  //       console.log('trackprogress:', trackProgress);
  //       console.log('currentPercentage:', currentTrackPercent);
  //     } else {
  //       if (audioRef.current) {
  //         setTrackProgress(audioRef.current.currentTime); // Update progress
  //       }
  //     }
  //     if (audioRef.current) {
  //       console.log('timer currentTime', audioRef.current.currentTime);
  //     }
  //   }, 1000);
  // };

  const onScrub = (value) => {
    // Clear any timers already running and move to new location
    clearInterval(intervalRef.current);
    const numericValue = parseFloat(value); // slider in seconds
    console.log('raw value from range:', value, 'type:', typeof value);
    console.log('numericValue:', numericValue, 'isNaN:', Number.isNaN(numericValue));
    // Check if audio duration is ready
    const duration = audioRef.current?.duration;
    console.log('Audio state', audioRef.current?.readyState)
    console.log('Audio duration in onScrub:', duration);
    if (!duration || Number.isNaN(duration)) {
      console.log('Audio duration not ready');
      setTrackProgress(numericValue);
      return;
    }
    if (audioRef.current) {
      console.log('scrub audio object:', audioRef.current);
      console.log('scrub audio src:', audioRef.current.src);
      console.log('seekable.length:', audioRef.current.seekable.length);
    }
    if (audioRef.current?.seekable) {
      for (let i = 0; i < audioRef.current.seekable.length; i++) {
        console.log(
          `seekable[${i}]:`,
          audioRef.current.seekable.start(i),
          '→',
          audioRef.current.seekable.end(i)
        );
      }
    }
    try {
      if (audioRef.current) {
        audioRef.current.currentTime = numericValue;
        console.log('scrub currentTime after assignment', audioRef.current.currentTime);
        const rejectChecker = numericValue;
        console.log('rejectChecker', rejectChecker);
        setTrackProgress(audioRef.current.currentTime);
      }
    } catch (error) {
      console.error('Error scrubbing audio:', error);
    }
  };

  const onScrubEnd = () => {
    const duration = audioRef.current?.duration;
    if (!duration || Number.isNaN(duration)) {
      console.log('Audio duration not ready');
      return;
    }
    // If not already playing, start
    if (!isPlaying) {
      handlePlay();
    }
    startTimer();
  };

  const handlePlay = () => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const toPrevTrack = () => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }
    if (currentLibTrackIndex.trackIndex - 1 < 0) {
      setCurrentLibTrackIndex({ libraryIndex: currentLibTrackIndex.libraryIndex, trackIndex: tracks.length - 1 });
    } else {
      setCurrentLibTrackIndex({ libraryIndex: currentLibTrackIndex.libraryIndex, trackIndex: currentLibTrackIndex.trackIndex - 1 });
    }
  };

  const toNextTrack = () => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }
    if (currentLibTrackIndex.trackIndex < tracks.length - 1) {
      setCurrentLibTrackIndex({ libraryIndex: currentLibTrackIndex.libraryIndex, trackIndex: currentLibTrackIndex.trackIndex + 1 });
    } else {
      setCurrentLibTrackIndex({ libraryIndex: currentLibTrackIndex.libraryIndex, trackIndex: 0 });
    }
  };

  // Effect for handling play/pause
  // useEffect(() => {
  // Ensure player is paused when not active or when the track changes
  //add to the trackframe parameters and check here isActive = {CurrentTrackIndex === index}
  //OR map through tracks and check if index === currentTrackIndex. And instead of isActive, use currentTrackIndex in the dependency array
  // tracks.map((track, index) => 
  //   if (!audioRef.current.paused){
  //       setIsPlaying(false);
  //       audioRef.current.pause();
  //   }
  // },[currentLibTrackIndex]);

  // Ahh got it- when HandlePlay sets isPlaying to true,
  //HandlePlay is receives onPlay which is a parameter that receives
  //handlyPlay from the MusicContainer, which sets the activePlayer
  // to true. And that same isPlaying that was set to true trigger the following
  // side effect that plays the audio.
  useEffect(() => {
    if (isPlaying && hasUserInteracted) {
      audioRef.current?.play();
      startTimer();
    } else {
      audioRef.current?.pause();
      clearInterval(intervalRef.current);
    }
  }, [isPlaying, hasUserInteracted]);

  // Handles cleanup and setup when changing tracks
  // This hook now ONLY loads the new audio source. It does not play it.
  useEffect(() => {
    // 1. Always pause the current audio to stop previous track
    audioRef.current?.pause();

    // 2. If valid new track, load it
    if (trackStorageFilePath) {
      audioRef.current = new Audio(fullAudioUrl);
      setTrackProgress(0);

      // 3. If player was already playing, resume playback with new track
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => startTimer())
            .catch(error => console.error("Playback failed:", error));
        } else {
          startTimer();
        }
      }
    }
  }, [trackStorageFilePath, fullAudioUrl]); // Depend on the raw data, not computed value
  // trackStorageFilePath: Triggers when the track file changes
  // fullAudioUrl: Ensures you have the latest URL value inside the effect.
  //fullAudioUrl comes from trackStorage so you want to make sure the fullAudioUrl is already loaded by the time the useEffect triggers

  // Effect to notify parent when current track changes
  useEffect(() => {
    if (onTrackChange && currentTrack) {
      onTrackChange(currentTrack);
    }
  }, [currentTrack, onTrackChange]);

  // player change
  useEffect(() => {
    // Pause and clean up on unmount
    return () => {
      audioRef.current?.pause();
      if (audioRef.current) {
        audioRef.current.src = '';
      }
      //   audioRef.current = null;
      clearInterval(intervalRef.current);
    };
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    // Potentially reset currentTrackIndex or adjust playback if the current track is filtered out
    // For now, we'll just filter the list displayed in TrackFrame
  };
  // Handle track selection from filtered list. So as the index of the tracks change with filter,...(next line)
  // we need to find the track in th filtered index, then find it's index in the original array
  const handleTrackSelect = ({ libraryIndex, trackIndex }) => {
    // Find the actual track in the original array
    const filteredTrack = filteredLibraries[libraryIndex].tracks[trackIndex];
    const originalTrackIndex = libraries[libraryIndex].tracks.findIndex(
      track => track.trackId === filteredTrack.trackId
    );
    setCurrentLibTrackIndex({
      libraryIndex,
      trackIndex: originalTrackIndex
    });
  };

  return (
    <div className="audio-player">
      {playerTitle && <h2 className="player-title">{playerTitle}</h2>}
      <div className="player-grid">
        <div className="track-frame-container">
          <SearchBar onSearch={handleSearch} /> {/* Add SearchBar here */}

          {searchTerm && filteredLibraries[currentLibTrackIndex.libraryIndex]?.tracks?.length === 0 && (
            <div className="no-results">No tracks found matching "{searchTerm}"</div>
          )} {/* If search bar return no result */}
          <TrackFrame
            libraries={filteredLibraries}
            //put isActive here instead of the MusicContainer
            //add to the trackframe parameters and check here isActive = {CurrentTrackIndex === index}
            currentLibTrackIndex={currentLibTrackIndex}
            onTrackSelect={handleTrackSelect}
          />
        </div>
        <AudioControls
          isPlaying={isPlaying}
          onPlayPauseClick={isPlaying ? handlePause : handlePlay}
          onPrevClick={toPrevTrack}
          onNextClick={toNextTrack}
          trackProgress={trackProgress}
          onScrub={onScrub}
          onScrubEnd={onScrubEnd}
          trackStyling={trackStyling}
          audioRef={audioRef}
          track={currentTrack ? currentTrack : null}
        // controlsSize prop removed
        />
      </div>
    </div>

  );
};

export default AudioPlayer;
