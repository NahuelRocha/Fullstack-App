package com.lambda.api.Repositories;

import com.lambda.api.Entities.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Long> {

    @Query("SELECT b FROM Banner b")
    Optional<Banner> findBanner();

    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN TRUE ELSE FALSE END " +
            "FROM Banner b JOIN b.imageUrls urls WHERE urls = :publicUrl")
    boolean existsByImageUrl(@Param("publicUrl") String publicUrl);
}
