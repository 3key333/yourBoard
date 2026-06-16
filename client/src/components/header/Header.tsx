import { useEffect, useState } from 'react';
import style from './header.module.scss';
import axios from 'axios';
import { useLocation, useNavigate, Link } from 'react-router-dom';


export const Header = () => {

    const navigate = useNavigate()
    const location = useLocation()

    useEffect(()=>{
        const token = localStorage.getItem('token')
        if(!token){
            navigate('/')
        }
    }, [navigate])

    const [userName, setUserName] = useState<string>('')

    useEffect(() => {

        const userInfoFromLocalStorage = localStorage.getItem('userInfo')

        const searchUser = async (userId: string) => {
            const { data } = await axios.get(`http://localhost:3000/api/user/${userId}`)
            setUserName(data.data[0].user_name)
        }

        if (userInfoFromLocalStorage) {
            const { id } = JSON.parse(userInfoFromLocalStorage) as { id: string }
            searchUser(id)
        }

    }, [location.pathname])

    const logoutFromAccount = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        navigate('/')
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