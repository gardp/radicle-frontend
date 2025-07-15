// import React, { useEffect, useRef } from 'react';

// const AudioPlayer = () => {
//   const canvasRef = useRef(null);
//   const playerInitializedRef = useRef(false);

//   useEffect(() => {
//     if (!playerInitializedRef.current) {
//       // Define all the original objects/classes
//       const Framer = {
//         countTicks: 360,
//         frequencyData: [],
//         tickSize: 10,
//         PI: 360,
//         index: 0,
//         loadingAngle: 0,
//         // ... rest of the Framer object implementation
//         init: function(scene) {
//           this.canvas = canvasRef.current; // Use ref instead of querySelector
//           this.scene = scene;
//           this.context = scene.context;
//           this.configure();
//         },
//         // ... rest of Framer methods
//       };

//       const Tracker = {
//         innerDelta: 20,
//         lineWidth: 7,
//         prevAngle: 0.5,
//         angle: 0,
//         // ... rest of the Tracker object implementation
//         init: function(scene) {
//           this.scene = scene;
//           this.context = scene.context;
//           this.initHandlers();
//         },
//         // ... rest of Tracker methods
//       };

//       const Scene = {
//         padding: 120,
//         minSize: 740,
//         optimiseHeight: 982,
//         _inProcess: false,
//         // ... rest of the Scene object implementation
//         init: function() {
//           this.canvasConfigure();
//           this.initHandlers();

//           Framer.init(this);
//           Tracker.init(this);
//           Controls.init(this);

//           this.startRender();
//         },
//         canvasConfigure: function() {
//           this.canvas = canvasRef.current; // Use ref instead of querySelector
//           this.context = this.canvas.getContext('2d');
//           this.context.strokeStyle = '#FE4365';
//           this.calculateSize();
//         },
//         // ... rest of Scene methods
//       };

//       const Controls = {
//         playing: false,
//         // ... rest of the Controls object implementation
//         init: function(scene) {
//           this.scene = scene;
//           this.context = scene.context;
//           this.initHandlers();
//           this.timeControl = document.querySelector('.time');
//         },
//         // ... rest of Controls methods
//       };

//       const Player = {
//         buffer: null,
//         duration: 0,
//         tracks: [
//           {
//             artist: "Kavinsky",
//             song: "Odd Look ft. The Weeknd",
//             url: "//katiebaca.com/tutorial/odd-look.mp3"
//           }
//         ],
//         // ... rest of the Player object implementation
//         init: function() {
//           window.AudioContext = window.AudioContext || window.webkitAudioContext;
//           this.context = new AudioContext();
//           this.context.suspend && this.context.suspend();
//           this.firstLaunch = true;
//           // ... rest of init implementation
//         },
//         // ... rest of Player methods
//       };

//       // Initialize the player
//       Player.init();
//       playerInitializedRef.current = true;
//     }