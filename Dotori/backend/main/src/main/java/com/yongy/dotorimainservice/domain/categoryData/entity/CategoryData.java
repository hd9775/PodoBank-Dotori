package com.yongy.dotorimainservice.domain.categoryData.entity;


import com.yongy.dotorimainservice.domain.category.entity.Category;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@Entity(name = "category_data")
@NoArgsConstructor
public class CategoryData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_data_seq")
    private Long categoryDataSeq;

    @ManyToOne
    @JoinColumn(name = "categorySeq")
    private Category category;

    @Column(name = "data_code")
    private String dataCode;

    @Column(name = "data_name")
    private String dataName;

    @Column(name = "count")
    private int count;

    @Builder
    public CategoryData(Long categoryDataSeq, Category category, String dataCode, String dataName, int count) {
        this.categoryDataSeq = categoryDataSeq;
        this.category = category;
        this.dataCode = dataCode;
        this.dataName = dataName;
        this.count = count;
    }

    public CategoryData updateCount(){
        this.count = this.count+1;
        return this;
    }

}
