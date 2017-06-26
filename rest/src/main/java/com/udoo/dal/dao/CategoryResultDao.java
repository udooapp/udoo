package com.udoo.dal.dao;

import com.udoo.dal.entities.CategoryResult;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


/**
 */
public class CategoryResultDao extends JdbcDaoSupport implements ICategoryResult {

    @Override
    public List<CategoryResult> getAllOffer(String text) {
        String sql = "SELECT o.category as id, count(o.oid) as result FROM Offer o WHERE (LOWER(o.description) LIKE CONCAT('%',LOWER('" + text + "'),'%') OR LOWER(o.title) LIKE CONCAT('%',LOWER('" + text + "'),'%')) AND o.expirydate > CURRENT_DATE AND o.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0) GROUP BY o.category";
        return mapping(getJdbcTemplate().queryForList(sql));
    }

    @Override
    public List<CategoryResult> getAllRequest(String text) {
        String sql = "SELECT r.category as id, count(r.rid) as result FROM Request r WHERE (LOWER(r.description) LIKE CONCAT('%',LOWER('" + text + "'),'%') OR LOWER(r.title) LIKE CONCAT('%',LOWER('" + text + "'),'%')) AND r.expirydate > CURRENT_DATE AND r.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0) GROUP BY r.category";
        return mapping(getJdbcTemplate().queryForList(sql));
    }

    private List<CategoryResult> mapping(List<Map<String, Object>> rows){
        List<CategoryResult> result = new ArrayList<>();
        for (Map row : rows) {
            CategoryResult categoryResult = new CategoryResult();
            categoryResult.setId((Integer)row.get("id"));
            categoryResult.setResult((Long)row.get("result"));
            result.add(categoryResult);
        }
        return result;
    }


}
