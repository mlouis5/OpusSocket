/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.api.opussocket.pojos;

import java.util.Objects;
import javax.ejb.Stateless;
import javax.websocket.Session;

/**
 *
 * @author MacDerson
 */
@Stateless
public class WeatherLocation {

    private String state;
    private String city;
    private Session peer;
    
    public WeatherLocation() {}

    public WeatherLocation(Session peer, String state, String city) {
        this.peer = peer;
        this.state = state;
        this.city = city;
    }
    
    public Session getSession(){
        return peer;
    }
    
    public void setSession(Session peer){
        this.peer = peer;
    }
    
    public void setState(String state){
        this.state = state;
    }
    
    public void setCity(String city){
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public String getCity() {
        return city;
    }

    @Override
    public String toString() {
        return state + "/" + city;
    }

    @Override
    public int hashCode() {
        int hash = 3;
        hash = 67 * hash + Objects.hashCode(this.state);
        hash = 67 * hash + Objects.hashCode(this.city);
        hash = 67 * hash + Objects.hashCode(this.peer);
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
        if (!Objects.equals(this.state, other.state)) {
            return false;
        }
        if (!Objects.equals(this.city, other.city)) {
            return false;
        }
        if (!Objects.equals(this.peer, other.peer)) {
            return false;
        }
        return true;
    }    
}