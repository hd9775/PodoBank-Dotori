package com.yongy.dotorimainservice.domain.categoryData.controller;


import com.yongy.dotorimainservice.domain.categoryData.dto.response.CategoryDataResDto;
import com.yongy.dotorimainservice.domain.categoryData.service.CategoryDataService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/categoryData")
public class CategoryDataController {

    @Autowired
    private CategoryDataService categoryDataService;

    // NOTE : 카테고리 데이터 조회
    @Operation(summary = "카테고리 데이터 조회", description = "USER")
    @GetMapping()
    public ResponseEntity<List<CategoryDataResDto>> findCategoryData(@RequestParam Long categorySeq){
        return ResponseEntity.ok(categoryDataService.findCategoryData(categorySeq));
    }

    // NOTE : 카테고리 데이터 삭제
    @Operation(summary = "카테고리 데이터 삭제", description = "USER")
    @DeleteMapping()
    public ResponseEntity<Void> deleteCategoryData(@RequestBody String dataCode){
        categoryDataService.deleteByDataCode(dataCode);
        return ResponseEntity.ok().build();
    }

}
