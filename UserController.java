package user;

import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.dao.DataIntegrityViolationException;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Controller
@RequestMapping("/api/auth")

public class UserController {
	private final UserService userService;
	
	@GetMapping("/signup")
	public String signup(UserCreateForm userCreateForm) {
		return "signup_form";
	}
	
	@PostMapping("/signup")
	public String signup(@Valid UserCreateForm userCreateForm, BindingResult bindingResult) {
		if(bindingResult.hasErrors()) {
			return "signup_form";
			
		}
		if(!userCreateForm.getPassword1().equals(userCreateForm.getPassword2()))
		{	bindingResult.rejectValue("password2", "passwordInCorrect","2개의 비밀번호가 일치하지 않습니다.");
			return "signup_form";
		}
		try {
			userService.create(userCreateForm.getUsername(),userCreateForm.getEmail(), userCreateForm.getPassword1());
		}catch(DataIntegrityViolationException e) {
			e.printStackTrace();
			bindingResult.reject("signupFailed", "이미 등록된 사용자입니다.");
			return "signup_form";
		}catch(Exception e) {
			e.printStackTrace();
			bindingResult.reject("signupFailed", e.getMessage());
			return "signup_form";
		}
			return "redirect:/";
	}
	@PostMapping("/checkUserid")
	public String checkUserid(String email, BindingResult bindingResult) {
	    boolean isDuplicate = userService.isEmailDuplicate(email);
	    if (isDuplicate) {
	        bindingResult.reject("u"
	        		+ "sernameDuplicate", "이미 사용 중인 아이디입니다.");
	        return "signup_form";  // 중복 시 폼으로 돌아감
	    }
	    return "사용 가능한 아이디입니다.";  // 중복되지 않을 시 메시지 반환
	}
	@GetMapping("/login")
	public String login() {
		return "login_form";
	}
	

}
