import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Register.css';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [username, setUsername] = useState('');
    const [emailValid, setEmailValid] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const [usernameValid, setUsernameValid] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [notAllow, setNotAllow] = useState(true);
    const [isEmailChecked, setIsEmailChecked] = useState(false);
    const [isUsernameChecked, setIsUsernameChecked] = useState(false);

    const navigate = useNavigate();

    const handleEmail = (e) => {
        setEmail(e.target.value);
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailValid(regex.test(e.target.value));
        setIsEmailChecked(false);
    };

    const handlePassword1 = (e) => {
        setPassword1(e.target.value);
        const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[$@$!%*#?&]).{8,20}$/;
        setPasswordValid(regex.test(e.target.value));
        setPasswordMatch(e.target.value === password2);
    };

    const handlePassword2 = (e) => {
        setPassword2(e.target.value);
        setPasswordMatch(e.target.value === password1);
    };

    const handleUsername = (e) => {
        setUsername(e.target.value);
        setUsernameValid(e.target.value.length >= 2);
        setIsUsernameChecked(false);
    };

    const checkEmailAvailability = async () => {
        if (!emailValid) {
            alert("유효한 이메일을 입력하세요.");
            return;
        }
        setIsEmailChecked(true); // API 호출 생략
    };

    const checkUsernameAvailability = async () => {
        if (!usernameValid) {
            alert("닉네임은 최소 2자 이상이어야 합니다.");
            return;
        }
        setIsUsernameChecked(true); // API 호출 생략
    };

    const onClickRegisterButton = () => {
        if (!passwordMatch) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        if (!isEmailChecked || !isUsernameChecked) {
            alert('이메일 또는 닉네임 중복 확인을 해주세요.');
            return;
        }
        alert('회원가입 성공!');
        navigate('/login');
    };

    useEffect(() => {
        setNotAllow(!(emailValid && passwordValid && usernameValid && passwordMatch));
    }, [emailValid, passwordValid, usernameValid, passwordMatch]);

    return (
        <div className="page">
            <div className="leftSection">
                {/* 추가적인 설명 영역 */}
            </div>
            <div className="rightSection">
                <div className="registerForm">
                    <div className="titleWrap">회원가입</div>
                    <div className="inputWrap">
                        <input
                            type="text"
                            className="input"
                            placeholder="이메일을 입력하세요"
                            value={email}
                            onChange={handleEmail}
                        />
                        <button className="duplicateButton" onClick={checkEmailAvailability}>
                            중복 확인
                        </button>
                    </div>
                    <div className="errorMessageWrap">
                        {!emailValid && email && <div>유효한 이메일을 입력하세요.</div>}
                    </div>
                    <div className="inputWrap">
                        <input
                            type="password"
                            className="input"
                            placeholder="비밀번호를 입력하세요"
                            value={password1}
                            onChange={handlePassword1}
                        />
                    </div>
                    <div className="errorMessageWrap">
                        {!passwordValid && password1 && <div>8~20자, 영문/숫자/특수문자 포함</div>}
                    </div>
                    <div className="inputWrap">
                        <input
                            type="password"
                            className="input"
                            placeholder="비밀번호를 한번 더 입력하세요"
                            value={password2}
                            onChange={handlePassword2}
                        />
                    </div>
                    <div className="errorMessageWrap">
                        {!passwordMatch && password2 && <div>비밀번호가 일치하지 않습니다.</div>}
                    </div>
                    <div className="inputWrap">
                        <input
                            type="text"
                            className="input"
                            placeholder="닉네임을 입력하세요"
                            value={username}
                            onChange={handleUsername}
                        />
                        <button className="duplicateButton" onClick={checkUsernameAvailability}>
                            중복 확인
                        </button>
                    </div>
                    <button
                        className="bottomButton"
                        onClick={onClickRegisterButton}
                        disabled={notAllow}
                    >
                        회원가입
                    </button>
                </div>
            </div>
        </div>
    );
}
