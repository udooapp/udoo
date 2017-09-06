package com.udoo.dal.repositories;

import com.udoo.dal.entities.category.Category;
import org.springframework.data.repository.Repository;

import java.util.List;


/**
 */
public interface ICategoryRepository extends Repository<Category, Integer> {

    List<Category> findAll();

    Category findByCid(int cid);

}
