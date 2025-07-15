// import React from 'react';
import '../styles/Tracks.css';
import redVinyl from '../assets/images/vinyl-red.png';
import avatar from '../assets/images/radicleavatar.jpg';
import babyRadicle from '../assets/images/baby-radicle.png';
// For files in the public folder, we use process.env.PUBLIC_URL
const Big = process.env.PUBLIC_URL + '/assets/music/01 Big (feat. Gunna).mp3';
const Dreams = process.env.PUBLIC_URL + '/assets/music/GardlyRadicle-GardlyRadicle-Bad Dreams Remix.mp3';

// License options data with structured information
const licenseOptions = [
  {
    id: 'basic',
    name: 'Basic',
    price: 29.99,
    features: [
      'Non-commercial use only',
      'Credit required',
      'No monetization allowed',
      'Single project use'
    ],
    recommended: false
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 59.99,
    features: [
      'Commercial use allowed',
      'Credit required',
      'Limited monetization',
      'Single project use',
      'Up to 10,000 streams'
    ],
    recommended: true
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 149.99,
    features: [
      'Full commercial rights',
      'Credit required',
      'Unlimited monetization',
      'Multiple projects',
      'Up to 100,000 streams',
      'Broadcasting rights'
    ],
    recommended: false
  },
  {
    id: 'exclusive',
    name: 'Exclusive',
    price: 499.99,
    features: [
      'Full ownership transfer',
      'Credit optional',
      'Unlimited use',
      'All rights included',
      'Unlimited streams',
      'Full broadcasting rights'
    ],
    recommended: false
  }
];

// ${imgSrc}radicleavatar.jpg

const tracksData = [
  {
    id: 1,
    title: "Big",
    artist: "Gunna",
    audioSrc: Big,
    vinylImage: redVinyl,
    thumbImage: babyRadicle,
    licenseOption: licenseOptions[0],
    links:{
      streamLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      buyLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      // downloadLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c"
    },
    color: "#00aeb0",
    musicType: "Featured",
    genre: "Rap",
    bpm: 120,  
  },
  {
    id: 2,
    title: "Bad Dreams",
    artist: "GardlyRadicle",
    audioSrc: Dreams,
    vinylImage: redVinyl,
    thumbImage: babyRadicle,
    licenseOption: licenseOptions[1],
    links:{
      streamLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      buyLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      // downloadLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c"
    },
    color: "#00aeb0",
    musicType: "Featured",
    genre: "Rap",
    bpm: 120,
  },
  {
    id: 2,
    title: "Bad Dreams",
    artist: "GardlyRadicle",
    audioSrc: Dreams,
    vinylImage: redVinyl,
    thumbImage: babyRadicle,
    licenseOption: licenseOptions[1],
    links:{
      streamLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      buyLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      // downloadLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c"
    },
    color: "#00aeb0",
    musicType: "Featured",
    genre: "Rap",
    bpm: 120,
  },
  {
    id: 2,
    title: "Bad Dreams",
    artist: "GardlyRadicle",
    audioSrc: Dreams,
    vinylImage: redVinyl,
    thumbImage: babyRadicle,
    licenseOption: licenseOptions[1],
    links:{
      streamLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      buyLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      // downloadLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c"
    },
    color: "#00aeb0",
    musicType: "Featured",
    genre: "Rap",
    bpm: 120,
  },
  {
    id: 2,
    title: "Bad Dreams",
    artist: "GardlyRadicle",
    audioSrc: Dreams,
    vinylImage: redVinyl,
    thumbImage: babyRadicle,
    licenseOption: licenseOptions[1],
    links:{
      streamLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      buyLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      // downloadLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c"
    },
    color: "#00aeb0",
    musicType: "Featured",
    genre: "Rap",
    bpm: 120,
  },
  {
    id: 2,
    title: "Bad Dreams",
    artist: "GardlyRadicle",
    audioSrc: Dreams,
    vinylImage: redVinyl,
    thumbImage: babyRadicle,
    licenseOption: licenseOptions[1],
    links:{
      streamLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      buyLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      // downloadLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c"
    },
    color: "#00aeb0",
    musicType: "Featured",
    genre: "Rap",
    bpm: 120,
  },
  {
    id: 2,
    title: "Bad Dreams",
    artist: "GardlyRadicle",
    audioSrc: Dreams,
    vinylImage: redVinyl,
    thumbImage: babyRadicle,
    licenseOption: licenseOptions[1],
    links:{
      streamLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      buyLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      // downloadLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c"
    },
    color: "#00aeb0",
    musicType: "Featured",
    genre: "Rap",
    bpm: 120,
  },
  {
    id: 2,
    title: "Bad Dreams",
    artist: "GardlyRadicle",
    audioSrc: Dreams,
    vinylImage: redVinyl,
    thumbImage: babyRadicle,
    licenseOption: licenseOptions[1],
    links:{
      streamLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      buyLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      // downloadLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c"
    },
    color: "#00aeb0",
    musicType: "Featured",
    genre: "Rap",
    bpm: 120,
  },
  {
    id: 2,
    title: "Bad Dreams",
    artist: "GardlyRadicle",
    audioSrc: Dreams,
    vinylImage: redVinyl,
    thumbImage: babyRadicle,
    image: babyRadicle,
    licenseOption: licenseOptions[1],
    links:{
      streamLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      buyLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      // downloadLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c"
    },
    color: "#00aeb0",
    musicType: "Featured",
    genre: "Rap",
    bpm: 120,
  },
  {
    id: 2,
    title: "Bad Dreams",
    artist: "GardlyRadicle",
    audioSrc: Dreams,
    vinylImage: redVinyl,
    thumbImage: babyRadicle,
    image: babyRadicle,
    licenseOption: licenseOptions[1],
    links:{
      streamLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      buyLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      // downloadLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c"
    },
    color: "#00aeb0",
    musicType: "Featured",
    genre: "Rap",
    bpm: 120,
  },
  {
    id: 2,
    title: "Bad Dreams",
    artist: "GardlyRadicle",
    audioSrc: Dreams,
    vinylImage: redVinyl,
    thumbImage: babyRadicle,
    image: babyRadicle,
    licenseOption: licenseOptions[1],
    links:{
      streamLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      buyLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      // downloadLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c"
    },
    color: "#00aeb0",
    musicType: "Featured",
    genre: "Rap",
    bpm: 120,
  },
  {
    id: 2,
    title: "Bad Dreams",
    artist: "GardlyRadicle",
    audioSrc: Dreams,
    vinylImage: redVinyl,
    thumbImage: babyRadicle,
    image: babyRadicle,
    licenseOption: licenseOptions[1],
    links:{
      streamLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      buyLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      // downloadLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c"
    },
    color: "#00aeb0",
    musicType: "Featured",
    genre: "Rap",
    bpm: 120,
  },
  {
    id: 2,
    title: "Bad Dreams",
    artist: "GardlyRadicle",
    audioSrc: Dreams,
    vinylImage: redVinyl,
    thumbImage: babyRadicle,
    image: babyRadicle,
    licenseOption: licenseOptions[1],
    links:{
      streamLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      buyLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      // downloadLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c"
    },
    color: "#00aeb0",
    musicType: "Featured",
    genre: "Rap",
    bpm: 120,
  }
] ;



