import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/AboutUs.css';
import { FaMusic, FaMicrophone, FaCompactDisc, FaHeadphones } from 'react-icons/fa';
import radicleDrumLogo from '../assets/images/Radicle Sound Logo drum.png';


const AboutUs = () => {
    return (
        <div className="about-container page-wrapper">
            <div className="main-content">
                <div className="content-section">
                    {/* The existing content of AboutUs page will be here, removing the 'about-glass' div */}
                    <div className="about-content"> 
                        <div className="about-left">
                            <div className="about-image">
                                <img 
                                    src={radicleDrumLogo}
                                    alt="Radicle Sound drum logo"
                                    className="about-logo"
                                />
                            </div>
                            <div className="about-text">
                                <h2>Welcome to Radicle Sound</h2>
                                <p>
                                    GardlyRadicle is the founder of Radicle Sound, an underground electronic music project rooted
                                    in Haitian rhythm and driven by modern sound design. Blending traditional Vodou-inspired percussion, 
                                    tribal grooves, Afrohouse energy, and bass-heavy electronic production, his music explores the meeting point 
                                    between cultural memory and technological evolution, a sound that is simultaneously ancestral and entirely unfamiliar.
                                    After more than two decades developing his craft behind closed doors, 
                                    GardlyRadicle emerges with a distinctive sound shaped by obsessive experimentation, 
                                    engineering precision, and deep respect for Haitian roots culture. His sonic territory sits 
                                    at the crossroads of Tribal, Afrohouse, and Haitian Rasin electronics — gritty, bassy, and rooted in something ancient.
                                </p>
                                <p> 
                                    So, here Radicle Sound is passionate about bringing your musical vision to life. 
                                    With state-of-the-art equipment and years of experience, we provide 
                                    music production that helps artists achieve their creative goals.
                                </p>
                            </div>
                        </div>

                        <div className="service-panel">
                            <div className="service-list">
                                <Link to="/licensing" className="service-item service-item-link">
                                    <FaMusic className="service-icon" />
                                    <div className="service-item-content">
                                        <span className="service-title">Sample Packs & Drum Libraries</span>
                                        <p className="service-description">
                                            This collection was built from sessions exploring the intersection of Haitian percussion, 
                                            underground electronic music, and modern sound design. Inside you'll find loops, textures, 
                                            and rhythmic tools designed to add movement, weight, and character to your productions.
                                        </p>
                                    </div>
                                </Link>
                                <Link to="/licensing" className="service-item service-item-link">
                                    <FaMicrophone className="service-icon" />
                                    <div className="service-item-content">
                                        <span className="service-title">Licensed Beats & Production Licenses</span>
                                        <p className="service-description">
                                            Built for artists and influencers who need a foundation that moves. Each instrumental 
                                            is a fully realized production — not a sketch, not a loop — with the rhythmic 
                                            depth to carry melody, the sonic space for a vocal to breathe, and the cultural DNA to make it feel distinct.
                                        </p>
                                    </div>
                                </Link>
                                <Link to="/licensing" className="service-item service-item-link">
                                    <FaHeadphones className="service-icon" />
                                    <div className="service-item-content">
                                        <span className="service-title">Listener Releases</span>
                                        <p className="service-description">
                                            Music should reach people. The originals and remixes here are free — 
                                            offered with no gate and no algorithm required, because some things you just pass on. 
                                            If what you hear resonates, a contribution keeps the underground alive and the studio running. 
                                            No pressure. Just signal.
                                        </p>
                                    </div>
                                </Link>
                                <Link to="/contact" className="service-item service-item-link">
                                    <FaCompactDisc className="service-icon" />
                                    <div className="service-item-content">
                                        <span className="service-title">Expert Mixing & Mastering</span>
                                        <p className="service-description">
                                            Professional mixing and mastering services to give your tracks the clarity, punch, and polish they deserve.
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;