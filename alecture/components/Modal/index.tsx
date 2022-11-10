import { CloseModalButton } from '@components/Menu/styles';
import React, { useCallback } from 'react';
import { CreateModal } from './styles';

interface Props {
    show: boolean;
    onCloseModal: () => void;
    children?: React.ReactNode;
}

const Modal = (props: Props) => {
    const stopPropagation = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    }, []);

    if (!props.show) {
        return null;
    }

    return (
        <CreateModal onClick={props.onCloseModal}>
            <div onClick={stopPropagation}>
                <CloseModalButton onClick={props.onCloseModal}>&times;</CloseModalButton>
                {props.children}
            </div>
        </CreateModal>
    );
}

export default Modal;