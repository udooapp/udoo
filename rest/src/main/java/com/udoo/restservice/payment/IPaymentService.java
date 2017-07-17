package com.udoo.restservice.payment;

/**
 */
public interface IPaymentService {

   boolean reserveSumFromUserToProvider();

   boolean sendMoneyWithIdToProvider();

   boolean sendBackMoneyWithId();
}
