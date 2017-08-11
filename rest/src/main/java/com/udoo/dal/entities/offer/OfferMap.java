package com.udoo.dal.entities.offer;


//for maps InfoWindow
public class OfferMap {
    private Integer oid;

    private String location = "";

    private boolean realTime;

    public OfferMap(){}

    public OfferMap(Offer offer){
        this.oid = offer.getOid();

        this.location = offer.getLocation();
        this.realTime = offer.isRealTime();
    }
    public OfferMap(OfferLite offer){
        this.oid = offer.getOid();
        this.location = offer.getLocation();
        this.realTime = offer.isRealTime();
    }

    public Integer getOid() {
        return oid;
    }

    public void setOid(Integer oid) {
        this.oid = oid;
    }


    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public boolean isRealTime() {
        return realTime;
    }

    public void setRealTime(boolean realTime) {
        this.realTime = realTime;
    }

    @Override
    public String toString() {
        return "Offer{" +
                "oid=" + oid +
                ", location='" + location + '\'' +
                ", realTime=" + realTime +
                '}';
    }
}
