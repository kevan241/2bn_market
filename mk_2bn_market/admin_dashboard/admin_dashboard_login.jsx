import { Box,TextField, Button } from "@mui/material";
import { login } from "./services/authServices";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./services/dashboard";
import './dashboard.css';

export default function AdminLog(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
        const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const Navigate = useNavigate();

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Réinitialise l'erreur
    setLoading(true);

        
    try {
        const data = await login(email, password);
            console.log('Connexion réussie !', data);
            Navigate('/admin/dashboard');
        } catch (err) {
            setError(err.message || 'Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    return(
        <Box className="admin_dashboard_login_container">
            <div className="login_side">
                <h2>Admin Login</h2>
                <p>Connectez-vous pour gérer les produits, commandes et utilisateurs de la plateforme.</p>
                <Box className="login_form_container">
                    <form onSubmit={handleSubmit}>
                        <TextField fullWidth label="Email" type="email" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
                        <TextField fullWidth label="Password" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
                        {error && (<Box sx={{ color: 'red', marginTop: '10px', marginBottom: '10px' }}>{error}</Box>)}
                        <div className="forgot_password"><span>Mot de passe oublié ?</span></div>
                        <Button className="basket_button" fullWidth type="submit" variant="contained" disabled={loading}>{loading ? 'Connexion...' : 'Se connecter'}</Button>
                    </form>
                </Box>
            </div>
            <div className="banner_side">

            </div>
        </Box>
    )
}