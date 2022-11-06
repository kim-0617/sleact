import React, { useCallback } from "react";
import useSWR from 'swr';
import axios from 'axios';
import fetcher from '@utils/fetcher';
import { Navigate } from "react-router-dom";

interface PersonProps {
    children?: React.ReactNode; // 👈️ for demo purposes
}

const WorkSpace = (props: PersonProps) => {
    console.log("workspace rendering")
    const { data, error, mutate } = useSWR('http://localhost:3095/api/users', fetcher);
    const onLogout = useCallback(() => {
        axios
            .post('http://localhost:3095/api/users/logout', null, {
                withCredentials: true,
            })
            .then(() => {
                mutate(false, false);
            });
    }, []);
    console.log("data : ", data)

    if (!data) {
        return <Navigate replace to="/login" />
    }
    return (
        <>
            <button onClick={onLogout}>logout</button>
            {props.children}
        </>
    );
}

export default WorkSpace;