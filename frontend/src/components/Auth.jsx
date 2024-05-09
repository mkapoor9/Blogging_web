import { Link, Navigate, useNavigate } from "react-router-dom"
import { Signin } from "../pages/Signin"
import { useState } from "react"
import axios from "axios"

export const Auth = ({type}) =>{
    const navigate = useNavigate();
    const [postInputs,setPostInputs] = useState({
        name: "",
        email:"",
        password: "",
    })

    async function sendRequest(){
        try {
            console.log("EENkrn")
            const response = await axios.post('http://localhost:8787/api/v1/user/signup',postInputs);
            const jwt = response.data;
            localStorage.setItem("token",jwt);
            navigate('/blog')
        } catch (error) {
            type==="signup"?alert("Error while signing up"):alert("error while signing in")
        }    
    }

    return (
        <div className="h-screen flex justify-center flex-col">
        <div className="flex justify-center">
            <div>
                <div className="px-10">
                    <div className="text-3xl font-extrabold">
                        {type === 'signup' ? 'Create an account': 'Login to your account'}
                    </div>
                    <div className="mt-2 text-center text-slate-500">
                        {type === 'signup' ? 'Already Have an account?': 'Don`t have an account ?   ' }     
                        <Link className="pl-2 underline" to={type==='signup'?'/signin':'/signup'}>
                            {type=='signup'?'Login' :'Create account'}
                        </Link>
                    </div>
                </div>
                <div className="pt-6">
                    {type==='signup'?<LabelledInput label="Name" placeholder="John Doe" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            name: e.target.value
                        })
                    }} />:null}
                    <LabelledInput label="Username" placeholder="johndoe@xyz.com" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            email: e.target.value
                        })
                    }} />
                    <LabelledInput label="Password" type={"password"} placeholder="123456" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            password: e.target.value
                        })
                    }} />
                    <button onClick={sendRequest} type="button" className="mt-8 w-full mt-4 text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium 
                    rounded-lg text-sm px-5 py-2.5 me-2 mb-2">{type === 'signup' ? 'Sign Up' : 'Sign In'}</button>
                </div>                
            </div>
        </div>
    </div>
                
        
    )
}

function LabelledInput({label,placeholder,onChange,type,value}){
    return (
    <div className="">
      <label className="block mb-1 mt-2 text-sm font-medium text-black font-semibold">{label}</label>
      <input onChange={onChange} type={type||"text"} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
      focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder={placeholder} required />
    </div>)
}