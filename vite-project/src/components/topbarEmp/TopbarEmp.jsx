import "./topbar.css"
import {Link} from "react-router-dom"

export default function TopbarEmp(){
    return(
        <div className="topbarContainer">
            <div className="topbarLeft"> 
            <Link to="/" style={{textDecoration:"none"}}>
            <span className="logo">Employee Area</span>
            </Link>
            </div>
        </div>
    );
}