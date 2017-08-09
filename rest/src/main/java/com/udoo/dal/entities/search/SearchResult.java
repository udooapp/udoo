package com.udoo.dal.entities.search;

import java.util.List;

public class SearchResult {
    private String searchOffer;
    private List<SearchElement> categoryOffer;

    public String getSearchOffer() {
        return searchOffer;
    }

    public void setSearchOffer(String searchOffer) {
        this.searchOffer = searchOffer;
    }

    public List<SearchElement> getCategoryOffer() {
        return categoryOffer;
    }

    public void setCategoryOffer(List<SearchElement> categoryOffer) {
        this.categoryOffer = categoryOffer;
    }
}
