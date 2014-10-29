/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.api.opussocket.enums;

import java.util.Arrays;
import java.util.List;

/**
 * Channel represents the channels that an endpoint can register to.
 * @author MacDerson
 */
public enum Channel {
    ESPN_CHANNEL, WEATHER_UNDERGROUND_CHANNEL, USA_TODAY_CHANNEL;
    /*
    create all sub channels, for espn, and usa today.
    */
    
    public static Channel getChannel(String chan){
        Class<Channel> clazz = Channel.class;
        for(Channel ch : clazz.getEnumConstants()){
            if(ch.toString().equalsIgnoreCase(chan)){
                return ch;
            }
        }
        return null;
    }
    
    public static boolean isChannelRegistration(String chan){
        Channel ch = getChannel(chan);
        return ch != null;
    }
    
    public static boolean isAllChannelRegistration(String chan){
        return chan == null ? false : chan.equalsIgnoreCase("ALL_CHANNELS");
    }
    
    public static List<Channel> getAllChannels(){
        Class<Channel> clazz = Channel.class;
        return Arrays.asList(clazz.getEnumConstants());
    }
}
