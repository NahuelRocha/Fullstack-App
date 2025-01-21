package com.lambda.api.Controller;

import com.lambda.api.Dtos.CategoryDTO;
import com.lambda.api.Dtos.CreateCategoryDTO;
import com.lambda.api.Service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/category")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping("/create")
    public ResponseEntity<CategoryDTO> createCategory(@RequestBody CreateCategoryDTO request) {

        return ResponseEntity.ok(categoryService.createCategory(request));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {

        categoryService.deleteCategory(id);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/all")
    public ResponseEntity<List<CategoryDTO>> getAllCategories(){

        return ResponseEntity.ok(categoryService.getCategories());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable Long id, @RequestParam String name) {

        return ResponseEntity.ok(categoryService.updateCategory(id, name));
    }

}
