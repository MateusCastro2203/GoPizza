import React, {
    createContext,
    useContext,
    useState,
    ReactNode
} from "react";
import auth from '@react-native-firebase/auth'
import { Alert } from "react-native";


type AuthContextData = {
    singIn: (email: string, password: string) => Promise<void> // Promise<void> = não retorna nenhum conteudo
    isLogging: boolean;


}

type AuthProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext({} as  AuthContextData);

function AuthProvider({ children }: AuthProviderProps){
    const [ isLogging, setIsLogging] = useState(false)

    async function singIn(email: string, password: string){
        if(!email || !password){
            return Alert.alert('Login', 'Informe o e-mail e a senha');
        }
        setIsLogging(true);

        auth().signInWithEmailAndPassword(email, password)
        .then(account => {
            console.log(account);            
        })
        .catch(error => {
            const { code } = error;

            if(code === 'auth/user-not-found' || code === 'auth/wrong-password'){
                return Alert.alert('Login','E-mail e/ou senha inválida.')
            }else{
                return Alert.alert('Login','Não foi possível realizar o login')
            }
        })
        .finally(() => setIsLogging(false))
    }

    return(
        <AuthContext.Provider value={{
            singIn,
            isLogging
        }}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth() {
    const context = useContext(AuthContext);

    return context
}

export { AuthProvider, useAuth}