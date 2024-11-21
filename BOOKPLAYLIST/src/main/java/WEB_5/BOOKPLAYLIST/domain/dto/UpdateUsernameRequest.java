package WEB_5.BOOKPLAYLIST.domain.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUsernameRequest {
    @NotBlank(message = "Username cannot be empty")
    private String newUsername;  // 변경할 새로운 닉네임
}
