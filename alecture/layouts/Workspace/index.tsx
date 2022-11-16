import React, { useCallback, useEffect, useState } from "react";
import useSWR from 'swr';
import axios from 'axios';
import fetcher from '@utils/fetcher';
import gravatar from 'gravatar';
import { Route, Routes, Navigate, Link, useParams } from "react-router-dom";
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
    WorkspaceModal,
    WorkspaceName,
    Workspaces,
    WorkspaceWrapper
} from './styles';
import { Button, Input, Label } from '@pages/SignUp/styles';
import loadable from '@loadable/component';
import Menu from '@components/Menu';
import useInput from "@hooks/useInput";
import Modal from "@components/Modal";
import { IChannel, IUser } from "@typings/db";
import { toast } from "react-toastify";
import CreateChannelModal from "@components/CreateChannelModal";
import InviteWorkspaceModal from "@components/InviteWorkspaceModal";
import InviteChannelModal from '@components/InviteChannelModal';
import ChannelList from "@components/ChannelList";
import DMList from "@components/DMList";
import useSocket from "@hooks/useSocket";

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

interface ChildProp {
    children?: React.ReactNode; // 👈️ for demo purposes
}

const WorkSpace = (props: ChildProp) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
    const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
    const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
    const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);
    const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
    const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
    const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

    const { workspace } = useParams<{ workspace: string }>();

    const { data: userData, error, mutate } = useSWR<IUser | false>('/api/users', fetcher, {
        dedupingInterval: 2000,
    });
    // 로그인 했을 때만 요청할 수 있도록 조건부 요청
    const { data: channelData } = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher);
    const { data: memberData } = useSWR<IUser[]>(userData ? `/api/workspaces/${workspace}/members` : null, fetcher);

    const [socket, disconnect] = useSocket(workspace);

    useEffect(() => {
        if (channelData && userData && socket) {
            socket.emit('login', { id: userData.id, channels: channelData.map(v => v.id) })
        }
    }, [channelData, userData, socket]);

    useEffect(() => {
        return () => {
            disconnect();
        }
    }, [workspace, disconnect]);

    const onLogout = useCallback(() => {
        axios
            .post('/api/users/logout', null, {
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
        setShowCreateChannelModal(false);
        setShowInviteWorkspaceModal(false);
        setShowInviteChannelModal(false);
    }, []);

    const toggleWorkspaceModal = useCallback(() => {
        setShowWorkspaceModal((prev) => !prev);
    }, []);

    const onClickAddChannel = useCallback(() => {
        setShowCreateChannelModal(true);
    }, []);

    const onClickInviteWorkspace = useCallback(() => {
        setShowInviteWorkspaceModal(true);
    }, []);

    const onCreateWorkspace = useCallback((e: any) => {
        e.preventDefault();
        if (!newWorkspace || !newWorkspace.trim()) return;
        if (!newUrl || !newUrl.trim()) return;
        axios
            .post('/api/workspaces', {
                workspace: newWorkspace,
                url: newUrl,
            }, {
                withCredentials: true,
            })
            .then((response) => {
                setShowCreateWorkspaceModal(false);
                setNewWorkspace('');
                setNewUrl('');
                mutate(false, false);
            }).catch(err => {
                console.log(err);
                toast.error(err.response?.data, {
                    position:
                        "bottom-center"
                });
            })
            .finally(() => {

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
                    {userData.Workspaces && userData?.Workspaces.map((ws: any) => {
                        return (
                            <Link key={ws.id} to={`/workspace/${ws.url}/channel/일반`}>
                                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
                            </Link>
                        );
                    })}
                    <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
                </Workspaces>
                <Channels>
                    <WorkspaceName onClick={toggleWorkspaceModal}>
                        Sleact
                    </WorkspaceName>

                    <MenuScroll>
                        <Menu show={showWorkspaceModal} onCloseModal={toggleWorkspaceModal} style={{ top: 95, left: 80 }}>
                            <WorkspaceModal>
                                <h2>Sleact</h2>
                                <button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button>
                                <button onClick={onClickAddChannel}>채널 만들기</button>
                                <button onClick={onLogout}>로그아웃</button>
                            </WorkspaceModal>
                        </Menu>

                        <ChannelList />
                        <DMList />
                    </MenuScroll>
                </Channels>
                <Chats>
                    <Routes>
                        <Route path="channel/:channel" element={<Channel />} />
                        <Route path="dm/:id" element={<DirectMessage />} />
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

            <CreateChannelModal
                show={showCreateChannelModal}
                onCloseModal={onCloseModal}
                setShowCreateChannelModal={setShowCreateChannelModal}
            />
            <InviteWorkspaceModal
                show={showInviteWorkspaceModal}
                onCloseModal={onCloseModal}
                setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}
            />
            <InviteChannelModal
                show={showInviteChannelModal}
                onCloseModal={onCloseModal}
                setShowInviteChannelModal={setShowInviteChannelModal}
            />
        </>
    );
}

export default WorkSpace;