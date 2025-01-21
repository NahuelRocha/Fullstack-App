package com.lambda.api.Repositories;

import com.lambda.api.Entities.About;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AboutRepository extends JpaRepository<About,Long> {

    @Query("SELECT a FROM About a")
    Optional<About> findAbout();
}