const tracksData2 = [
  {
    id: 1,
    title: "Big",
    artist: "Gunna",
    audioSrc: Big,
    vinylImage: redVinyl,
    links:{
      streamLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      buyLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      downloadLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c"
    },
    color: "#00aeb0",
    musicType: "Featured",
    genre: "Rap",
    bpm: 120,  
  },
  {
    id: 2,
    title: "Bad Dreams",
    artist: "GardlyRadicle",
    audioSrc: Dreams,
    vinylImage: redVinyl,  
    links:{
      streamLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      buyLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      downloadLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c"
    },
    color: "#00aeb0",
    musicType: "Featured",
    genre: "Rap",
    bpm: 120,
  },
  {
    id: 3,
    title: "Bidffgg",   
    artist: "Gudfgfdgnna",
    audioSrc: Big,
    vinylImage: redVinyl,
    links:{
      streamLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      buyLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      downloadLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c"
    },
    color: "#00aeb0",
    musicType: "Remix",
    genre: "Rap",
    bpm: 120,
  },
  {
    id: 4,
    title: "Bidffgg",
    artist: "Gudfgfdgnna",
    audioSrc: Big,
    vinylImage: redVinyl,
    links:{
      streamLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      buyLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      downloadLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c"
    },
    color: "#00aeb0",
    musicType: "Remix",
    genre: "Rap",
    bpm: 120,
  },
  {
    id: 5,
    title: "Bidffgg",
    artist: "Gudfgfdgnna",
    audioSrc: Big,
    vinylImage: redVinyl,
    links:{
      streamLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      buyLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      downloadLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c"
    },
    color: "#00aeb0",
    musicType: "Remix",
    genre: "Rap",
    bpm: 120,
    action: ["Stream Song"],
  },
  {
    id: 6,
    title: "Bidffgg",     
    artist: "Gudfgfdgnna",
    audioSrc: Big,
    vinylImage: redVinyl,
    links:{
      streamLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      buyLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      downloadLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c"
    },
    color: "#00aeb0",
    musicType: "Instrumental",
    genre: "Rap",
    bpm: 120,
  },
  {
    id: 7,
    title: "Bidffgg",
    artist: "Gudfgfdgnna",
    audioSrc: Big,
    vinylImage: redVinyl,
    links:{
      streamLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      buyLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      downloadLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c"
    },
    color: "#00aeb0",
    musicType: "Instrumental",
    genre: "Rap",
    bpm: 120,
  }, 
  {
    id: 8,
    title: "Bidffgg",
    artist: "Gudfgfdgnna",
    audioSrc: Big,
    vinylImage: redVinyl,
    links:{
      streamLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      buyLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c",
      downloadLink: "https://www.youtube.com/watch?v=ZBTb_xJBh5c"
    },
    color: "#00aeb0",     
    musicType: "Instrumental",
    genre: "Rap",
    bpm: 120,
  },    
] ;

export { tracksData, licenseOptions };

export default function Tracks() {
  // No implementation provided
}
