package com.lambda.api.Service;

import com.lambda.api.Dtos.BusinessInfoDTO;
import com.lambda.api.Dtos.BusinessInfoUpdateDTO;

public interface BusinessInfoService {

    BusinessInfoDTO getBusinessInfo();
    BusinessInfoDTO updateBusinessInfo(BusinessInfoUpdateDTO request);
}
