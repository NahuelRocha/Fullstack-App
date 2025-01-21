package com.lambda.api.Controller;

import com.lambda.api.Dtos.CreateMenuItemDTO;
import com.lambda.api.Dtos.MenuItemDTO;
import com.lambda.api.Dtos.MenuItemUpdateDTO;
import com.lambda.api.Dtos.ModifyMenuItemImageDTO;
import com.lambda.api.Service.MenuItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
public class MenuItemController {

    private final MenuItemService menuItemService;

    public MenuItemController(MenuItemService menuItemService) {
        this.menuItemService = menuItemService;
    }

    @PostMapping("/create")
    public ResponseEntity<MenuItemDTO> createMenuItem(@RequestBody CreateMenuItemDTO menuItemDTO){

        return ResponseEntity.ok(menuItemService.createMenuItem(menuItemDTO));
    }

    @PutMapping("/update")
    public ResponseEntity<MenuItemDTO> updateMenuItem(@RequestBody MenuItemUpdateDTO menuItemDTO){

        return ResponseEntity.ok(menuItemService.updateMenuItem(menuItemDTO));
    }

    @GetMapping("/all")
    public ResponseEntity<List<MenuItemDTO>> getMenuItems(){

        return ResponseEntity.ok(menuItemService.getMenuItems());
    }

    @PostMapping("/add/image")
    public ResponseEntity<MenuItemDTO> addImageToMenuItem(@RequestBody ModifyMenuItemImageDTO menuItemDTO){

        return ResponseEntity.ok(menuItemService.addMenuItemImage(menuItemDTO));
    }

    @DeleteMapping("/remove/image")
    public ResponseEntity<MenuItemDTO> removeImageToMenuItem(@RequestBody ModifyMenuItemImageDTO menuItemDTO){

        return ResponseEntity.ok(menuItemService.removeMenuItemImage(menuItemDTO));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteMenuItem(@PathVariable Long id){

        return ResponseEntity.ok(menuItemService.deleteMenuItem(id));
    }

}
