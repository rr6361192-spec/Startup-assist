import React from 'react'


import{useState } from 'react'
function Contac({send}){
    const[data,setData]=useState({name:"",value:""})
    const Handle=(e)=>{
const{name,value}=e.target;    //destructuring of array
    setData({...data,[name]:value})
    }
  return (
    <>
    <div style={{height:"100px",width:"100%",display:'flex',justifyContent:"center",alignItems:"center",backgroundColor:"white",border:"2px solid aliceblue"}}>
      <h1 style={{color:"black",fontWeight:"bold",fontSize:"45px",position:"relative",right:"100px"}}>Contact-Manager</h1>
    </div>
    <div style={{marginLeft:"30px",width:"100%",display:"flex",flexDirection:"column",gap:"30px"}}>
        <div>
    <h1>Name:</h1>
    <input type="text"  style={{width:"50%",height:"35px",padding:"10px"}}  name="name" value={data.name} onChange={(e)=>Handle(e)}></input></div>
    <div>
   <h1>EMAIL:</h1>
   <input type="email"  name="email"  value={data.email} onChange={(e)=>Handle(e)} ></input>
    <button onClick={()=>send(prev=>[...prev, data])}>CLICK</button>
    </div>
    </div>
    </>
  )
}

export default Contac
 