import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // 페이지 이동을 위한 useNavigate 가져오기
import './index.css'; // 스타일 파일 경로 확인 필수

export default function Login() {
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');

    const [emailValid, setEmailValid] = useState(false);
    const [pwValid, setPwValid] = useState(false);
    const [notAllow, setNotAllow] = useState(true);

    const navigate = useNavigate(); // 페이지 이동을 위한 navigate 초기화

    // 이메일 입력 핸들러 (유효성 검사 포함)
    const handleEmail = (e) => {
        setEmail(e.target.value);
        const regex =
          /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
        setEmailValid(regex.test(e.target.value));
    };

    // 비밀번호 입력 핸들러 (유효성 검사 포함)
    const handlePassword = (e) => {
        setPw(e.target.value);
        const regex =
          /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
        setPwValid(regex.test(e.target.value));
    };

    // 로그인 버튼 클릭 핸들러
    const onClickConfirmButton = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: pw
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    alert('로그인에 성공했습니다.');
                    navigate('/dashboard'); // 대시보드 페이지로 이동
                } else {
                    alert('로그인 정보가 올바르지 않습니다.');
                }
            } else {
                alert('서버 응답에 문제가 발생했습니다. 다시 시도해 주세요.');
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            alert('로그인 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    // useEffect를 통한 버튼 활성화 제어
    useEffect(() => {
        if (emailValid && pwValid) {
            setNotAllow(false);
        } else {
            setNotAllow(true);
        }
    }, [emailValid, pwValid]);

    // 회원가입 페이지로 이동하기 위한 핸들러
    const goToRegister = () => {
        navigate('/register');  // '/register' 경로로 이동
    };

    // 컴포넌트 렌더링
    return (
        <div className="page">
            {/* 왼쪽 회색 배경 영역 */}
            <div className="leftSection">
                {/* 추가적인 이미지나 설명이 필요할 경우 여기에 배치 */}
            </div>

            {/* 오른쪽 로그인 폼 영역 */}
            <div className="rightSection">
                <div className="formContainer">
                    <div className="titleWrap">
                        Welcome to BookPlayList! 😊📚
                    </div>

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

                        {/* 회원가입 링크 */}
                        <div style={{ marginTop: "20px", textAlign: "center" }}>
                            <span 
                                className="registerLink" 
                                onClick={goToRegister}
                            >
                                계정이 없으신가요? 회원가입
                            </span>
                        </div>

                        {/* 로그인 버튼 */}
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
