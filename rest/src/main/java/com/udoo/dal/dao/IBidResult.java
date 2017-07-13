package com.udoo.dal.dao;


import com.udoo.dal.entities.BidResult;

import java.util.List;

public interface IBidResult {

    List<BidResult> getBids(long id);

}
