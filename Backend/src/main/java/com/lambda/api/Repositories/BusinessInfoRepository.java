package com.lambda.api.Repositories;

import com.lambda.api.Entities.BusinessInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BusinessInfoRepository extends JpaRepository<BusinessInfo,Long> {

    @Query("SELECT b FROM BusinessInfo b")
    Optional<BusinessInfo> findBusinessInfo();
}
