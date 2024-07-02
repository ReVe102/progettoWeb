import "./topbar.css"
import {Link} from "react-router-dom"

export default function TopbarComp(){
    return(
        <div className="topbarContainer">
            <div className="topbarLeft"> 
            <Link to="/" style={{textDecoration:"none"}}>
            <span className="logo">Business area</span>
            </Link>
            </div>
        </div>
    );
}
