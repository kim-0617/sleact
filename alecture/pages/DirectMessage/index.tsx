import React, { useCallback } from "react";
import gravatar from 'gravatar'
import { Container, Header } from "./styles";
import useSWR from "swr";
import { IChannel, IDM, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import { Navigate, useParams } from "react-router-dom";
import ChatBox from "@components/ChatBox";
import ChatList from "@components/ChatList";
import useInput from "@hooks/useInput";
import axios from "axios";

const DirectMessage = () => {
    const { workspace, id } = useParams<{ workspace: string, id: string }>();
    const { data: userData, mutate: userMutate } = useSWR<IUser | false>(`/api/workspaces/${workspace}/users/${id}`, fetcher, { dedupingInterval: 2000 });
    const { data: myData, mutate: myMutate } = useSWR<IUser | false>(`/api/users`, fetcher, { dedupingInterval: 2000 });
    const { data: chatData, mutate: mutateChat } = useSWR<IDM[]>(
        `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
        fetcher,
    );

    const [chat, onChangeChat, setChat] = useInput('');

    const onSubmitForm = useCallback((e: any) => {
        e.preventDefault();
        axios
            .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
                content: chat,
            })
            .then((response) => {
                mutateChat(response.data, false);
                setChat('');
            })
            .catch((err) => {
                console.dir(err)
            });
    }, []);

    if (!userData || !myData) {
        return <div>로딩중 ...</div>
    }

    return (
        <Container>
            <Header>
                <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
                <span>{userData.nickname}</span>
            </Header>
            <ChatList />
            <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
        </Container>
    );
}

export default DirectMessage;