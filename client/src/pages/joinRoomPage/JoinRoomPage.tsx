import { useEffect, useState } from 'react'
import style from './joinRoomPage.module.scss'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../redux/store'
import { setUserRoom } from '../../redux/slices/authSlice'



export const JoinRoomPage = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()

    const [roomName, setRoomName] = useState<string>('')

    const handlerChangeRoomName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRoomName(e.target.value)
    }

    const handlerClickToConnectRoom = () => {
        if(roomName && roomName.trim() !== ''){
            dispatch(setUserRoom(roomName))
            navigate('/board')
        }
    }


    return(
        <section className={style.joinRoom}>
            <div className={style.joinRoomInner}>
                
                <div className={style.joinRoom_card}>

                    <div className={style.title}>
                        <h2>Введите название сервера</h2>
                        <p>если такого имени не будет найдено то вы создадите новый сервер</p>
                    </div>

                    <div className={style.info}>
                        <input type="text" onChange={handlerChangeRoomName}/>
                        <button onClick={handlerClickToConnectRoom}>подключиться</button>
                    </div>

                </div>

            </div>
        </section>
    )
}