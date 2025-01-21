package com.lambda.api.Repositories;

import com.lambda.api.Entities.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {


    @Query("SELECT mi FROM MenuItem mi JOIN FETCH mi.category")
    List<MenuItem> findAllMenuItems();

    @Modifying
    @Query("DELETE FROM MenuItem mi WHERE mi.id = :id")
    int deleteByIdIfExists(@Param("id") Long id);

    @Query("SELECT CASE WHEN COUNT(mi) > 0 THEN TRUE ELSE FALSE END " +
            "FROM MenuItem mi " +
            "WHERE :publicUrl MEMBER OF mi.imageUrls")
    boolean existsByImageUrl(@Param("publicUrl") String publicUrl);

    @Query("SELECT CASE WHEN COUNT(mi) > 0 THEN TRUE ELSE FALSE END FROM MenuItem mi")
    boolean existsAnyMenuItem();
}
