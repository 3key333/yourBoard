import { useState } from 'react';
import style from './header.module.scss';
import axios from 'axios';
import { useLocation, useNavigate, Link } from 'react-router-dom';


export const Header = () => {

    const navigate = useNavigate()
    const location = useLocation()

    const token = localStorage.getItem('token')

    if(!token){
        navigate('/')
    }

    const [userName, setUserName] = useState<string>('')

    const userInfoFromLocalStorage = localStorage.getItem('userInfo')

    const searchUser = async () => {
        const { data } = await axios.get(`http://localhost:3000/api/user/${JSON.parse(userInfoFromLocalStorage).id}`)
        setUserName(data.data[0].user_name)
    }

    if(userInfoFromLocalStorage){
        searchUser()
    }

    const logoutFromAccount = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
    }
    
    return(
        <header>
            <div className={style.headerInner}>
                <div className={style.accountInfo} style={{display: location.pathname==='/'?'none':'flex'}}>

                    <p>{userName}</p>

                    <div className={style.seperator}></div>
                    
                    <Link to={'/'} className={style.logout_button} onClick={logoutFromAccount}>выйти</Link>

                </div>
            </div>
        </header>
    )
}