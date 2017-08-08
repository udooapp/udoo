package com.udoo.dal.entities;

import com.udoo.dal.entities.user.User;

import java.util.List;

/**
 */
public class UserResponse {
    private User user;
    private List<Notification> notifications;
    private List<BidResult> reminders;
    private List<String> systemNotification;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<Notification> getNotifications() {
        return notifications;
    }

    public void setNotifications(List<Notification> notifications) {
        this.notifications = notifications;
    }

    public List<BidResult> getReminders() {
        return reminders;
    }

    public void setReminders(List<BidResult> reminders) {
        this.reminders = reminders;
    }

    public List<String> getSystemNotification() {
        return systemNotification;
    }

    public void setSystemNotification(List<String> systemNotification) {
        this.systemNotification = systemNotification;
    }
}
