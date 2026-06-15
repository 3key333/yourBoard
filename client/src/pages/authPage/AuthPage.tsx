import { useEffect, useState } from 'react'
import style from './authPage.module.scss'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'
import type { IUserEntity, RegistrationNewUser } from '../../types';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import { setUserInfo } from '../../redux/slices/authSlice';

interface UserReg{
    userName: string;
    password: string;
    passwordRepeat: string;
}


export const AuthPage = () => {

    const navigate = useNavigate()
    const location = useLocation()

    const dispatch = useDispatch<AppDispatch>()

    const token = localStorage.getItem('token')
    const userInfo = localStorage.getItem('userInfo')
    const JSONUserInfo = JSON.parse(userInfo)
    const isUserFullReg =  JSONUserInfo && 
    JSONUserInfo.id &&
    JSONUserInfo.id.trim() !== '' &&
    JSONUserInfo.name &&
    JSONUserInfo.name.trim() !== '' && 
    JSONUserInfo.room !== undefined

    useEffect(() => {
        if(isUserFullReg && token){
            navigate('/board')
        }
    }, [location.pathname])

    const [regForm, setRegForm] = useState<UserReg>({
        userName: '',
        password: '',
        passwordRepeat: ''
    })

    const [isRegistration, setIsRegistration] = useState<boolean>(true)

    const validate = regForm.userName.trim() !== '' &&
    regForm.password.trim() !== '' && 
    regForm.passwordRepeat.trim() !== '' &&
    regForm.password.trim() === regForm.passwordRepeat.trim()

    const validateLogin = regForm.userName.trim() !== '' &&
    regForm.password.trim() !== ''

    const handleChangeReg = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegForm((prev) => ({...prev, [e.target.name]:e.target.value}))
    }

    const handleClickToReg = async () => {
        if(validate){

            const data = await axios.post<RegistrationNewUser>(
                'http://localhost:3000/api/auth',
                {name: regForm.userName, password: regForm.password, passwordRepeat: regForm.passwordRepeat}
            )

            if(data.data){
                const payload = data.data
                localStorage.setItem('token', payload.token)
                dispatch(setUserInfo({id: payload.user.id, name: payload.user.name}))
            }

            console.log(data)

            navigate('/joinRoom')
        }
    }

    const handleClickToLogin = async () => {

        if(validateLogin){
            const data = await axios.post<{message: string, token: string, data: IUserEntity}>(
                `http://localhost:3000/api/auth/login`,
                {name: regForm.userName, password: regForm.password}
            )

            localStorage.setItem('token', data.data.token)
            dispatch(setUserInfo({id: data.data.data.id, name: data.data.data.user_name,}))

            navigate('/joinRoom')
        }
    }

    const handleClickChangeTypeLogin = () => {
        setIsRegistration(!isRegistration)
    }


    return(
        <section className={style.authPage}>
            <div className={style.authPageInner}>

                <div className={style.auth_card}>
                    <div className={style.authCard_inner}>

                        <div className={style.buttons} style={{display: !isRegistration?'none':''}}>
                            <h2>Регистрация</h2>
                            <div className={style.buttons_botText}>
                                <p>уже есть аккаунт? вы можете</p>
                                <button onClick={handleClickChangeTypeLogin}>войти</button>
                            </div>
                        </div>

                        <div className={style.registration} style={{display: !isRegistration?'none':''}}>

                            <hr />

                            <div className={style.username_reg}>
                                <p>введите имя пользователя</p>
                                <input name='userName' type="text" onChange={(e) => handleChangeReg(e)}/>
                            </div>

                            <div className={style.password_reg}>
                                <p>введите пароль</p>
                                <input name='password' type="password" onChange={(e) => handleChangeReg(e)}/>
                            </div>

                            <div className={style.passwordRepeat_reg}>
                                <p>повторите пароль</p>
                                <input name='passwordRepeat' type="password" onChange={(e) => handleChangeReg(e)}/>
                            </div>

                            <hr />

                            <div className={style.reg_button}>
                                <button disabled={!validate} onClick={handleClickToReg}>зарегистрироваться</button>
                            </div>

                        </div>

                        

                        <div className={style.buttons} style={{display: isRegistration?'none':''}}>
                            <h2>Вход</h2>
                            <div className={style.buttons_botText}>
                                <p>нету аккаута?</p>
                                <button onClick={handleClickChangeTypeLogin}>регистрация</button>
                            </div>
                        </div>

                        <div className={style.registration} style={{display: isRegistration?'none':''}}>

                            <hr />

                            <div className={style.username_reg}>
                                <p>введите имя пользователя</p>
                                <input name='userName' type="text" onChange={(e) => handleChangeReg(e)}/>
                            </div>

                            <div className={style.password_reg}>
                                <p>введите пароль</p>
                                <input name='password' type="password" onChange={(e) => handleChangeReg(e)}/>
                            </div>

                            <hr />

                            <div className={style.reg_button}>
                                <button disabled={!validateLogin} onClick={handleClickToLogin}>войти</button>
                            </div>

                        </div>

                    </div>
                </div>

            </div>
        </section>
    )
}