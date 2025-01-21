package com.lambda.api.Service;

import com.lambda.api.Dtos.CategoryDTO;
import com.lambda.api.Dtos.CreateCategoryDTO;

import java.util.List;

public interface CategoryService {
    CategoryDTO createCategory(CreateCategoryDTO request);
    List<CategoryDTO> getCategories();
    void deleteCategory(Long id);
    CategoryDTO updateCategory(Long id, String name);
}
