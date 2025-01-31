package com.lambda.api.Controller;

import com.lambda.api.Dtos.CreateProductDTO;
import com.lambda.api.Dtos.ProductDTO;
import com.lambda.api.Dtos.ProductUpdateDTO;
import com.lambda.api.Service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/product")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/create")
    public ResponseEntity<ProductDTO> createProduct(@RequestBody CreateProductDTO createProductDTO) {

        ProductDTO productDTO = productService.createNewProduct(createProductDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(productDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable Long id) {

        ProductDTO productDTO = productService.getProduct(id);
        return ResponseEntity.ok(productDTO);
    }

    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getAvailableProducts(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {

        Page<ProductDTO> productPage = productService.getAvailableProducts(page, size);
        return ResponseEntity.ok(productPage);
    }
    @GetMapping("/all")
    public ResponseEntity<Page<ProductDTO>> getAllProducts(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {

        Page<ProductDTO> productPage = productService.getAllProducts(page, size);
        return ResponseEntity.ok(productPage);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @RequestBody ProductUpdateDTO productUpdateDTO) {
        ProductDTO updatedProduct = productService.updateProduct(id, productUpdateDTO);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {

        return ResponseEntity.ok(productService.deleteProduct(id));
    }


}
