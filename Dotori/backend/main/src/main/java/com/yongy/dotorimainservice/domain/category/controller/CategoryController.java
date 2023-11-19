package com.yongy.dotorimainservice.domain.category.controller;


import com.yongy.dotorimainservice.domain.category.dto.CategoryDetailDTO;
import com.yongy.dotorimainservice.domain.category.service.CategoryServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/category")
public class CategoryController {
    private final CategoryServiceImpl categoryService;

    @Operation(summary = "카테고리 리스트 조회")
    @ApiResponses(value={
            @ApiResponse(responseCode = "200", description = "카테고리 리스트 조회 성공")
    })
    @GetMapping()
    public ResponseEntity<List<CategoryDetailDTO>> findAllCategoryTitle(){
        return ResponseEntity.ok(categoryService.findAllCategory());
    }




}
