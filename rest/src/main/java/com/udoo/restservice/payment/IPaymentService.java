package com.udoo.restservice.payment;

import com.udoo.dal.entities.Payment;

import java.util.List;

/**
 */
public interface IPaymentService {

   boolean reserveSumFromUserToService(int uid, int sid, boolean type, double sum);

   boolean sendMoney(int uid, int sid, boolean type);

   boolean sendPaymentReminder(int uid, int sid, boolean type, int cuid);

   Payment getStatusServicePayment(int uid, int sid, boolean type);

   List<Payment> getAllStatusServicePayment(int uid, int sid, boolean type);

   boolean sendBackMoney(int uid, int sid, boolean type);

   boolean setConfirmed(int uid, int sid, boolean type);
}
