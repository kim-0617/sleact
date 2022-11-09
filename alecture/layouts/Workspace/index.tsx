import React, { useCallback, useState } from "react";
import useSWR from 'swr';
import axios from 'axios';
import fetcher from '@utils/fetcher';
import gravatar from 'gravatar';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Channels, Chats, Header, LogOutButton, MenuScroll, ProfileImg, ProfileModal, RightMenu, WorkspaceName, Workspaces, WorkspaceWrapper } from './styles';
import loadable from '@loadable/component';
import Menu from '@components/Menu';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

interface ChildProp {
    children?: React.ReactNode; // 👈️ for demo purposes
}

const WorkSpace = (props: ChildProp) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
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

    const onClickUserProfile = useCallback(() => {
        setShowUserMenu((prev) => !prev);
    }, []);

    if (!data) {
        return <Navigate replace to="/login" />
    }

    return (
        <>
            <Header>
                <RightMenu>
                    <span onClick={onClickUserProfile}>
                        {data && <ProfileImg src={gravatar.url(data.email, { s: "28px", d: "retro" })} alt={data.email} />}
                        {showUserMenu &&
                            (<Menu
                                style={{ right: '0px', top: '38px' }}
                                show={showUserMenu}
                                onCloseModal={onClickUserProfile}>
                                <ProfileModal>
                                    <img src={gravatar.url(data.email, { s: "36px", d: "retro" })} alt={data.email} />
                                    <div>
                                        <span id="profile-name">{data.nickname}</span>
                                        <span id="profile-active">Active</span>
                                    </div>
                                </ProfileModal>
                                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
                            </Menu>)}
                    </span>
                </RightMenu>
            </Header>
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