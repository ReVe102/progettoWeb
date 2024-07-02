import "./sidebar.css"
import { Link } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import BadgeIcon from '@mui/icons-material/Badge';

export default function Sidebar(){
    return(
        <div className="sidebar">
            <div className="sidebarWrapper">
                <ul className="sidebarList">
                    <li className="sidebarListItem">
                    <Link to="/feedPrivati" className="sidebarLink">
                        <BadgeIcon className="sidebarIcon"/>
                        <span className="sidebarListItemText">Employee Area</span>
                    </Link>   
                    </li>
                    <li className="sidebarListItem">
                    <Link to="/feedAziende" className="sidebarLink">
                        <BusinessIcon className="sidebarIcon"/>
                        <span className="sidebarListItemText">Business Area</span>
                    </Link>   
                    </li>
                    
                    <Link to="/profilo" className="sidebarLink">
                    <li className="sidebarListItem">
                        <PersonIcon className="sidebarIcon"/>
                        <span className="sidebarListItemText">Profile</span>
                    </li>
                    </Link>
                </ul>
            </div>
        </div>
    )
}