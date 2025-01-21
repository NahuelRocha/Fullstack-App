package com.lambda.api.Service;

import com.lambda.api.Dtos.CreateMenuItemDTO;
import com.lambda.api.Dtos.MenuItemDTO;
import com.lambda.api.Dtos.MenuItemUpdateDTO;
import com.lambda.api.Dtos.ModifyMenuItemImageDTO;

import java.util.List;

public interface MenuItemService {

    MenuItemDTO createMenuItem(CreateMenuItemDTO request);
    MenuItemDTO updateMenuItem(MenuItemUpdateDTO request);
    List<MenuItemDTO> getMenuItems();
    MenuItemDTO addMenuItemImage(ModifyMenuItemImageDTO request);
    MenuItemDTO removeMenuItemImage(ModifyMenuItemImageDTO request);
    String deleteMenuItem(Long menuItemId);
}
