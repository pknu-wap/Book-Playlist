package user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class UserCreateForm {
	@Size(min = 3, max = 25)  //입력받는 데이터의 길이가 3~25사이여야한
	@NotEmpty(message = "사용자 ID는 필수 항목입니다.")
	private String email;
	
	@NotEmpty(message = "비밀번호는 필수 항목입니다.")
	private String password1;
	
	@NotEmpty(message = "비밀번호 확인은 필수 항목입니다.")
	private String password2;
	
	@NotEmpty(message = "닉네은 필수 항목입니다.")
	@Email
	private String username;
}
