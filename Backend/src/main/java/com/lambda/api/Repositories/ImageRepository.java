package com.lambda.api.Repositories;

import com.lambda.api.Entities.Image;
import jakarta.persistence.QueryHint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImageRepository extends JpaRepository<Image,Long> {

    @Query(value = "SELECT * FROM images WHERE hash = :hash", nativeQuery = true)
    Optional<Image> findByHash(@Param("hash") String hash);

    @Query(value = "SELECT EXISTS(SELECT 1 FROM images WHERE public_url = :url)", nativeQuery = true)
    boolean existsByPublicUrl(@Param("url") String url);
}
