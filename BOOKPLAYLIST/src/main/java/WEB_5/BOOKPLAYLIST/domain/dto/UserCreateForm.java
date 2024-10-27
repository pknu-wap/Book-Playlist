package WEB_5.BOOKPLAYLIST.domain.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserCreateForm {

    @Size(min = 3, max = 25, message = "사용자 ID는 3자 이상 25자 이하여야 합니다.")
    @NotEmpty(message = "사용자 ID는 필수 항목입니다.")
    private String username;

    @NotEmpty(message = "이메일은 필수 항목입니다.")
    @Email(message = "올바른 이메일 형식을 입력하세요.")
    private String email;

    @NotEmpty(message = "비밀번호는 필수 항목입니다.")
    @Size(min = 8, message = "비밀번호는 최소 8자 이상이어야 합니다.")
    private String password1;

    @NotEmpty(message = "비밀번호 확인은 필수 항목입니다.")
    @Size(min = 8, message = "비밀번호 확인은 최소 8자 이상이어야 합니다.")
    private String password2;  // 비밀번호 확인 필드 추가
}
