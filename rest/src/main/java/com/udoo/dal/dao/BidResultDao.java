package com.udoo.dal.dao;

import com.udoo.dal.entities.BidResult;
import org.springframework.data.util.Pair;
import org.springframework.jdbc.core.support.JdbcDaoSupport;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


/**
 */
public class BidResultDao extends JdbcDaoSupport implements IBidResult {

    @Override
    public List<BidResult> getBids(long id) {
        String sql = "Select u.name as name, b.price as price, b.description as description, o.title as title From Users u, Offer o, Bids b Where o.uid = " + id + " and o.oid = b.sid and b.accepted = -1 and b.type = 1 and b.uid = u.uid";
        String sql2 = "Select u.name as name, b.price as price, b.description as description, r.title as title From Users u, Request r, Bids b Where r.uid = " + id + " and r.rid = b.sid and b.accepted = -1 and b.type = 0 and b.uid = u.uid";

        List<BidResult> list = mapping(getJdbcTemplate().queryForList(sql));
        list.addAll(mapping(getJdbcTemplate().queryForList(sql2)));
        return list;
    }

    private List<BidResult> mapping(List<Map<String, Object>> rows){
        List<BidResult> result = new ArrayList<>();
        for (Map row : rows) {
            BidResult bidResult = new BidResult();
            bidResult.setTitle(row.get("title").toString());
            String message = row.get("name") + " bid is: "  + row.get("price");
            String description = row.get("description").toString();
            if(description != null && !description.isEmpty()){
                message += "\n" + description;
            }
            bidResult.setMessage(message);
            result.add(bidResult);
        }
        return result;
    }

    @Override
    public int[] getUserBids(int uid) {
        String SQLUser = "Select count(b.sid) as count From Bids b where b.accepted = 1 and b.uid = " + uid;
        String SQLProvider = "Select count(DISTINCT b.bid) as count From Bids b, Offer o, Request r Where b.accepted = 1 and ((o.uid = 5 and o.oid = b.sid and b.type = 1) || (r.uid = 5 and r.rid = b.sid and b.type = 0))";
        List<Map<String, Object>> rows = getJdbcTemplate().queryForList(SQLUser);
        int [] counts = new int[2];
        counts[0] = Integer.parseInt(rows.get(0).get("count").toString());
        rows = getJdbcTemplate().queryForList(SQLProvider);
        counts[1] = Integer.parseInt(rows.get(0).get("count").toString());
        return counts;
    }
}
