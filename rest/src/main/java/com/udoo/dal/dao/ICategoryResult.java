package com.udoo.dal.dao;

import com.udoo.dal.entities.CategoryResult;

import java.util.List;

public interface ICategoryResult {

    List<CategoryResult> getAllOffer(String text);

    List<CategoryResult> getAllRequest(String text);
}
