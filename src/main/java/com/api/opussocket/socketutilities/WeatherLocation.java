/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.api.opussocket.socketutilities;

import java.util.Objects;

/**
 *
 * @author MacDerson
 */
public class WeatherLocation {

    private String city;
    private String zip;

    private WeatherLocation(String city, String zip) {
        this.city = city;
        this.zip = zip;
    }
    
    public void setCity(String city){
        this.city = city;
    }
    
    public void setZip(String zip){
        this.zip = zip;
    }

    public String getCity() {
        return city;
    }

    public String getZip() {
        return zip;
    }

    public String toString() {
        return city + ", zip";
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 37 * hash + Objects.hashCode(this.city);
        hash = 37 * hash + Objects.hashCode(this.zip);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final WeatherLocation other = (WeatherLocation) obj;
        if (!Objects.equals(this.city, other.city)) {
            return false;
        }
        if (!Objects.equals(this.zip, other.zip)) {
            return false;
        }
        return true;
    }
    
    
}
