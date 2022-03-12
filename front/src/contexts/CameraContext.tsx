import { createContext, ReactNode, useState } from 'react'
import { API_BASE_URL } from '../utils/constants'

interface CameraContextData{
    setBaseUrl: (api:string) => void,
    ipAdress: string
}

interface CameraProviderProps{
    children: ReactNode
}

export const CameraContext = createContext({} as CameraContextData);

export function CameraProvider({children}:CameraProviderProps) {
    const [ipAdress, setIpAdress] = useState(API_BASE_URL);

    const setBaseUrl = (ip:string) => {
        console.log('setBaseUrl Context')
        setIpAdress(ip);
    }

    return(
        <CameraContext.Provider value={{
            setBaseUrl,
            ipAdress
        }}>
            {children}
        </CameraContext.Provider>
    )
}