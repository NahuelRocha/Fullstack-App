package com.lambda.api.Service.impl;

import com.lambda.api.Dtos.CreateMenuItemDTO;
import com.lambda.api.Dtos.MenuItemDTO;
import com.lambda.api.Dtos.MenuItemUpdateDTO;
import com.lambda.api.Dtos.ModifyMenuItemImageDTO;
import com.lambda.api.Entities.Category;
import com.lambda.api.Entities.MenuItem;
import com.lambda.api.Exceptions.ImageException;
import com.lambda.api.Repositories.CategoryRepository;
import com.lambda.api.Repositories.MenuItemRepository;
import com.lambda.api.Service.MenuItemService;
import com.lambda.api.Utils.Mapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MenuItemServiceImpl implements MenuItemService {
    private final MenuItemRepository menuItemRepository;
    private final CategoryRepository categoryRepository;

    public MenuItemServiceImpl(MenuItemRepository menuItemRepository, CategoryRepository categoryRepository) {
        this.menuItemRepository = menuItemRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Transactional
    public MenuItemDTO createMenuItem(CreateMenuItemDTO request) {

        var category = categoryRepository.findById(request.newCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Category with ID " + request.newCategoryId() + "not found"));
        var newMenuItem = MenuItem.createMenuItem(request, category);
        menuItemRepository.save(newMenuItem);

        return Mapper.menuToMenuItemDto(newMenuItem);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuItemDTO> getMenuItems() {

        List<MenuItem> menuItems = menuItemRepository.findAllMenuItems();

        if (menuItems.isEmpty()){
            throw new EntityNotFoundException("There are no menu items in the database");
        }
        return menuItems.stream()
                .map(Mapper::menuToMenuItemDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MenuItemDTO updateMenuItem(MenuItemUpdateDTO request) {

        var menuItem = findMenuItem(request.id());

        Category category = null;
        if (request.updates().containsKey("category")){

            Integer categoryId = (Integer) request.updates().get("category");

            category = categoryRepository.findById(categoryId.longValue())
                    .orElseThrow(() -> new EntityNotFoundException("Category with ID: " + categoryId + "not found"));
        }

        menuItem.updateMenuItem(request, category);

        return Mapper.menuToMenuItemDto(menuItem);
    }

    @Override
    @Transactional
    public MenuItemDTO addMenuItemImage(ModifyMenuItemImageDTO request) {

        var menuItem = findMenuItem(request.id());

        if (!menuItem.canAddImage()){
            throw new IllegalArgumentException("You can not add more images");
        }

        menuItem.addImage(request.url());
        menuItemRepository.save(menuItem);

        return Mapper.menuToMenuItemDto(menuItem);
    }

    @Override
    @Transactional
    public MenuItemDTO removeMenuItemImage(ModifyMenuItemImageDTO request) {

        var menuItem = findMenuItem(request.id());

        if (!menuItem.getImageUrls().contains(request.url())) {
            throw new ImageException("The provided URL does not exist in the image list");
        }

        menuItem.removeImage(request.url());
        menuItemRepository.save(menuItem);

        return Mapper.menuToMenuItemDto(menuItem);
    }

    @Override
    @Transactional
    public String deleteMenuItem(Long menuItemId) {

        var deleted = menuItemRepository.deleteByIdIfExists(menuItemId);

        if (deleted == 0) {

            throw new EntityNotFoundException("Resource with ID " + menuItemId + " not found");
        }

        return "Success";
    }

    private MenuItem findMenuItem(Long id){

        return menuItemRepository.findById(id)
                .orElseThrow(()-> new EntityNotFoundException("Menu item with ID " + id + "not found"));
    }
}
