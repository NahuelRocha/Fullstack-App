package com.lambda.api.Repositories;

import com.lambda.api.Entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category,Long> {
    boolean existsByName(String name);

    @Query(value = "SELECT * FROM categories", nativeQuery = true)
    List<Category> findAllCategories();

    @Modifying
    @Query("DELETE FROM Category c WHERE c.id = :id")
    int deleteByIdIfExists(@Param("id") Long id);

}
