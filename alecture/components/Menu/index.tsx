import React, { CSSProperties } from "react";
import { CloseModalButton, CreateMenu } from "./styles";

interface ChildProp {
    show: boolean;
    onCloseModal: (e: any) => void;
    closeButton: boolean;
    style: CSSProperties;
    children?: React.ReactNode;
}

const Menu = (props: ChildProp) => {
    const stopPropagation = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    }

    return (
        <CreateMenu onClick={props.onCloseModal}>
            <div onClick={stopPropagation} style={props.style}>
                {props.closeButton && <CloseModalButton onClick={props.onCloseModal}>&times;</CloseModalButton>}
                {props.children}
            </div>
        </CreateMenu>
    );
};

Menu.defaultProps = {
    closeButton: true
}

export default Menu;