import { Link } from "react-router-dom";
import React, {Component} from "react"

export default class Home extends Component{
  constructor(props){
    super(props);
    this.state={
      userData:""
    }
  }
  
  componentDidMount(){
    fetch("http://localhost:3000/userData",{
            method:"POST",
            crossDomain:true,
            headers:{
                "Content-Type":"application/json",
                Accept:"application/json",
                "Access-Control-Allow-Origin":"*",
            },
            body:JSON.stringify({
                token: window.localStorage.getItem("token")
            }),
        }).then((res)=>res.json())
        .then((data)=>{
            console.log(data,"userData");
            this.setState({userData: data.data});
        })
  }


  render(){
  return (
    <div>
        <h1>{this.state.userData.name}</h1>
        <h1>{this.state.userData.email}</h1>
        <Link to='/login' className="btn btn-light my-5">Logout</Link>
    </div>
  )
}
}
