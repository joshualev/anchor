import React from 'react'
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from 'aws-amplify';
import "@aws-amplify/ui-react/styles.css";

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "",
            userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || ""
        }
    }
})

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mt-5">
        <Authenticator>
        {({user}) => user ? (
            <div>{children}</div>
        ) : (
            <div>
                <h1>Please sign in below:</h1>
            </div>
        )}
        </Authenticator>
    </div>
    )
}

export default AuthProvider
