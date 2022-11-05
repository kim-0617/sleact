import React from 'react';
import { Link } from 'react-router-dom';
import { Success, Form, Error, Label, Input, LinkContainer, Button, Header } from './styles';

const SignUp = () => {
    return (
        <div>
            <Header>Sleact</Header>
            <Form>
                <Label id="email-label">
                    <span>이메일 주소</span>
                    <div>
                        <Input type="email" id="email" name="email" />
                    </div>
                </Label>
                <Label id="nickname-label">
                    <span>닉네임</span>
                    <div>
                        <Input type="text" id="nickname" name="nickname" />
                    </div>
                </Label>
                <Label id="password-label">
                    <span>비밀번호</span>
                    <div>
                        <Input type="password" id="password" name="password" />
                    </div>
                </Label>
                <Label id="password-check-label">
                    <span>비밀번호 확인</span>
                    <div>
                        <Input
                            type="password"
                            id="password-check"
                            name="password-check"
                        />
                    </div>
                    {/* {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
                    {!nickname && <Error>닉네임을 입력해주세요.</Error>}
                    {signUpError && <Error>{signUpError}</Error>}
                    {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>} */}
                </Label>
                <Button type="submit">회원가입</Button>
            </Form>

            <LinkContainer>
                이미 회원이신가요?&nbsp;
                <Link to="/login">로그인 하러가기</Link>
            </LinkContainer>
        </div>
    );
}

export default SignUp;