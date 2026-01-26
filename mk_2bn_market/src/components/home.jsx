import {Box} from "@mui/material";
import HeadSlider from "./headSlider";
import Products from "./products";
import '../custome.css';

export default function Home({onAddToBasket}) {
    return(
        <Box className="marketplace_container">
            <HeadSlider />
            <Products onAddToBasket={onAddToBasket} />
        </Box>
    )
}