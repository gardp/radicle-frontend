import React from 'react';
import '../styles/AboutUs.css';
import { FaMusic, FaMicrophone, FaCompactDisc, FaGuitar } from 'react-icons/fa';


const AboutUs = () => {
    return (
        <div className="page-wrapper">
            <div className="main-content">
                <div className="content-section">
                    {/* The existing content of AboutUs page will be here, removing the 'about-glass' div */}
                    <div className="about-content"> 
                        <div className="about-image">
                            <img 
                                src={process.env.PUBLIC_URL + '/favicon.ico'} 
                                alt="Radicle Favicon"
                            />
                        </div>
                        <div className="about-text">
                            <h2>Welcome to Radicle Studio</h2>
                            <p>
                                At Radicle Studio, we're passionate about bringing your musical vision to life. 
                                With state-of-the-art equipment and years of industry experience, we provide 
                                comprehensive music production services that help artists achieve their creative goals.
                            </p>
                            <p>
                                Our team of experienced producers and engineers work closely with each artist 
                                to ensure their unique sound is captured and enhanced to professional standards.
                            </p>
                            
                            <div className="service-list">
                                <div className="service-item">
                                    <FaMusic className="service-icon" />
                                    <span>Professional Music Production</span>
                                </div>
                                <div className="service-item">
                                    <FaMicrophone className="service-icon" />
                                    <span>Songwriting & Arrangement</span>
                                </div>
                                <div className="service-item">
                                    <FaCompactDisc className="service-icon" />
                                    <span>Expert Mixing & Mastering</span>
                                </div>
                                <div className="service-item">
                                    <FaGuitar className="service-icon" />
                                    <span>Live Session Musicians</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;