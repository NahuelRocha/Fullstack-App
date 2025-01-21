package com.lambda.api.Service;

import com.lambda.api.Dtos.CreateProductDTO;
import com.lambda.api.Dtos.ProductDTO;
import com.lambda.api.Dtos.ProductUpdateDTO;
import org.springframework.data.domain.Page;


public interface ProductService {

    ProductDTO createNewProduct(CreateProductDTO createProductDTO);

    ProductDTO getProduct(Long id);
    Page<ProductDTO> getAvailableProducts(int page, int size);

    Page<ProductDTO> getAllProducts(int page, int size);

    ProductDTO updateProduct(Long id, ProductUpdateDTO productUpdateDTO);

    String deleteProduct(Long id);
}
