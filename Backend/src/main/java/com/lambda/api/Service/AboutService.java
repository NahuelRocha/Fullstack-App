package com.lambda.api.Service;

import com.lambda.api.Dtos.AboutDTO;
import com.lambda.api.Dtos.AboutRequestDTO;

public interface AboutService {

    AboutDTO getAbout();
    AboutDTO updateAbout(AboutRequestDTO aboutText);
}
