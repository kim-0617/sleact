import ChatList from "@components/ChatList";
import { IDM } from "@typings/db";
import dayjs from 'dayjs';

export default function makeSection(ChatList: IDM[]) {
    const sections: {
        [key: string]: IDM[]
    } = {};
    ChatList.forEach((chat) => {
        const monthDate = dayjs(chat.createdAt).format('YYYY-MM-DD');
        if (Array.isArray(sections[monthDate])) {
            sections[monthDate].push(chat);
        }
        else {
            sections[monthDate] = [chat];
        }
    });

    return sections;
}

//