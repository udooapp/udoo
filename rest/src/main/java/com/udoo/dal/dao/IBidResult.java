package com.udoo.dal.dao;


import com.udoo.dal.entities.BidResult;
import org.springframework.data.util.Pair;

import java.util.List;

public interface IBidResult {

    List<BidResult> getBids(long id);

    int[] getUserBids(int uid);
}
