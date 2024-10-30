// Login.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './styles/Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');

    const [emailValid, setEmailValid] = useState(false);
    const [pwValid, setPwValid] = useState(false);
    const [notAllow, setNotAllow] = useState(true);

    const navigate = useNavigate();

    const handleEmail = (e) => {
        setEmail(e.target.value);
        const regex = /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
        setEmailValid(regex.test(e.target.value));
    };

    const handlePassword = (e) => {
        setPw(e.target.value);
        const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
        setPwValid(regex.test(e.target.value));
    };

    const onClickConfirmButton = async () => {
        try {
            const response = await fetch('https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: pw
                }),
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    alert('로그인에 성공했습니다.');
                    navigate('/'); // 메인 페이지로 이동
                } else {
                    alert('로그인 정보가 올바르지 않습니다.');
                }
            } else {
                const errorData = await response.json();
                alert(errorData.message || '서버 응답에 문제가 발생했습니다. 다시 시도해 주세요.');
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            alert('로그인 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    useEffect(() => {
        setNotAllow(!(emailValid && pwValid));
    }, [emailValid, pwValid]);

    const goToRegister = () => {
        navigate('/register'); // 회원가입 페이지로 이동
    };

    return (
        <div className="page">
            <div className="leftSection"></div>
            <div className="rightSection">
                <div className="formContainer">
                    <div className="titleWrap">Welcome to BookPlayList! 😊📚</div>
                    <div className="contentWrap">
                        <div className="inputTitle">이메일</div>
                        <div className="inputWrap">
                            <input
                                type='text'
                                className="input"
                                placeholder="이메일을 입력하세요"
                                value={email}
                                onChange={handleEmail}
                            />
                        </div>
                        <div className="errorMessageWrap">
                            {!emailValid && email.length > 0 && (
                                <div>올바른 이메일을 입력해주세요.</div>
                            )}
                        </div>
                        <div className="inputTitle" style={{ marginTop: "26px" }}>비밀번호</div>
                        <div className="inputWrap">
                            <input
                                type='password'
                                className="input"
                                placeholder="비밀번호를 입력하세요"
                                value={pw}
                                onChange={handlePassword}
                            />
                        </div>
                        <div className="errorMessageWrap">
                            {!pwValid && pw.length > 0 && (
                                <div>영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.</div>
                            )}
                        </div>
                        <div style={{ marginTop: "20px", textAlign: "center" }}>
                            <span 
                                className="registerLink" 
                                onClick={goToRegister}
                            >
                                계정이 없으신가요? 회원가입
                            </span>
                        </div>
                        <div style={{ marginTop: "30px" }}>
                            <button onClick={onClickConfirmButton} disabled={notAllow} className="bottomButton">
                                로그인
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
