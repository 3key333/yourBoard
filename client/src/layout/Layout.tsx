import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Header } from "../components/header/Header"
import { Footer } from "../components/footer/Footer"
import { AuthPage } from "../pages/authPage/AuthPage"
import style from "./layout.module.scss"
import { Board } from "../pages/board/Board"
import { JoinRoomPage } from "../pages/joinRoomPage/JoinRoomPage"


export const Layout = () => {
    return(
        <BrowserRouter>
            <div className={style.layout}>
                <Header/>
                <main className={style.main}>
                    <Routes>
                        <Route path="/" element={<AuthPage />}/>
                        <Route path="/board" element={<Board />}/>
                        <Route path="/joinRoom" element={<JoinRoomPage/>}/>
                    </Routes>
                </main>
                <Footer/>
            </div>
        </BrowserRouter>
    )
}