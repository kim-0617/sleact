import React, { useCallback } from "react";
import useSWR from 'swr';
import axios from 'axios';
import fetcher from '@utils/fetcher';
import gravatar from 'gravatar';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Channels, Chats, Header, MenuScroll, ProfileImg, RightMenu, WorkspaceName, Workspaces, WorkspaceWrapper } from './styles';
import loadable from '@loadable/component';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

interface ChildProp {
    children?: React.ReactNode; // 👈️ for demo purposes
}

const WorkSpace = (props: ChildProp) => {
    console.log("workspace rendering")
    const { data, error, mutate }: any = useSWR('http://localhost:3095/api/users', fetcher);
    const onLogout = useCallback(() => {
        axios
            .post('http://localhost:3095/api/users/logout', null, {
                withCredentials: true,
            })
            .then(() => {
                mutate(false, false);
            });
    }, []);

    if (!data) {
        return <Navigate replace to="/login" />
    }
    return (
        <>
            <Header>
                <RightMenu>
                    <span>
                        {data && <ProfileImg src={gravatar.url(data.email, { s: "28px", d: "retro" })} alt="" />}
                    </span>
                </RightMenu>
            </Header>
            <button onClick={onLogout}>logout</button>
            <WorkspaceWrapper>
                <Workspaces>test</Workspaces>
                <Channels>
                    <WorkspaceName>Sleact</WorkspaceName>
                    <MenuScroll>
                        Menuscroll
                    </MenuScroll>
                </Channels>
                <Chats>
                    <Routes>
                        <Route path="/:channel" element={<Channel />} />
                        <Route path="/:dm" element={<DirectMessage />} />
                    </Routes>
                </Chats>
            </WorkspaceWrapper>
        </>
    );
}

export default WorkSpace;