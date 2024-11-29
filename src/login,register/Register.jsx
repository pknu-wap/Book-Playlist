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

        try {
            const response = await fetch('https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/auth/checkUserId', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (data.success) {
                alert(data.message);
                setIsEmailChecked(data.success);
            } else {
                alert(data.message);
                setIsEmailChecked(false);
            }
        } catch (error) {
            console.error("이메일 중복 확인 오류:", error);
            alert("이메일 중복 확인 중 문제가 발생했습니다.");
        }
    };

    const checkUsernameAvailability = async () => {
        if (!usernameValid) {
            alert("닉네임은 최소 2자 이상이어야 합니다.");
            return;
        }

        try {
            const response = await fetch('https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/auth/checkUsername', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(username),
            });

            const data = await response.json();
            if (data.success) {
                alert(data.message);
                setIsUsernameChecked(data.success);
            } else {
                alert(data.message);
                setIsUsernameChecked(false);
            }
        } catch (error) {
            console.error("닉네임 중복 확인 오류:", error);
            alert("닉네임 중복 확인 중 문제가 발생했습니다.");
        }
    };

    const onClickRegisterButton = async () => {
        if (!passwordMatch) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        if (!isEmailChecked || !isUsernameChecked) {
            alert('이메일 또는 닉네임 중복 확인을 해주세요.');
            return;
        }

        try {
            const response = await fetch('https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password1,
                    password2,
                    username,
                }),
            });

            const data = await response.json();
            if (data.success) {
                alert(data.message); 
                navigate('/login'); // 회원가입 성공 시 로그인 페이지로 이동
            } else {
                alert(data.message || '회원가입 중 문제가 발생했습니다.');
            }
        } catch (error) {
            console.error("회원가입 오류:", error);
            alert("회원가입 중 문제가 발생했습니다.");
        }
    };

    useEffect(() => {
        setNotAllow(!(emailValid && passwordValid && usernameValid && passwordMatch));
    }, [emailValid, passwordValid, usernameValid, passwordMatch]);

    // 폼 바깥 영역을 클릭했을 때 메인 페이지로 이동하도록 하는 함수
    const handlePageClick = () => {
        navigate('/'); // 메인 페이지로 이동
    };

    return (
        <div className="page" onClick={handlePageClick}>
            <div className="leftSection">
                {/* 추가적인 설명 영역 */}
            </div>
            <div className="rightSection" onClick={(e) => e.stopPropagation()}>
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
