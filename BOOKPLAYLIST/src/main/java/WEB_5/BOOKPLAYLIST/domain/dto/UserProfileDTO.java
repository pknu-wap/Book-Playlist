package WEB_5.BOOKPLAYLIST.domain.dto;

public class UserProfileDTO {
    private String username;

    public UserProfileDTO(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
