import { fetchApi } from '@/api';
import { useStorageState } from '@/hooks/useStorageState';
import * as SecureStore from "expo-secure-store";
import { createContext, use, type PropsWithChildren } from 'react';
// type formStateProp = {
//     phone: string,
//     passsword: string
// }
const AuthContext = createContext<{
    signIn: ({ }) => void;
    signOut: () => void;
    session?: string | null;
    isLoading: boolean;
}>({
    signIn: () => null,
    signOut: () => null,
    session: null,
    isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
    const value = use(AuthContext);
    if (!value) {
        throw new Error('useSession must be wrapped in a <SessionProvider />');
    }

    return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
    const [[isLoading, session], setSession] = useStorageState('session');

    return (
        <AuthContext
            value={{
                signIn: async (formState: any) => {

                    // Perform sign-in logic here
                    try {

                        const response = await fetchApi({ endpoint: "api/v1/login", data: formState });
                        console.log(234)
                        if (response) {
                            setSession('xxx');
                            await SecureStore.setItemAsync("token", response.token)
                            await SecureStore.setItemAsync("refreshToken", response.refreshToken)
                            await SecureStore.setItemAsync("randToken", response.randToken)
                        }
                    } catch (error) {

                        console.error(error)
                    }

                },
                signOut: async () => {
                    try {
                        await SecureStore.deleteItemAsync("token");
                        await SecureStore.deleteItemAsync("refreshToken");
                        await SecureStore.deleteItemAsync("randToken");
                        setSession(null);
                    } catch (error) {
                        console.error(error)
                    }

                },
                session,
                isLoading,
            }}>
            {children}
        </AuthContext>
    );
}
