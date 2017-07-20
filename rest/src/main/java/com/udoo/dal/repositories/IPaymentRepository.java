package com.udoo.dal.repositories;

import com.udoo.dal.entities.Payment;
import org.springframework.data.repository.Repository;

import java.util.List;


/**
 */
public interface IPaymentRepository extends Repository<Payment, Integer> {


    List<Payment> findAllByUidAndSidAndType(int uid, int sid, boolean type);


    Payment save(Payment payment);


    Payment findTop1ByUidAndSidAndTypeOrderByPidDesc(int uid, int sid, boolean type);

    Payment findTopByUidAndSidAndTypeAndStateOrderByPidDesc(int uid, int sid, boolean type, int state);

    Payment findTopByUidAndSidAndTypeOrderByPidDesc(int uid, int sid, boolean type);
}
