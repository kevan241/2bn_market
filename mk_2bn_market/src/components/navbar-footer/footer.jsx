import {Box} from "@mui/material";
import '../../custome.css';

export default function Footer() {
    return(
        <Box className="footer_container" sx={{display:'flex',flexDirection:'column'}}>
            <div className="block_one_footer">
                <div><h3>Nos services</h3>
                    <ul>
                        <li>Formation comptabilités</li>
                        <li>Formation vidéos</li>
                        <li>Formation Excel</li>
                    </ul>
                </div>
                <div><h3>Liens utiles</h3>
                    <ul>
                        <li>A propos de nous</li>
                        <li>Nos experts</li>
                        <li>FAQ</li>
                    </ul>
                </div>
                <div><h3>Conditions générales de vente</h3>
                    <ul>
                        <li>Politique de facturation</li>
                        <li>Licence d’utilisation des contenus</li>
                        <li>Protection des données personnelles</li>
                        <li>Service client / support</li>
                    </ul>
                </div>
                <div><h3>Mentions légales</h3>
                    <ul>
                        <li>Données personnelles</li>
                        <li>Propriété intellectuelle</li>
                        <li>Cookies</li>
                    </ul>
                </div>
            </div>
            <div className="block_two_footer">
                <span>© 2025. 2bn marketplace all right reserved</span>
            </div>
        </Box>
    )
}