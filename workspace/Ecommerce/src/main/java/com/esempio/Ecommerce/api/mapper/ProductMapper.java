package com.esempio.Ecommerce.api.mapper;

import com.esempio.Ecommerce.api.dto.request.ProductRequest;
import com.esempio.Ecommerce.api.dto.response.ProductResponse;
import com.esempio.Ecommerce.domain.entity.Inventory;
import com.esempio.Ecommerce.domain.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "description", source = "longDescription")
    @Mapping(target = "price", source = "price")
    @Mapping(target = "imageUrl", source = "imageUrl")
    @Mapping(target = "category", source = "category")
    @Mapping(target = "inStock", expression = "java(product.getInventory() != null && product.getInventory().getQuantity() > 0)")
    @Mapping(target = "availableQuantity", expression = "java(getAvailableQuantity(product))")
    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "updatedAt", source = "updatedAt")
    ProductResponse toDto(Product product);

    List<ProductResponse> toDtoList(List<Product> products);

    @Mapping(target = "imageUrl", source = "imageUrl")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "name", source = "name")
    @Mapping(target = "shortDescription", expression = "java(createShortDescription(productRequest))")
    @Mapping(target = "longDescription", source = "description")
    @Mapping(target = "price", source = "price")
    @Mapping(target = "category", source = "category")
    @Mapping(target = "inventory", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Product toEntity(ProductRequest productRequest);

    @Mapping(target = "imageUrl", source = "imageUrl")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "name", source = "name")
    @Mapping(target = "shortDescription", expression = "java(createShortDescription(productRequest))")
    @Mapping(target = "longDescription", source = "description")
    @Mapping(target = "price", source = "price")
    @Mapping(target = "category", source = "category")
    @Mapping(target = "inventory", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateProduct(ProductRequest productRequest, @MappingTarget Product product);

    default String createShortDescription(ProductRequest productRequest) {
        String desc = productRequest.description();
        if (desc == null || desc.length() <= 100) {
            return desc;
        }
        return desc.substring(0, 97) + "...";
    }

    default Integer getAvailableQuantity(Product product) {
        Inventory inventory = product.getInventory();
        return inventory != null ? inventory.getQuantity() : 0;
    }
}
