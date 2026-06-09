import type { PropsWithChildren } from "react"
import { createPortal } from "react-dom"


export const Portal = ({ children }: PropsWithChildren) => {
    const modalRoot = document.getElementById('modal')

    if (!modalRoot) {
        return null
    }

    return createPortal(
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div style={{backgroundColor: 'white', padding: '10px 20px', borderRadius: 10, width: '600px', height: '400px'}}>
                {children}
            </div>
        </div>,
        modalRoot
    )

}