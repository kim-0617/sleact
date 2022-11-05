import React, { Dispatch, SetStateAction, useState, useCallback } from 'react';

const useInput = <T = any>(initailData: T): [T, (e: any) => void, Dispatch<SetStateAction<T>>] => {
    const [value, setValue] = useState(initailData);
    const handler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value as unknown as T);
    }, []);

    return [value, handler, setValue];
}

export default useInput;