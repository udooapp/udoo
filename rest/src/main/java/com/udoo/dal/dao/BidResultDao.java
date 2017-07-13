package com.udoo.dal.dao;

import com.udoo.dal.entities.BidResult;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


/**
 */
public class BidResultDao extends JdbcDaoSupport implements IBidResult {

    @Override
    public List<BidResult> getBids(long id) {
        String sql = "Select u.name as name, b.price as price, b.description as description, b.bid as id From Users u, Offer o, Bids b Where o.uid = " + id + " and o.oid = b.sid and b.accepted is null and b.type = 1 and b.uid = u.uid";
        String sql2 = "Select u.name as name, b.price as price, b.description as description, b.bid as id From Users u, Request r, Bids b Where r.uid = " + id + " and r.rid = b.sid and b.accepted is null and b.type = 0 and b.uid = u.uid";

        List<BidResult> list = mapping(getJdbcTemplate().queryForList(sql));
        list.addAll(mapping(getJdbcTemplate().queryForList(sql2)));
        return list;
    }

    private List<BidResult> mapping(List<Map<String, Object>> rows){
        List<BidResult> result = new ArrayList<>();
        for (Map row : rows) {
            BidResult bidResult = new BidResult();
            bidResult.setBid((Long)row.get("id"));
            String message = row.get("name") + " bid is: "  + row.get("price");
            String description = row.get("description").toString();
            if(description != null && !description.isEmpty()){
                message += " (" + description + ")";
            }
            message += ".";
            bidResult.setMessage(message);
            result.add(bidResult);
        }
        return result;
    }
}
