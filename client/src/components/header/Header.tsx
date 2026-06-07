import { useState } from 'react';
import style from './header.module.scss';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../redux/store';


export const Header = () => {
    
    const dispatch = useDispatch<AppDispatch>()

    const token = localStorage.getItem('token')

    const [userName, setUserName] = useState<string>('')

    const { user } = useSelector((state: RootState) => state.auth)

    const searchUser = async () => {
        const data = await axios.get('http://localhost:3000/api/user/:id')
    }
    
    return(
        <header>
            <div className={style.headerInner}>
                <div className={style.accountInfo} style={{display: token?'flex':'none'}}>

                    <p>name</p>

                    <div className={style.seperator}></div>
                    
                    <button className={style.logout_button}>выйти</button>

                </div>
            </div>
        </header>
    )
}