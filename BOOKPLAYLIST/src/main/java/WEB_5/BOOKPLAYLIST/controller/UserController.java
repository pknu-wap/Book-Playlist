package WEB_5.BOOKPLAYLIST.controller;

import WEB_5.BOOKPLAYLIST.domain.dto.UserCreateForm;
import WEB_5.BOOKPLAYLIST.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataIntegrityViolationException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@RestController // @Controller를 @RestController로 변경
@RequestMapping("/api/auth")
public class UserController {
    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@Valid @RequestBody UserCreateForm userCreateForm) {
        Map<String, Object> response = new HashMap<>();
        if (!userCreateForm.getPassword1().equals(userCreateForm.getPassword2())) {
            response.put("success", false);
            response.put("message", "2개의 비밀번호가 일치하지 않습니다.");
            return ResponseEntity.badRequest().body(response);
        }
        try {
            userService.create(userCreateForm.getUsername(), userCreateForm.getEmail(), userCreateForm.getPassword1());
            response.put("success", true);
            response.put("message", "회원가입 성공");
            return ResponseEntity.ok(response);
        } catch (DataIntegrityViolationException e) {
            response.put("success", false);
            response.put("message", "이미 등록된 사용자입니다.");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/checkUserId")
    public ResponseEntity<Map<String, Object>> checkUserid(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        System.out.println("Received email: " + email);
        Map<String, Object> response = new HashMap<>();
        boolean isDuplicate = userService.isEmailDuplicate(email);
        if (isDuplicate) {
            response.put("success", false);
            response.put("message", "이미 사용 중인 이메일입니다.");
            return ResponseEntity.ok(response);
        }
        response.put("success", true);
        response.put("message", "사용 가능한 이메일입니다.");
        return ResponseEntity.ok(response);
    }



    @PostMapping("/checkUsername")
    public ResponseEntity<Map<String, Object>> checkUsername(@RequestBody String username) {
        System.out.println("Received username: " + username); // 추가
        Map<String, Object> response = new HashMap<>();
        boolean isDuplicate = userService.isUsernameDuplicate(username);
        if (isDuplicate) {
            response.put("success", false);
            response.put("message", "이미 사용 중인 닉네임입니다.");
            return ResponseEntity.ok(response);
        }
        response.put("success", true);
        response.put("message", "사용 가능한 닉네임입니다.");
        return ResponseEntity.ok(response);
    }


    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginData, HttpSession session) {
        Map<String, Object> response = new HashMap<>();
        String username = loginData.get("username");
        String password = loginData.get("password");
        if (userService.authenticate(username, password)){
            session.setAttribute("user", username);
            response.put("success", true);
            response.put("message", "로그인 페이지");
            return ResponseEntity.ok(response);
        }else{
            response.put("success", false);
            response.put("message", "로그인 실패");
            return ResponseEntity.status(401).body(response);
        }

    }

    @GetMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpSession session){
        session.invalidate();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "로그아웃 성공");
        return ResponseEntity.ok(response);
    }

}