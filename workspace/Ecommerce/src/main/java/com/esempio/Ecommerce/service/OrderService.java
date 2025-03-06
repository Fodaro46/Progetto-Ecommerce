package com.esempio.Ecommerce.service;

import com.esempio.Ecommerce.model.Entity.LocalUser;
import com.esempio.Ecommerce.model.Entity.WebOrder;
import com.esempio.Ecommerce.model.repository.WebOrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {
    private WebOrderRepository webOrderRepository;
    public OrderService(WebOrderRepository webOrderRepository) {
        this.webOrderRepository = webOrderRepository;
    }
    public List<WebOrder> getAllOrders(LocalUser user) {
        return webOrderRepository.findByUser(user);

    }
            
}
