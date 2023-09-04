import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";

import styles from "../ShopStyles/Login.module.css";
import Navbar from '../../components/Shop/Navbar';
import Footer from '../../components/Footer';
import { toast } from 'react-hot-toast';
// import { loginUser} from "../../globelContext/shopSlice";
import {loginShop} from '../../globelContext/clientSlice';
import { jsonParseShopDataString } from "../../../helpers/JSONparse";
import { useUserData } from '../../contexts/userContexts';

const ShopLogin = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch()
   const [data, setData] = useState({
     email: "",
     password: "",
   });

   const {setUserData:setUserDataContext} = useUserData();



   const shopLogin = async(e) => {
    e.preventDefault()
    const {email,password}=data;
    try {
      const {data}= await axios.post('/s/sLogin',{email,password});
    
      if(data.error){
       
        toast.error(data.error)
      } else if(data.waiting)
      {
        toast(
          "Please wait a few seconds while we are checking your details........",
          {
            icon: "🔃",
            style: {
              borderRadius: "10px",
              background: "#968989",
              color: "#FF0000",
            },
          }
        );
      }
      else{
       
         dispatch(loginShop(data));
         
        Navigate("/s/sBookings");
      }
    } catch (error) {
    
      console.log('Shop Login Error',error)
      toast.error('Something went wrong')

    }
   }

   const forgotPassword = async() => {
    
    let email = data.email
   
    try {
      const {data} = await axios.post("/s/chPassword",{email})

      if(data.error){
        toast.error(data.error)
      }else{
        setUserDataContext({email:data.email})
        Navigate('/s/sChOTP')
      }
      
    } catch (error) {
      console.log(error)
      toast.error('Something went wrong')
    }
   }
 
    const userDataString = useSelector((state) => state.user.shop);
  useEffect(() => {
  let shop = jsonParseShopDataString();
    //  console.log(userDataString)
    console.log(shop)
      if (shop) {
        Navigate("/s/sBookings");
      }
  }, [])
  
  return (
    <>
      <Navbar />
      <div className={styles.login}>
        <div className={styles.Login_Container}>
          <div className={styles.Login_sub}>
            <h1 className={styles.Login_text}>Shop Login</h1>
            <hr className={styles.divider} />
            <br />
            <form action="" onSubmit={shopLogin}>
              <div className={styles.form_group}>
                <label className={styles.label}>Email</label>
                <input
                  className={styles.input}
                  type="text"
                  value={data.email}
                  onChange={(e) => {
                    setData({ ...data, email: e.target.value });
                  }}
                />
                <label className={styles.label}>Password</label>
                <input
                  className={styles.input}
                  type="password"
                  value={data.password}
                  onChange={(e) => {
                    setData({ ...data, password: e.target.value });
                  }}
                />
                <p className={styles.forgot_p} onClick={forgotPassword} >Forgot Password</p>
                <hr className={styles.divider} />
                <br />
                <button type="submit" className={styles.LoginButton}>
                  Login
                </button>
                <br />

                <h6 style={{ color: "black" }}>don’t have any account ? </h6>
                <button
                  onClick={() => Navigate("/s/sRegister")}
                  className={styles.signUpbtn}
                >
                  Signup Now
                </button>
              </div>
            </form>
            <button className={styles.btn1} onClick={()=>Navigate("/s/sLogin")}>
              Beautician Login
            </button>
            <button className={styles.btn2} onClick={()=>Navigate('/login')}>Client Login</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ShopLogin;