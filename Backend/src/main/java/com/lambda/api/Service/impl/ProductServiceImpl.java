package com.lambda.api.Service.impl;

import com.lambda.api.Dtos.CreateProductDTO;
import com.lambda.api.Dtos.ProductDTO;
import com.lambda.api.Dtos.ProductUpdateDTO;
import com.lambda.api.Entities.Product;
import com.lambda.api.Repositories.ProductRepository;
import com.lambda.api.Service.ProductService;
import com.lambda.api.Utils.Mapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    public ProductDTO createNewProduct(CreateProductDTO createProductDTO) {

        var newProduct = Product.createProduct(createProductDTO);
        productRepository.save(newProduct);

        return Mapper.productToDto(newProduct);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDTO getProduct(Long id) {

        var findProduct = findProduct(id);

        return Mapper.productToDto(findProduct);
    }

    @Override
    public Page<ProductDTO> getAvailableProducts(int page, int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productsPage = productRepository.findByAvailableTrue(pageable);

        return productsPage.map(Mapper::productToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductDTO> getAllProducts(int page, int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Product> productsPage = productRepository.findAll(pageable);

        return productsPage.map(Mapper::productToDto);
    }

    @Override
    @Transactional
    public ProductDTO updateProduct(Long id, ProductUpdateDTO productUpdateDTO) {

        var product = findProduct(id);

        product.updateProduct(productUpdateDTO);
        productRepository.save(product);

        return Mapper.productToDto(product);
    }

    @Override
    @Transactional
    public String deleteProduct(Long id) {

        if (!productRepository.existsById(id)) {
            throw new EntityNotFoundException("Product with ID " + id + " not found.");
        }
        productRepository.deleteById(id);

        return "Product with ID " + id + " successfully deleted.";
    }

    private Product findProduct(Long id){

        return productRepository.findById(id)
                .orElseThrow(()-> new EntityNotFoundException("Product with ID " + id + " not found"));
    }
}
