package com.udoo.dal.dao;

import com.udoo.dal.entities.search.SearchElement;
import java.util.List;

public interface ICategoryResult {

    List<SearchElement> getAllOffer(String text);

    List<SearchElement> getAllRequest(String text);
}
