package com.udoo.dal.entities.availability;

public class AvailabilityResponse {
    private int from;

    private int to;

    public AvailabilityResponse() {
    }

    public AvailabilityResponse(int from, int to) {
        this.from = from;
        this.to = to;
    }

    public int getFrom() {
        return from;
    }

    public void setFrom(int from) {
        this.from = from;
    }

    public int getTo() {
        return to;
    }

    public void setTo(int to) {
        this.to = to;
    }
}
