package com.udoo.dal.dao;


import com.udoo.dal.entities.bid.BidResult;

import java.util.List;

public interface IBidResult {

    List<BidResult> getBids(long id);

    int[] getUserBids(int uid);

    List<BidResult> getUserReminders(long id);

}
