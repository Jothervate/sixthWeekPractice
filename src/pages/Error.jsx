import { Link,useNavigate } from "react-router-dom";
import {useEffect,useState} from 'react';

const Error=()=>{
    const navigate= useNavigate();
    const [timer,setTimer]= useState(5);

    useEffect(()=>{
        let time=0;
        const countTime= setInterval(()=>{
            
            setTimer((pre)=>pre-1);
            time+=1;
            if(time>=5){
                clearInterval(countTime);
            }
        },1000);

        const timer=setTimeout(()=>{
            navigate('/');
        },5000);

        return ()=>clearTimeout(timer);
    },[navigate]);

    return (
        <div className="text-center" style={{marginTop: '100px'}}>
            <h1 className="display-1">404</h1>
            <p className='lead'>你搜尋的頁面不存在!</p>
            <p className="text-muted">將在{timer}秒內跳轉回首頁!</p>
            <Link to='/' className='btn btn-primary'>
                立即回到首頁
            </Link>
        </div>
    )
}

export default Error;