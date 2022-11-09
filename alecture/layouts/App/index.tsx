import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import loadable from '@loadable/component';

const LogIn = loadable(() => import('@pages/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp'));
const Workspace = loadable(() => import('@layouts/Workspace'));

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/workspace/*" element={<Workspace />} />
        </Routes>
    );
}

export default App;