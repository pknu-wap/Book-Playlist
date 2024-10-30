import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 useNavigate 가져오기
import './styles/Register.css'; // 스타일 파일 경로 확인 필수

export default function Register() {
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState(''); // password1으로 변경
    const [password2, setPassword2] = useState(''); // password2로 추가
    const [username, setUsername] = useState('');

    const [emailValid, setEmailValid] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const [usernameValid, setUsernameValid] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [notAllow, setNotAllow] = useState(true);

    const [isEmailChecked, setIsEmailChecked] = useState(false); // 이메일 중복 확인 여부
    const [isUsernameChecked, setIsUsernameChecked] = useState(false); // 아이디 중복 확인 여부

    const navigate = useNavigate();

    // 이메일 입력 핸들러 (유효성 검사 포함)
    const handleEmail = (e) => {
        setEmail(e.target.value);
        const regex = /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
        setEmailValid(regex.test(e.target.value));
        setIsEmailChecked(false); // 이메일이 변경될 때마다 중복 확인 상태 초기화
    };

    // 비밀번호 입력 핸들러 (유효성 검사 포함)
    const handlePassword1 = (e) => {
        setPassword1(e.target.value);
        const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
        setPasswordValid(regex.test(e.target.value));
        setPasswordMatch(e.target.value === password2); // password1과 password2 일치 확인
    };

    // 비밀번호 재확인 입력 핸들러
    const handlePassword2 = (e) => {
        setPassword2(e.target.value);
        setPasswordMatch(e.target.value === password1); // password1과 password2 일치 확인
    };

    // 사용자 이름 입력 핸들러
    const handleUsername = (e) => {
        setUsername(e.target.value);
        setUsernameValid(e.target.value.length >= 2);
        setIsUsernameChecked(false); // 아이디가 변경될 때마다 중복 확인 상태 초기화
    };

    // 이메일 중복 확인 핸들러
    const checkEmailAvailability = async () => {
        if (!emailValid) {
            alert("유효한 이메일을 입력하세요.");
            return;
        }

        try {
            const response = await fetch('https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/auth/checkUserId', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    alert('사용 가능한 이메일입니다.');
                    setIsEmailChecked(true);
                } else {
                    alert('이미 사용 중인 이메일입니다.');
                    setIsEmailChecked(false);
                }
            } else {
                alert('서버 응답에 문제가 발생했습니다. 다시 시도해 주세요.');
            }
        } catch (error) {
            console.error('이메일 중복 확인 오류:', error);
            alert('이메일 중복 확인 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    // 닉네임 중복 확인 핸들러
    const checkUsernameAvailability = async () => {
        if (!usernameValid) {
            alert("닉네임은 최소 2자 이상이어야 합니다.");
            return;
        }

        try {
            const response = await fetch('https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/auth/checkUsername', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    alert('사용 가능한 닉네임입니다.');
                    setIsUsernameChecked(true);
                } else {
                    alert('이미 사용 중인 닉네임입니다.');
                    setIsUsernameChecked(false);
                }
            } else {
                alert('서버 응답에 문제가 발생했습니다. 다시 시도해 주세요.');
            }
        } catch (error) {
            console.error('닉네임 중복 확인 오류:', error);
            alert('닉네임 중복 확인 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    // 회원가입 버튼 클릭 핸들러 (회원가입 API 호출)
    const onClickRegisterButton = async () => {
        if (!passwordMatch) {
            alert('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
            return;
        }

        if (!isEmailChecked) {
            alert('이메일 중복 확인을 해주세요.');
            return;
        }

        if (!isUsernameChecked) {
            alert('닉네임 중복 확인을 해주세요.');
            return;
        }
        try {
            const response = await fetch('https://past-ame-jinmo5845-211ce4c8.koyeb.app/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password1: password1,  // password1으로 전송
                    password2: password2,  // password2으로 전송
                    username: username
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    alert('회원가입에 성공했습니다.');
                    navigate('/login'); // 회원가입 후 로그인 페이지로 이동
                } else {
                    alert('회원가입에 실패했습니다. 다시 시도해 주세요.');
                }
            } else {
                alert('서버 응답에 문제가 발생했습니다. 다시 시도해 주세요.');
            }
        } catch (error) {
            console.error('회원가입 오류:', error);
            alert('회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    // useEffect를 통한 버튼 활성화 제어
    useEffect(() => {
        if (emailValid && passwordValid && usernameValid && passwordMatch) {
            setNotAllow(false);
        } else {
            setNotAllow(true);
        }
    }, [emailValid, passwordValid, usernameValid, passwordMatch]);

    // 컴포넌트 렌더링
    return (
        <div className="page">
            {/* 왼쪽 회색 배경 영역 */}
            <div className="leftSection">
                {/* 이미지나 추가적인 설명을 배치할 수 있습니다 */}
            </div>

            {/* 오른쪽 회원가입 폼 영역 */}
            <div className="rightSection">
                <div className="registerForm">
                    <div className="titleWrap">
                        회원가입
                    </div>

                    <div className="contentWrap">
                        {/* 이메일 입력과 중복 확인 */}
                        <div className="inputTitle" style={{ marginTop: "26px" }}>이메일*</div>
                        <div className="inputWrap">
                            <input
                                type='text'
                                className="input"
                                placeholder="이메일을 입력하세요"
                                value={email}
                                onChange={handleEmail}
                            />
                            <button
                                onClick={checkEmailAvailability}
                                className="bottomButton"
                                style={{
                                    marginLeft: "10px",
                                    width: "30%", // 버튼 폭을 조절
                                    height: "40px", // 회원가입 버튼과 같은 높이로 조절
                                    fontSize: "0.7em"
                                }}>
                                중복 확인
                            </button>
                        </div>

                        <div className="errorMessageWrap">
                            {!emailValid && email.length > 0 && (
                                <div>올바른 이메일을 입력해주세요.</div>
                            )}
                        </div>

                        {/* 비밀번호 입력 */}
                        <div className="inputTitle" style={{ marginTop: "26px" }}>비밀번호*</div>
                        <div className="inputWrap">
                            <input
                                type='password'
                                className="input"
                                placeholder="비밀번호를 입력하세요"
                                value={password1}
                                onChange={handlePassword1}
                            />
                        </div>
                        <div className="errorMessageWrap">
                            {!passwordValid && password1.length > 0 && (
                                <div>영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.</div>
                            )}
                        </div>

                        {/* 비밀번호 확인 입력 */}
                        <div className="inputTitle" style={{ marginTop: "26px" }}>비밀번호 확인*</div>
                        <div className="inputWrap">
                            <input
                                type='password'
                                className="input"
                                placeholder="비밀번호를 한번 더 입력하세요"
                                value={password2}
                                onChange={handlePassword2}
                            />
                        </div>
                        <div className="errorMessageWrap">
                            {!passwordMatch && password2.length > 0 && (
                                <div>비밀번호가 일치하지 않습니다.</div>
                            )}
                        </div>

                        {/* 닉네임 입력과 중복 확인 */}
                        <div className="inputTitle" style={{ marginTop: "26px" }}>닉네임*</div>
                        <div className="inputWrap">
                            <input
                                type='text'
                                className="input"
                                placeholder="닉네임을 입력하세요"
                                value={username}
                                onChange={handleUsername}
                            />
                            <button
                                onClick={checkUsernameAvailability}
                                className="bottomButton"
                                style={{
                                    marginLeft: "10px",
                                    width: "30%", // 버튼 폭을 조절
                                    height: "40px", // 회원가입 버튼과 같은 높이로 조절
                                    fontSize: "0.7em"
                                }}>
                                중복 확인
                            </button>
                        </div>
                    </div>

                    {/* 회원가입 버튼 */}
                    <div style={{ marginTop: "20px" }}>
                        <button onClick={onClickRegisterButton} disabled={notAllow} className="bottomButton">
                            회원가입
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
