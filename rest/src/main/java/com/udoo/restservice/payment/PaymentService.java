package com.udoo.restservice.payment;

import com.udoo.dal.entities.Payment;
import com.udoo.dal.repositories.IOfferRepository;
import com.udoo.dal.repositories.IPaymentRepository;
import com.udoo.dal.repositories.IRequestRepository;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

/**
 */
public class PaymentService implements IPaymentService {

    private final int STATE_RESERVE = 0;
    private final int STATE_SEND = 4;
    private final int STATE_CONFIRM = 1;
    private final int STATE_REMIND = 2;
    private final int STATE_SEND_BACK = 3;


    @Resource
    private IPaymentRepository paymentRepository;

    @Resource
    private IOfferRepository offerRepository;

    @Resource
    private IRequestRepository requestRepository;

    @Override
    public boolean reserveSumFromUserToService(int uid, int sid, boolean type, double sum) {
        if (paymentRepository.findTop1ByUidAndSidAndTypeOrderByPidDesc(uid, sid, type) == null) {
            Payment payment = new Payment();
            payment.setUid(uid);
            payment.setDate(new Date());
            payment.setState(STATE_RESERVE);
            payment.setPrice(sum);
            payment.setType(type);
            payment.setSid(sid);
            return paymentRepository.save(payment) != null;
        }
        return false;
    }

    @Override
    public boolean sendMoney(int uid, int sid, boolean type) {
        Payment payment = paymentRepository.findTopByUidAndSidAndTypeAndStateOrderByPidDesc(uid, sid, type, STATE_CONFIRM);
        return paymentRepository.findTopByUidAndSidAndTypeAndStateOrderByPidDesc(uid, sid, type, STATE_SEND) == null && this.savePayment(payment, STATE_SEND);
    }

    @Override
    public boolean sendPaymentReminder(int uid, int sid, boolean type, int cuid) {
        Payment payment = paymentRepository.findTopByUidAndSidAndTypeAndStateOrderByPidDesc(uid, sid, type, STATE_RESERVE);

        return (type ? offerRepository.findByOid(sid).getUid() == cuid : requestRepository.findByRid(sid).getUid() == cuid) && this.savePayment(payment, STATE_REMIND);
    }

    @Override
    public Payment getStatusServicePayment(int uid, int sid, boolean type) {
        return paymentRepository.findTopByUidAndSidAndTypeOrderByPidDesc(uid, sid, type);
    }

    @Override
    public List<Payment> getAllStatusServicePayment(int uid, int sid, boolean type) {
        return paymentRepository.findAllByUidAndSidAndType(uid, sid, type);
    }

    @Override
    public boolean sendBackMoney(int uid, int sid, boolean type) {
        Payment payment = paymentRepository.findTopByUidAndSidAndTypeAndStateOrderByPidDesc(uid, sid, type, STATE_SEND);
        return paymentRepository.findTopByUidAndSidAndTypeAndStateOrderByPidDesc(uid, sid, type, STATE_SEND_BACK) == null && this.savePayment(payment, STATE_SEND_BACK);
    }

    @Override
    public boolean setConfirmed(int uid, int sid, boolean type) {
        Payment payment = paymentRepository.findTopByUidAndSidAndTypeAndStateOrderByPidDesc(uid, sid, type, STATE_RESERVE);
        return paymentRepository.findTopByUidAndSidAndTypeAndStateOrderByPidDesc(uid, sid, type, STATE_CONFIRM) == null && this.savePayment(payment, STATE_CONFIRM);

    }

    private boolean savePayment(Payment payment, int state) {
        if (payment != null) {
            payment.setPid(0);
            payment.setDate(new Date());
            payment.setState(state);
            return paymentRepository.save(payment) != null;
        }
        return false;
    }
}
