import React,{useState, useEffect} from 'react';
import {Input,Button,Card,Spin,Icon,message,Select} from 'antd';
import 'antd/dist/antd.css';
import '../static/login.css';
import axios from 'axios';
import servicePath from '../config/apiURL.js'

 function Login (props){
     const [userName,setUserName]=useState('');
     const [password,setPassword]=useState('');
     const [isLoading,setIsLoading]=useState(false);
     
     
     const checkLogin = ()=>{
        setIsLoading(true)
        if(!userName){
            message.error('用户名不能为空')
            setTimeout(setIsLoading(false),500)
            return(false)
        }else if(!password){
            message.error('密码不能为空')
            setTimeout(setIsLoading(false),500)
            return(false)}
        let dataProps={
            'userName':userName,
            'password':password
        }
        axios({
            method:'post',
            url:servicePath.checkLogin,
            data:dataProps,
            withCredentials:true
         }).then((res)=>{
             console.log(res.data)
             setIsLoading(false)
             if(res.data.data=='登录成功'){
                 localStorage.setItem('openId',res.data.openId)
                 props.history.push('/index')
             }else if(res.data.data=='登录失败'){
                 message.error('用户名或密码错误')
             }
         })
        }

    


     return(
        <div className="login-div">
            <Spin tip='Loading...' spinning={isLoading}>
            <Card title="Welcome to Lxj's blog" bordered={true} style={{width:400}}>
            
            <Input id='userName' size='large' placeholder='enter your username' prefix={<Icon type='user' className='prefix_icon'/>} onChange={(e)=>{setUserName(e.target.value)}} />
            <br/><br/>
            <Input.Password id='password' size='large' placeholder='enter your password' prefix={<Icon type='key' className='prefix_icon'/>} onChange={(e)=>{setPassword(e.target.value)}} />
            <br/><br/>
            <Button className='login-button' type='primary' size='large' block onClick={checkLogin}>login</Button>
            </Card>
            </Spin>

        </div>
     )
 }
 export default Login