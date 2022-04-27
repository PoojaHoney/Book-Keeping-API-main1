import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
    FlexBox,
    FlexBoxAlignItems,
    FlexBoxDirection,
    FlexBoxJustifyContent,
    FlexBoxWrap,
    Form,
    FormItem,
    Button,
    Input
} from '@ui5/webcomponents-react';
import logo from './logo.svg';
import './Login.css';


interface loginDetails {
    userName: string;
    password: string;
}

const Login = () => {
    const [oLoginDetails, setLoginDetails] = useState<loginDetails>({
        userName: '',
        password: '',
    });
    const History = useHistory();

    const handleItems = (event: any) => {
        setLoginDetails((oLoginDetails) => ({
            ...oLoginDetails,
            [event.target.name]: event.target.value,
        }));
    };

    const handleLogin = () => {
        if (oLoginDetails.password !== "" && oLoginDetails.userName !== "") {
            History.replace('/books')
            window.location.reload()
        }
    };

    return (
        <div className="loginBoxStyle display divHeight">
            <div className="loginBox">
                <FlexBox
                    alignItems={FlexBoxAlignItems.Center}
                    direction={FlexBoxDirection.Column}
                    displayInline={false}
                    justifyContent={FlexBoxJustifyContent.Center}
                    wrap={FlexBoxWrap.NoWrap}>
                    <Form>
                        <FormItem>
                            <h3 style={{ color: '#ec4406' }}>Login</h3>
                        </FormItem>
                        <FormItem label="User Name">
                            <Input
                                className="inputMargin"
                                name="userName"
                                value={oLoginDetails.userName}
                                placeholder="Login user"
                                onChange={handleItems}
                            />
                        </FormItem>
                        <FormItem label="Password">
                            <Input
                                className="inputMargin"
                                name="password"
                                type="Password"
                                value={oLoginDetails.password}
                                placeholder="Password"
                                onChange={handleItems}
                            // onSubmit={handleLogin}
                            />
                        </FormItem>
                    </Form>
                </FlexBox>
                <Button
                    className="loginButtonWidth"
                    design="Emphasized"
                    submits={true}
                    onClick={handleLogin}>
                    Login
                </Button>
            </div>
        </div>
    );
}

export default Login;
