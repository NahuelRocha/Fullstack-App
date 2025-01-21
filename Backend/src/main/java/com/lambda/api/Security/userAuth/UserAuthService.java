package com.lambda.api.Security.userAuth;

import com.lambda.api.Dtos.CreateUserDTO;
import com.lambda.api.Dtos.UserDTO;
import com.lambda.api.Entities.User;
import com.lambda.api.Repositories.UserRepository;
import com.lambda.api.Security.jwt.JwtService;
import jakarta.persistence.EntityExistsException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserAuthService {

    private final UserRepository repository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    public UserAuthService(UserRepository repository, JwtService jwtService, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager) {
        this.repository = repository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }


    public UserDTO createUserAdmin(CreateUserDTO userRequest){

        if (repository.findByEmail(userRequest.email()).isPresent()){
            throw new EntityExistsException("Email not available.");
        }

        var newUserAdmin = User.createUser(userRequest.email(),
                passwordEncoder.encode(userRequest.password()));

        repository.save(newUserAdmin);

        return new UserDTO(newUserAdmin.getUserId(), newUserAdmin.getUsername());
    }

    public JwtTokenDto loginUserAuthentication (LoginUserAuthRequest credentials){

        User findUser = repository.findByEmail(credentials.username())
                .orElseThrow(() -> new UsernameNotFoundException("User not found."));

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        credentials.username(), credentials.password()
                )
        );

        String token = jwtService.generateToken(findUser);

        return new JwtTokenDto(token);
    }
}
