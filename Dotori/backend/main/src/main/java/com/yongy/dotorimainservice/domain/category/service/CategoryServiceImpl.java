package com.yongy.dotorimainservice.domain.category.service;

import com.yongy.dotorimainservice.domain.category.dto.CategoryDetailDTO;
import com.yongy.dotorimainservice.domain.category.entity.Category;
import com.yongy.dotorimainservice.domain.category.repository.CategoryRepository;
import com.yongy.dotorimainservice.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class CategoryServiceImpl implements CategoryService{

    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryDetailDTO> findAllCategory(){
        // 카테고리 리스트 반환
        User loginUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        List<Category> categories = categoryRepository.findAllByUserSeq(loginUser.getUserSeq());
        List<CategoryDetailDTO> result = new ArrayList<>();
        for(Category c : categories){
            result.add(CategoryDetailDTO.builder()
                            .categorySeq(c.getCategorySeq())
                            .categoryTitle(c.getCategoryTitle())
                    .build());
        }

        return result;
    }
}
