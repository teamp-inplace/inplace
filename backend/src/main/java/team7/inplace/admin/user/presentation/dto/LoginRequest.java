package team7.inplace.admin.user.presentation.dto;

import team7.inplace.admin.user.application.command.RegisterCommand;

public record LoginRequest(
    String username,
    String password
) {
    public static RegisterCommand toRegisterCommand(LoginRequest loginRequest) {
        return new RegisterCommand(loginRequest.username, loginRequest.password);
    }
}
