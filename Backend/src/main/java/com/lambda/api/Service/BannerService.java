package com.lambda.api.Service;

import com.lambda.api.Dtos.ModifyBannerDataDTO;
import com.lambda.api.Dtos.ModifyBannerImageDTO;
import com.lambda.api.Dtos.BannerDTO;

public interface BannerService {

    BannerDTO getBannerImages();

    BannerDTO updateBannerData(ModifyBannerDataDTO request);
    BannerDTO addBannerImage(ModifyBannerImageDTO url);
    BannerDTO removeBannerImage(ModifyBannerImageDTO url);

}
