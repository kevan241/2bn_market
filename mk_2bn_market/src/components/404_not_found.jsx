import {Box} from "@mui/material";
import '../custome.css';

export default function NotFound(){
    return(
        <Box className="not-found-container">
            <h1 className="title">404 - Page Non Trouvée</h1>
            <p className="elements">Désolé, la page que vous recherchez n'existe pas.</p>
        </Box>
    )
}