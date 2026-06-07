import style from './footer.module.scss'


export const Footer = () => {
    return(
        <footer>
            <div className={style.footerInner}>
                <div className={style.leftText_header}>
                    <h2>your board</h2>
                    <p>-your tasks</p>
                </div>
                 <p>by D.Ilya 2026</p>
            </div>
        </footer>
    )
}