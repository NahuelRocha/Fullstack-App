package com.lambda.api.Service.impl;

import com.lambda.api.Dtos.CategoryDTO;
import com.lambda.api.Dtos.CreateCategoryDTO;
import com.lambda.api.Entities.Category;
import com.lambda.api.Exceptions.EntityException;
import com.lambda.api.Repositories.CategoryRepository;
import com.lambda.api.Service.CategoryService;
import com.lambda.api.Utils.Mapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Transactional
    public CategoryDTO createCategory(CreateCategoryDTO request) {

        if (existsCategory(request.name())){
            throw new EntityException("The category already exists");
        }

        var newCategory = Category.create(request.name());
        categoryRepository.save(newCategory);

        return Mapper.categoryToDto(newCategory);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDTO> getCategories() {

        List<Category> categories = categoryRepository.findAllCategories();

        if (categories.isEmpty()){
            throw new EntityNotFoundException("There are no categories in the database");
        }

        return categories.stream()
                .map(Mapper::categoryToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {

        var deleted = categoryRepository.deleteByIdIfExists(id);

        if (deleted == 0) {

            throw new EntityNotFoundException("Resource with ID " + id + " not found");
        }
    }

    @Override
    public CategoryDTO updateCategory(Long id, String name) {

        if (existsCategory(name)){
            throw new EntityException("The category already exists");
        }

        var findCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category with id: " + id + " not founded."));

        findCategory.update(name);
        categoryRepository.save(findCategory);

        return Mapper.categoryToDto(findCategory);
    }

    private boolean existsCategory(String category){

        return categoryRepository.existsByName(category.toLowerCase());
    }


}
