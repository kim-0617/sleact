// import Chat from '@components/Chat';
// import { Scrollbars } from 'react-custom-scrollbars';
import { ChatZone, Section, StickyHeader } from '@components/ChatList/styles';
import { IDM, IChat } from '@typings/db';
import React, { useCallback, forwardRef, RefObject, MutableRefObject } from 'react';

const ChatList = () => {
    return (
        <ChatZone>
            <Section>section</Section>
        </ChatZone>
    );
};

export default ChatList;