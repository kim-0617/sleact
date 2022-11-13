import React, { useCallback, useEffect, useRef } from "react";
import gravatar from 'gravatar'
import { Container, Header } from "./styles";
import { IChannel, IChat, IDM, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import { Navigate, useParams } from "react-router-dom";
import ChatBox from "@components/ChatBox";
import ChatList from "@components/ChatList";
import useInput from "@hooks/useInput";
import axios from "axios";
import makeSection from "@utils/makeSection";
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite'
import Scrollbars from 'react-custom-scrollbars';

const DirectMessage = () => {
    const { workspace, id } = useParams<{ workspace: string, id: string }>();
    const { data: userData, mutate: userMutate } = useSWR<IUser | false>(`/api/workspaces/${workspace}/users/${id}`, fetcher, { dedupingInterval: 2000 });
    const { data: myData, mutate: myMutate } = useSWR<IUser | false>(`/api/users`, fetcher, {
        dedupingInterval: 2000
    });

    const { data: chatData, mutate: mutateChat, setSize } = useSWRInfinite<IDM[]>(
        (index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${index + 1}`,
        fetcher
    );
    const isEmpty = chatData?.[0]?.length === 0;
    const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;

    const [chat, onChangeChat, setChat] = useInput('');
    const scrollbarRef = useRef<Scrollbars>(null);
    // const onSubmitForm = useCallback((e: any) => {
    //     e.preventDefault();
    //     axios
    //         .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
    //             content: chat,
    //         })
    //         .then((response) => {
    //             setChat('');
    //             mutateChat(response.data);
    //             scrollbarRef.current?.scrollToBottom();
    //         })
    //         .catch((err) => {
    //             console.dir(err)
    //         });
    // }, [chat]);

    const onSubmitForm = useCallback(
        (e: any) => {
            e.preventDefault();
            if (chat?.trim() && chatData && myData && userData) {
                const savedChat = chat;
                mutateChat((prevChatData) => {
                    prevChatData?.[0].unshift({
                        id: (chatData[0][0]?.id || 0) + 1,
                        content: savedChat,
                        SenderId: myData.id,
                        Sender: myData,
                        ReceiverId: userData.id,
                        Receiver: userData,
                        createdAt: new Date(),
                    });
                    return prevChatData;
                }, false).then(() => {
                    localStorage.setItem(`${workspace}-${id}`, new Date().getTime().toString());
                    setChat('');
                    if (scrollbarRef.current) {
                        console.log('scrollToBottom!', scrollbarRef.current?.getValues());
                        scrollbarRef.current.scrollToBottom();
                    }
                });
                axios
                    .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
                        content: chat,
                    })
                    .catch(console.error);
            }
        },
        [chat, workspace, id, myData, userData, chatData, mutateChat, setChat],
    );

    // 로딩 시 스크롤바 제일 아래로
    useEffect(() => {
        if (chatData?.length === 1) {
            setTimeout(() => {
                scrollbarRef.current?.scrollToBottom();
            }, 100);
        }
    }, [chatData]);

    if (!userData || !myData || !Array.isArray(chatData)) {
        return null;
    }
    const chatSections = makeSection(chatData ? ([] as IDM[]).concat(...chatData).reverse() : []);

    return (
        <Container>
            <Header>
                <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
                <span>{userData.nickname}</span>
            </Header>
            <ChatList chatSections={chatSections} setSize={setSize} scrollbarRef={scrollbarRef} isEmpty={isEmpty} isReachingEnd={isReachingEnd} />
            <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
        </Container>
    );
}

export default DirectMessage;