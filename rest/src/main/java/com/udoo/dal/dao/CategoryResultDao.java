package com.udoo.dal.dao;

import com.udoo.dal.entities.CategoryResult;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


/**
 */
public class CategoryResultDao extends JdbcDaoSupport implements ICategoryResult {

//    List<Category> findAll();
//    @Query("SELECT r.category as id, count(r.rid) as result FROM Request r WHERE (LOWER(r.description) LIKE CONCAT('%',LOWER(:searchText),'%') OR LOWER(r.title) LIKE CONCAT('%',LOWER(:searchText),'%')) AND r.expirydate > CURRENT_DATE AND r.uid NOT IN (SELECT v.uid FROM Verification v) GROUP BY r.category")
//    List<CategoryResult> countAllRequestByTitleContainingOrDescriptionContaining(@Param("searchText") String searchText);
//
//    @Query("SELECT r.category as id, count(r.rid) as result FROM Offer r WHERE (LOWER(r.description) LIKE CONCAT('%',LOWER(:searchText),'%') OR LOWER(r.title) LIKE CONCAT('%',LOWER(:searchText),'%')) AND r.expirydate > CURRENT_DATE AND r.uid NOT IN (SELECT v.uid FROM Verification v) GROUP BY r.category")
//    List<CategoryResult> countAllOfferByTitleContainingOrDescriptionContaining(@Param("searchText") String searchText);


    @Override
    public List<CategoryResult> getAllOffer(String text) {
        String sql = "SELECT o.category as id, count(o.oid) as result FROM Offer o WHERE (LOWER(o.description) LIKE CONCAT('%',LOWER('" + text + "'),'%') OR LOWER(o.title) LIKE CONCAT('%',LOWER('" + text + "'),'%')) AND o.expirydate > CURRENT_DATE AND o.uid NOT IN (SELECT v.uid FROM Verification v) GROUP BY o.category";
        return mapping(getJdbcTemplate().queryForList(sql));
    }

    @Override
    public List<CategoryResult> getAllRequest(String text) {
        String sql = "SELECT r.category as id, count(r.rid) as result FROM Request r WHERE (LOWER(r.description) LIKE CONCAT('%',LOWER('" + text + "'),'%') OR LOWER(r.title) LIKE CONCAT('%',LOWER('" + text + "'),'%')) AND r.expirydate > CURRENT_DATE AND r.uid NOT IN (SELECT v.uid FROM Verification v) GROUP BY r.category";
        return mapping(getJdbcTemplate().queryForList(sql));
    }

    private List<CategoryResult> mapping(List<Map<String, Object>> rows){
        List<CategoryResult> result = new ArrayList<>();
        for (Map row : rows) {
            CategoryResult categoryResult = new CategoryResult();
            categoryResult.setId((Integer)row.get("id"));
            categoryResult.setResult((Long)row.get("result"));
            System.out.println(categoryResult.toString() + " " + row.get("id") + " " + row.get("result"));
            result.add(categoryResult);
        }
        return result;
    }


}
