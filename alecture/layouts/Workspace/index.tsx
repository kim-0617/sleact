import React, { useCallback, useState } from "react";
import useSWR from 'swr';
import axios from 'axios';
import fetcher from '@utils/fetcher';
import gravatar from 'gravatar';
import { Route, Routes, Navigate, Link } from "react-router-dom";
import {
    AddButton,
    Channels,
    Chats,
    Header,
    LogOutButton,
    MenuScroll,
    ProfileImg,
    ProfileModal,
    RightMenu,
    WorkspaceButton,
    WorkspaceName,
    Workspaces,
    WorkspaceWrapper
} from './styles';
import { Button, Input, Label } from '@pages/SignUp/styles';
import loadable from '@loadable/component';
import Menu from '@components/Menu';
import useInput from "@hooks/useInput";
import Modal from "@components/Modal";
import { IUser } from "@typings/db";
import { toast } from "react-toastify";

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

interface ChildProp {
    children?: React.ReactNode; // 👈️ for demo purposes
}

const WorkSpace = (props: ChildProp) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
    const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
    const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');
    const { data: userData, error, mutate } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher, { dedupingInterval: 2000, });
    const onLogout = useCallback(() => {
        axios
            .post('http://localhost:3095/api/users/logout', null, {
                withCredentials: true,
            })
            .then(() => {
                mutate(false, false);
            });
    }, []);

    const onClickUserProfile = useCallback((e: any) => {
        e.stopPropagation();
        setShowUserMenu((prev) => !prev);
    }, []);

    const onClickCreateWorkspace = useCallback(() => {
        setShowCreateWorkspaceModal(true);
    }, []);

    const onCloseModal = useCallback(() => {
        setShowCreateWorkspaceModal(false);
    }, []);

    const onCreateWorkspace = useCallback((e: any) => {
        e.preventDefault();
        if (!newWorkspace || !newWorkspace.trim()) return;
        if (!newUrl || !newUrl.trim()) return;

        axios
            .post('http://localhost:3095/api/workspaces', {
                workspace: newWorkspace,
                url: newUrl,
            }, {
                withCredentials: true,
            })
            .then((response) => {
                setShowCreateWorkspaceModal(false);
                setNewWorkspace('');
                setNewUrl('');
            }).catch(err => {
                console.log(err);
                toast.error(err.response?.data, {
                    position:
                        "bottom-center"
                });
            });
    }, [newWorkspace, newUrl]);

    if (!userData) {
        return <Navigate replace to="/login" />
    }
    return (
        <>
            <Header>
                <RightMenu>
                    <span onClick={onClickUserProfile}>
                        {userData && <ProfileImg src={gravatar.url(userData.email, { s: "28px", d: "retro" })} alt={userData.email} />}
                        {showUserMenu &&
                            (<Menu
                                style={{ right: '0px', top: '38px' }}
                                show={showUserMenu}
                                onCloseModal={onClickUserProfile}>
                                <ProfileModal>
                                    <img src={gravatar.url(userData.email, { s: "36px", d: "retro" })} alt={userData.email} />
                                    <div>
                                        <span id="profile-name">{userData.nickname}</span>
                                        <span id="profile-active">Active</span>
                                    </div>
                                </ProfileModal>
                                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
                            </Menu>)}
                    </span>
                </RightMenu>
            </Header>
            <WorkspaceWrapper>
                <Workspaces>
                    {userData?.Workspaces.map((ws: any) => {
                        return (
                            <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
                                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
                            </Link>
                        );
                    })}
                    <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
                </Workspaces>
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
            <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
                <form onSubmit={onCreateWorkspace}>
                    <Label id="workspace-label">
                        <span>워크스페이스 이름</span>
                        <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
                    </Label>
                    <Label id="workspace-url-label">
                        <span>워크스페이스 url</span>
                        <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
                    </Label>
                    <Button type="submit">생성하기</Button>
                </form>
            </Modal>
        </>
    );
}

export default WorkSpace;