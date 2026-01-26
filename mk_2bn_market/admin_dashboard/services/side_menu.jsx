import {Box, Button} from "@mui/material";
import AddIcon from '../../public/img/icons/ajouter.png';
import InventoryIcon from '../../public/img/icons/inventory.png';
import AddUser from '../../public/img/icons/adduser.png';
import Historique from '../../public/img/icons/historique.png';
import DashboardIcon from '../../public/img/icons/dashboard.png';
import LogOut from '../../public/img/icons/logout.png';
import EditIcon from '../../public/img/icons/edit.png';
import { Link } from "react-router-dom";

export default function SideMenu(){
    return(
            <Box className="dashboard_sidemenu">
                <ul>
                    <Link to="/admin/dashboard"><div style={{display:'flex'}}><span><img src={DashboardIcon} alt="Tableau de bord" width='60%' /></span><span><li>Tableau de bord</li></span></div></Link>
                    <Link to="/admin/create-product"><div style={{display:'flex'}}><span><img src={AddIcon} alt="Ajouter" width='60%' /></span><span><li>Crée un produits</li></span></div></Link>
                    <Link to="/admin/edit-product"><div style={{display:'flex'}}><span><img src={EditIcon} alt="Modifier un produit" width='60%' /></span><span><li>Modifier un produits</li></span></div></Link>
                    <Link to="/admin/inventory"><div style={{display:'flex'}}><span><img src={InventoryIcon} alt="Inventaire" width='50%' /></span><span><li>Inventaire des produits</li></span></div></Link>
                    <Link to="/admin/create-user"><div style={{display:'flex'}}><span><img src={AddUser} alt="Ajouter utilisateur" width='60%' /></span><span><li>Crée des comptes utilisateurs</li></span></div></Link>
                    <Link to="/admin/sales-history"><div style={{display:'flex'}}><span><img src={Historique} alt="Historique des ventes" width='60%' /></span><span><li>Historique des ventes</li></span></div></Link>
                    <Button className="logout_button"><div  style={{display:'flex'}}><span><img src={LogOut} alt="Se deconnecter" width='40%' /></span><span><li>Se deconnecter</li></span></div></Button>
                </ul>
            </Box>
    )
}