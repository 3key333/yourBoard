import { useState } from "react";


export const usePortal = () => {

    const [isOpen, setIsOpen] = useState<boolean>(false)

    const changePortal = () => {
        setIsOpen(!isOpen)
    }

    return { isOpen, changePortal }

}