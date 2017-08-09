package com.udoo.dal.dao;

import com.udoo.dal.entities.CategoryResult;
import com.udoo.dal.entities.search.SearchElement;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


/**
 */
public class CategoryResultDao extends JdbcDaoSupport implements ICategoryResult {

    @Override
    public List<SearchElement> getAllOffer(String text) {
        String sql = "SELECT distinct c.cid as cid, c.name as name FROM Offer o, Categories c WHERE c.cid = o.category AND (LOWER(o.description) LIKE CONCAT('%',LOWER('" + text + "'),'%') OR LOWER(o.title) LIKE CONCAT('%',LOWER('" + text + "'),'%')) AND o.expirydate > CURRENT_DATE AND o.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0)";
        return mapping(getJdbcTemplate().queryForList(sql));
    }

    @Override
    public List<SearchElement> getAllRequest(String text) {
        String sql = "SELECT distinct c.cid as cid, c.name as name FROM Request r, Categories c WHERE c.cid = r.category AND (LOWER(r.description) LIKE CONCAT('%',LOWER('" + text + "'),'%') OR LOWER(r.title) LIKE CONCAT('%',LOWER('" + text + "'),'%')) AND r.expirydate > CURRENT_DATE AND r.uid NOT IN (SELECT v.uid FROM Verification v Where v.type = 0)";
        return mapping(getJdbcTemplate().queryForList(sql));
    }

    private List<SearchElement> mapping(List<Map<String, Object>> rows){
        List<SearchElement> result = new ArrayList<>();
        for (Map row : rows) {
            SearchElement categoryResult = new SearchElement();
            categoryResult.setId((Integer)row.get("cid"));
            categoryResult.setCategoryName(row.get("name").toString());
            result.add(categoryResult);
        }
        return result;
    }


}
