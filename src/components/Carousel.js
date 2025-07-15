import React from 'react';
import { Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import '../styles/Carousel.css';
import InfoSlider from './InfoSlider';
import carouselImage1 from '../assets/images/Carousel-Image.png';
import carouselImage2 from '../assets/images/Carousel-image-option.png';



const CustomCarousel = () => {
    const slides = [
        {
            url: carouselImage1,
            alt: "Sonic Energy",
        },
        {
            url: carouselImage2,
            alt: "Production, Songwriting & Arrangement",
        },
    ];
    return (
        <div>
            <div className="carousel-container">
            <InfoSlider slides={slides}/>
            </div>
        </div>  
    );
}

// const CustomCarousel = () => {
//     return (
//         <div className="carousel-container">
//             <Carousel 
//                 id="myCarousel" 
//                 className="carousel" 
//                 indicators={true} 
//                 controls={true} 
//                 interval={5000}
//                 prevIcon={<span className="carousel-control-prev-icon" aria-hidden="true"></span>}
//                 nextIcon={<span className="carousel-control-next-icon" aria-hidden="true"></span>}
//             >
//                 <Carousel.Item>
//                     <img 
//                         src={process.env.PUBLIC_URL + '/assets/images/carousel-image-option.png'} 
//                         alt="Music Production" 
//                         className="carouselImage" 
//                     />
//                     <Carousel.Caption>
//                         <h3>Quality Production</h3>
//                         <p>Professional audio engineering and music production for your creative projects.</p>
//                     </Carousel.Caption>
//                 </Carousel.Item>
//                 {/* <Carousel.Item>
//                     <img 
//                         src={process.env.PUBLIC_URL + '/assets/images/carousel-image-bg.png'} 
//                         alt="Music Licensing" 
//                         className="carouselImage" 
//                     />
//                     <Carousel.Caption>
//                         <h3>Premium Beats</h3>
//                         <p>Find the perfect sound for your next project from our curated catalog.</p>
//                     </Carousel.Caption>
//                 </Carousel.Item> */}
//             </Carousel>
//             <Link to="/licensing" className="licensing-link">
//                 License Music <FaArrowRight />
//             </Link>
//         </div>
//     );
// };

export default CustomCarousel;