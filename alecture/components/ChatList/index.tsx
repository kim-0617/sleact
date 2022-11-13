import Chat from '@components/Chat';
import { ChatZone, Section, StickyHeader } from '@components/ChatList/styles';
import { IDM, IChat } from '@typings/db';
import React, { useCallback, forwardRef, RefObject, MutableRefObject } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

interface Props {
    chatSections: { [key: string]: (IDM | IChat)[] };
    setSize: (f: (size: number) => number) => Promise<(IDM | IChat)[][] | undefined>;
    isEmpty: boolean;
    isReachingEnd: boolean;
}
const ChatList = forwardRef<Scrollbars, Props>(({ chatSections, setSize, isEmpty, isReachingEnd }, ref: any) => {
    const onScroll = useCallback((values: any) => {
        if (values.scrollTop === 0 && isReachingEnd) {
            console.log("가장 위");
            setSize((prevSize) => prevSize + 1)
                .then(() => {
                    if (ref?.current) {
                        ref.current?.scrollTop(ref.current?.getScrollHeight() - values.scrollHeight);
                    }
                })
        }
    }, []);

    return (
        <ChatZone>
            <Scrollbars autoHide onScrollFrame={onScroll}>
                {Object.entries(chatSections).map(([date, chats]) => {
                    return (
                        <Section className={`section-${date}`} key={date}>
                            <StickyHeader>
                                <button>{date}</button>
                            </StickyHeader>
                            {chats.map((chat) => (
                                <Chat key={chat.id} data={chat} />
                            ))}
                        </Section>
                    );
                })}
            </Scrollbars>
        </ChatZone>
    );
});

export default ChatList;