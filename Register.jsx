import React, { useState, useEffect } from "react";
import './index.css';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState(''); // 닉네임 상태 추가

    const [emailValid, setEmailValid] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [nicknameValid, setNicknameValid] = useState(false); // 닉네임 유효성 상태 추가
    const [notAllow, setNotAllow] = useState(true);

    // 이메일 유효성 검사
    const handleEmail = (e) => {
        setEmail(e.target.value);
        const regex = 
            /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
        if (regex.test(e.target.value)) {
            setEmailValid(true);
        } else {
            setEmailValid(false);
        }
    }

    // 비밀번호 유효성 검사
    const handlePassword = (e) => {
        setPassword(e.target.value);
        const regex =
            /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-Z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
        if (regex.test(e.target.value)) {
            setPasswordValid(true);
        } else {
            setPasswordValid(false);
        }

        // 비밀번호 일치 여부 확인
        if (confirmPassword !== '' && e.target.value !== confirmPassword) {
            setPasswordMatch(false);
        } else {
            setPasswordMatch(true);
        }
    }

    // 비밀번호 확인 입력 처리
    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
        if (password !== e.target.value) {
            setPasswordMatch(false);
        } else {
            setPasswordMatch(true);
        }
    }

    // 닉네임 입력 처리
    const handleNickname = (e) => {
        setNickname(e.target.value);
        const regex = /^[a-zA-Z]{5,}$/;
        if (regex.test(e.target.value)) { 
            setNicknameValid(true);
        } else {
            setNicknameValid(false);
        }
    }

    // 회원가입 버튼 클릭 핸들러
    const onClickConfirmButton = () => {
        if (emailValid && passwordValid && passwordMatch && nicknameValid) {
            alert('회원가입에 성공했습니다.');
            // 서버로 API 요청을 보내는 부분을 추가할 수 있습니다.
        } else {
            alert('입력한 정보를 확인해 주세요.');
        }
    }

    // useEffect를 통한 버튼 비활성화 제어
    useEffect(() => {
        if (emailValid && passwordValid && passwordMatch && nicknameValid) {
            setNotAllow(false);
        } else {
            setNotAllow(true);
        }
    }, [emailValid, passwordValid, passwordMatch, nicknameValid]);

    // 회원가입 화면 렌더링
    return (
        <div className="page">
            <div className="titleWrap">
                회원가입
            </div>

            <div className="contentWrap">
                <div className="inputTitle">이메일 주소</div>
                <div className="inputWrap">
                    <input
                        type='text'
                        className="input"
                        placeholder="test@gmail.com"
                        value={email}
                        onChange={handleEmail} />
                </div>
                <div className="errorMessageWrap">
                    {!emailValid && email.length > 0 && (
                        <div>올바른 이메일을 입력해주세요.</div>
                    )}
                </div>

                <div style={{ marginTop: "26px" }} className="inputTitle">
                    비밀번호
                </div>
                <div className="inputWrap">
                    <input
                        type='password'
                        className="input"
                        placeholder="영문,숫자,특수문자 포함 8자 이상"
                        value={password}
                        onChange={handlePassword}
                    />
                </div>
                <div className="errorMessageWrap">
                    {!passwordValid && password.length > 0 && (
                        <div>영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.</div>
                    )}
                </div>

                <div style={{ marginTop: "26px" }} className="inputTitle">
                    비밀번호 확인
                </div>
                <div className="inputWrap">
                    <input
                        type='password'
                        className="input"
                        placeholder="비밀번호 재입력"
                        value={confirmPassword}
                        onChange={handleConfirmPassword}
                    />
                </div>
                <div className="errorMessageWrap">
                    {!passwordMatch && confirmPassword.length > 0 && (
                        <div>비밀번호가 일치하지 않습니다.</div>
                    )}
                </div>

                <div style={{ marginTop: "26px" }} className="inputTitle">
                    닉네임
                </div>
                <div className="inputWrap">
                    <input
                        type='text'
                        className="input"
                        placeholder="닉네임 입력"
                        value={nickname}
                        onChange={handleNickname}
                    />
                </div>
                <div className="errorMessageWrap">
                    {!nicknameValid && nickname.length > 0 && (
                        <div>닉네임은 영어로 5자 이상이어야 합니다.</div>
                    )}
                </div>
            </div>

            <div>
                <button onClick={onClickConfirmButton} disabled={notAllow} className="bottomButton">
                    회원가입
                </button>
            </div>
        </div>
    );
}
