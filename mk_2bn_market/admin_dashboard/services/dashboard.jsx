import {Box, Button} from "@mui/material";
import AddIcon from '../../public/img/icons/ajouter.png';
import InventoryIcon from '../../public/img/icons/inventory.png';
import AddUser from '../../public/img/icons/adduser.png';
import Historique from '../../public/img/icons/historique.png';
import DashboardIcon from '../../public/img/icons/dashboard.png';
import LogOut from '../../public/img/icons/logout.png';
import { Link } from "react-router-dom";
import SideMenu from "./side_menu";

export default function Dashboard(){
    return(
        <Box className="admin_dashboard_service_container">
            <SideMenu />
            <Box className="dashboard_maincontent">
                <h2>Bienvenue sur le tableau de bord administrateur</h2>
            </Box>
        </Box>
    )
}