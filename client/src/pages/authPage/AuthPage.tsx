import { useState } from 'react'
import style from './authPage.module.scss'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import type { RegistrationNewUser } from '../../types';

interface UserReg{
    userName: string;
    password: string;
    passwordRepeat: string;
}


export const AuthPage = () => {

    const navigate = useNavigate()

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
            }

            console.log(data)

            navigate('/board')

        }
    }




    return(
        <section className={style.authPage}>
            <div className={style.authPageInner}>

                <div className={style.auth_card}>
                    <div className={style.authCard_inner}>

                        <div className={style.buttons}>
                            <h2>Регистрация</h2>
                            <div className={style.buttons_botText}>
                                <p>уже есть аккаунт? вы можете</p>
                                <button>войти</button>
                            </div>
                        </div>

                        <div className={style.registration}>

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

                    </div>
                </div>

            </div>
        </section>
    )
}