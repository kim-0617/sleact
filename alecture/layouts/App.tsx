import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import loadable from '@loadable/component';

const LogIn  = loadable(() => import('@pages/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp'));
const Channel = loadable(() => import('@pages/Channel'));

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate replace to="/login" />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/workspace/channel" element={<Channel />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;