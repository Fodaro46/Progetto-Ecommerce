package com.esempio.Ecommerce.api.mapper;

import com.esempio.Ecommerce.api.dto.request.InventoryUpdateRequest;
import com.esempio.Ecommerce.api.dto.response.InventoryResponse;
import com.esempio.Ecommerce.domain.entity.Inventory;
import com.esempio.Ecommerce.domain.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface InventoryMapper {

    @Mapping(target = "id", source = "id")
    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "productName", source = "product.name")
    @Mapping(target = "quantity", source = "quantity")
    @Mapping(target = "updatedAt", source = "updatedAt")
    InventoryResponse toDto(Inventory inventory);

    List<InventoryResponse> toDtoList(List<Inventory> inventories);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "quantity", source = "quantity")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Inventory toEntity(InventoryUpdateRequest request);

    default Inventory createInventory(Product product, Integer quantity) {
        return Inventory.builder()
                .product(product)
                .version(0L)
                .quantity(quantity)
                .build();
    }
}