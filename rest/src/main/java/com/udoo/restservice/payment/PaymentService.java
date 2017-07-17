package com.udoo.restservice.payment;

/**
 */
public class PaymentService implements IPaymentService {

    @Override
    public boolean reserveSumFromUserToProvider() {

        return false;
    }

    @Override
    public boolean sendMoneyWithIdToProvider() {
        return false;
    }

    @Override
    public boolean sendBackMoneyWithId() {
        return false;
    }
}
