package com.esempio.Ecommerce.api.controller.role;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class RoleBasedController {

    @PreAuthorize("hasRole('admin')")
    @GetMapping("/admin/dashboard")
    public String adminDashboard() {
        return "Welcome, Admin!";
    }

    @PreAuthorize("hasRole('user')")
    @GetMapping("/user/dashboard")
    public String userDashboard() {
        return "Welcome, User!";
    }
}
