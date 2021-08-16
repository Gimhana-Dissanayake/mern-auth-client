import axios from 'axios'
import React,{useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import Layout from '../core/Layout'
import jwt from 'jsonwebtoken';

const Activate = () => {

    const params = useParams() as {token:string}

    const [values, setValues] = useState({
        name:"",
        token:'',
        show:false,
        
    })


    
    useEffect(() => {
       
       let {name} = jwt.decode(params.token) as {name:string}
       if(params.token){
          
           setValues((pS)=>(
               {...pS, name, token:params.token}
           ))

       }
    }, [params.token])

    const {name, token, show } = values

    console.log(show)

    const clickSubmit = (event:any)=>{
        event.preventDefault();
        
        axios({
            method:'POST',
            url:`${process.env.REACT_APP_API}/account-activation`,
            data: {token}
        }).then((response)=>{
            console.log('ACCOUNT_ACTIVATION ', response)
            setValues({...values,show:false})
            toast.success(response.data.message)
        }).catch(error => {
            console.log('ACCOUNT_ACTIVATION_ERROR ', error.response.data.error)
            toast.error(error.response.data.error)
        })
    }
    
    const activationLink = () =>(
        <div className="text-center">
        <h1 className="p-5 ">Hey {name}, Ready to Activate your account</h1>
        <button className="btn btn-outline-primary" onClick={clickSubmit}>
            Activate Account
        </button>
        </div>
    )

    

    return (
        <Layout>
           <div className="col-md-6 offset-md-3">
           <ToastContainer/>
            
            {activationLink()}
           </div>
        </Layout>
    )
}

export default Activate
