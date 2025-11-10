import React, { useState, useEffect, useRef } from "react";
import AudioControls from "./AudioControl";
import TrackFrame from "./TrackFrame";
import SearchBar from "./SearchBar"; // Import the SearchBar component
import "../styles/AudioPlayer.css";
import { API_BASE_URL } from "../api";


const AudioPlayer = ({ libraries, playerTitle }) => {
  console.log("AudioPlayer received libraries:", libraries); // Debug log
  // desctructure tracks from libraries
  // State
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  // console.log("Initial render - isPlaying:", isPlaying, "isActive:", isActive);
  const [currentLibTrackIndex, setCurrentLibTrackIndex] = useState({libraryIndex: 0, trackIndex: 0}); //I don't need to have a separate state for the library index as it is already set in TrackFrame based on the active library.
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  // Filter tracks based on search term in the pertaining library
  const filteredTracks = libraries[currentLibTrackIndex.libraryIndex]?.tracks?.filter(track => 
    track.trackTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
    track.trackArtist.toLowerCase().includes(searchTerm.toLowerCase())
    || track.trackBpm.toLowerCase().includes(searchTerm.toLowerCase())
    || track.trackDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Use filteredTracks for display, but manage currentTrackIndex based on the original tracks array
  // This assumes currentTrackIndex refers to the index in the *original* `tracks` prop.
  // If a track is filtered out, the player might behave unexpectedly if it was the current track.
  // A more robust solution would involve updating currentTrackIndex when tracks are filtered,
  // or ensuring the currently playing track is always part of filteredTracks.
  const currentLibrary = libraries[currentLibTrackIndex.libraryIndex]; //the current library by default
  console.log('This is the current library', currentLibrary)
  const tracks = currentLibrary?.tracks || [];
  const currentTrack = tracks[currentLibTrackIndex.trackIndex]; 
  const { trackTitle, trackArtist, trackStorageFilePath, vinylThumbnail} = currentTrack || {}; // So that is the current track by default- Add guard for undefined currentTrack
  // Construct the full, playable URL
  const fullAudioUrl = trackStorageFilePath ? `${API_BASE_URL}${trackStorageFilePath}` : ''; // extracting the audioFile from currentTrack above
  // Refs
  const audioRef = useRef(new Audio(fullAudioUrl)); //giving that audio file to a ref
  const intervalRef = useRef();
  const isReady = useRef(false);

  const currentPercentage = audioRef.current.duration
    ? `${(trackProgress / audioRef.current.duration) * 100}%`
    : "0%";
  const trackStyling = `
    -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #fff), color-stop(${currentPercentage}, #777))
  `;

  const startTimer = () => {
    // Clear any timers already running
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        handlePause();
        // clearInterval(intervalRef.current);
      } else {
        setTrackProgress(audioRef.current.currentTime);
      }
    }, [1000]);
  };

  const onScrub = (value) => {
    // Clear any timers already running
    clearInterval(intervalRef.current);
    audioRef.current.currentTime = value;
    setTrackProgress(audioRef.current.currentTime);
  };

  const onScrubEnd = () => {
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
    // onPause();
  };

  const toPrevTrack = () => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }
    if (currentLibTrackIndex.trackIndex - 1 < 0) {
      setCurrentLibTrackIndex({libraryIndex: currentLibTrackIndex.libraryIndex, trackIndex: tracks.length - 1});
    } else {
      setCurrentLibTrackIndex({libraryIndex: currentLibTrackIndex.libraryIndex, trackIndex: currentLibTrackIndex.trackIndex - 1});
    }
  };

  const toNextTrack = () => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }
    if (currentLibTrackIndex.trackIndex < tracks.length - 1) {
      setCurrentLibTrackIndex({libraryIndex: currentLibTrackIndex.libraryIndex, trackIndex: currentLibTrackIndex.trackIndex + 1});
    } else {
      setCurrentLibTrackIndex({libraryIndex: currentLibTrackIndex.libraryIndex, trackIndex: 0});
    }
  };

  // Effect for handling play/pause
  useEffect(() => {
    // Ensure player is paused when not active or when the track changes
    //add to the trackframe parameters and check here isActive = {CurrentTrackIndex === index}
    //OR map through tracks and check if index === currentTrackIndex. And instead of isActive, use currentTrackIndex in the dependency array
    // tracks.map((track, index) => 
      if (!audioRef.current.paused){
          setIsPlaying(false);
          audioRef.current.pause();
      }
    },[currentLibTrackIndex]);

  // Ahh got it- when HandlePlay sets isPlaying to true,
  //HandlePlay is receives onPlay which is a parameter that receives
  //handlyPlay from the MusicContainer, which sets the activePlayer
  // to true. And that same isPlaying that was set to true trigger the following
  // side effect that plays the audio.
  useEffect(() => {
    if (isPlaying && hasUserInteracted) {
      audioRef.current.play();
      startTimer();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, hasUserInteracted]);

  // Handles cleanup and setup when changing tracks
  // This hook now ONLY loads the new audio source. It does not play it.
  useEffect(() => {
    audioRef.current.pause();
    audioRef.current = new Audio(fullAudioUrl);
    setTrackProgress(audioRef.current.currentTime);
  }, [fullAudioUrl]);

  // player change
  useEffect(() => {
    // Pause and clean up on unmount
    return () => {
      audioRef.current.pause();
      audioRef.current.src = '';
    //   audioRef.current = null;
      clearInterval(intervalRef.current);
    };
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    // Potentially reset currentTrackIndex or adjust playback if the current track is filtered out
    // For now, we'll just filter the list displayed in TrackFrame
  };

  return (
    <div className="audio-player">
      {playerTitle && <h2 className="player-title">{playerTitle}</h2>}
      <div className="player-grid">
        <div className="track-frame-container">
          <SearchBar onSearch={handleSearch} /> {/* Add SearchBar here */}
          <TrackFrame 
            libraries={libraries}
          //put isActive here instead of the MusicContainer
          //add to the trackframe parameters and check here isActive = {CurrentTrackIndex === index}
            currentLibTrackIndex={currentLibTrackIndex}
            onTrackSelect={setCurrentLibTrackIndex}
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
          track={currentTrack?currentTrack: null}
          // controlsSize prop removed
        />
      </div>
    </div>

  );
};

export default AudioPlayer;
