import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // 페이지 이동을 위한 useNavigate 가져오기
import './index.css'; // 스타일 파일 경로 확인 필수

const User = {
    email: 'test@example.com',
    pw: 'test232@@@'
}

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
        if (regex.test(e.target.value)) {
            setEmailValid(true);
        } else {
            setEmailValid(false);
        }
    };

    // 비밀번호 입력 핸들러 (유효성 검사 포함)
    const handlePassword = (e) => {
        setPw(e.target.value);
        const regex =
          /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-Z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
        if (regex.test(e.target.value)) {
            setPwValid(true);
        } else {
            setPwValid(false);
        }
    };

    // 확인 버튼 클릭 핸들러
    const onClickConfirmButton = () => {
        if (email === User.email && pw === User.pw) {
            alert('로그인에 성공했습니다.');
        } else {
            alert('등록되지 않은 회원입니다.');
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
            <div className='titleWrap'>
                이메일과 비밀번호를 
                <br />
                입력해주세요
            </div>

            <div className="contentWrap">
                <div className="inputTitle">이메일 주소</div>
                <div className="inputWrap">
                    <input
                        type='text'
                        className="input"
                        placeholder="test@gmail.com"
                        value={email}
                        onChange={handleEmail}
                    />
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
                        value={pw}
                        onChange={handlePassword}
                    />
                </div>
                <div className="errorMessageWrap">
                    {!pwValid && pw.length > 0 && (
                        <div>영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.</div>
                    )}
                </div>

                {/* 회원가입 버튼과 링크 추가 부분 */}
                <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <div style={{ marginTop: "10px" }}>
                        <span 
                            className="registerLink" 
                            onClick={goToRegister} 
                            style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                        >
                            회원가입을 원하시면 여기를 클릭하세요.
                        </span>
                    </div>
                </div>

                <div style={{ marginTop: "20px" }}>
                    <button onClick={onClickConfirmButton} disabled={notAllow} className="bottomButton">
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
}
