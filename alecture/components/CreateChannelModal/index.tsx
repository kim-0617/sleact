import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';

interface Props {
    show: boolean;
    onCloseModal: () => void;
    setShowCreateChannelModal: (flag: boolean) => void;
    children?: React.ReactNode;
}
const CreateChannelModal = (props: Props) => {
    const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
    const { workspace, channel } = useParams<{ workspace: string, channel: string }>();

    const { data: userData, error, mutate } = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher, { dedupingInterval: 2000, });
    const { data: channelData, mutate: mutateChannel } = useSWR<IChannel[]>(
        userData ? `http://localhost:3095/api/workspaces/${workspace}/channels` : null,
        fetcher,
    );

    const onCreateChannel = useCallback((e: any) => {
        e.preventDefault();
        axios.post(`http://localhost:3095/api/workspaces/${workspace}/channels`, {
            name: newChannel,

        },
            { withCredentials: true })
            .then((response) => {
                props.setShowCreateChannelModal(false);
                setNewChannel('');
                mutateChannel(response.data);
            })
            .catch((err) => {
                console.dir(err);
                toast.error(err.response?.data, { position: "bottom-center" })
            });
    }, [newChannel]);
    return (
        <Modal show={props.show} onCloseModal={props.onCloseModal}>
            <form onSubmit={onCreateChannel}>
                <Label id="channel-label">
                    <span>채널</span>
                    <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
                </Label>
                <Button type="submit">생성하기</Button>
            </form>
        </Modal>
    );
};

export default CreateChannelModal;