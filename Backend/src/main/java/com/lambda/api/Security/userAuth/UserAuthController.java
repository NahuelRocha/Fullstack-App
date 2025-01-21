package com.lambda.api.Security.userAuth;

import com.lambda.api.Dtos.CreateUserDTO;
import com.lambda.api.Dtos.UserDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserAuthController {

    private final UserAuthService authService;

    public UserAuthController(UserAuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/create")
    public ResponseEntity<UserDTO> createUser (@RequestBody CreateUserDTO createUserRequest){

        return ResponseEntity.ok(authService.createUserAdmin(createUserRequest));
    }

    @PostMapping("/login")
    public ResponseEntity<JwtTokenDto> loginUser (@RequestBody LoginUserAuthRequest loginUserAuth){

        return ResponseEntity.ok(authService.loginUserAuthentication(loginUserAuth));
    }

}
