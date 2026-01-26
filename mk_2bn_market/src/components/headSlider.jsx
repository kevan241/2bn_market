import {Box} from "@mui/material";
import { useEffect, useState } from "react";
import '../custome.css';


export default function HeadSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % 2); 
        }, 7000);
        return () => clearInterval(timer);
    }, []);


    const handleDotClick = (index) => {
    setCurrentSlide(index);
}
    
    return(
        <Box className="head_slider_container">
            <div className="slides">
                <div className="slide_one_container" style={{ marginLeft: `${currentSlide * -100}%` }}>
                    <div className="slider_content_one">
                        <h1>Formation - les bases d'Excel</h1>
                    </div>
                </div>
                <div className="slide_two_container">
                    <div className="slider_content_two">
                        <h1>Formation - Monter un business plan</h1>
                    </div>
                </div>
            </div>

            <div className="slider_dots">
                <div  className={`dot ${currentSlide === 0 ? 'active' : ''}`} onClick={() => setCurrentSlide(0)} aria-label="Slide 1"></div>
                <div  className={`dot ${currentSlide === 1 ? 'active' : ''}`} onClick={() => setCurrentSlide(1)} aria-label="Slide 2"></div>
            </div>
        </Box>
    )
}