/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.api.opussocket.utilities;

import com.api.opussocket.definitions.OpusMessage;
import com.api.opussocket.pojos.BreakingNewsMessage;
import com.api.opussocket.pojos.ForecastMessage;
import com.api.opussocket.pojos.HeadlineMessage;
import com.api.opussocket.pojos.MLBMessage;
import com.api.opussocket.pojos.NBAMessage;
import com.api.opussocket.pojos.NFLMessage;
import com.api.opussocket.pojos.StateMessage;

/**
 *
 * @author Mac
 */
public class MessageFactory {
    
    public static enum MessageType{
        NFL, NBA, MLB, FORECAST, BREAKING, ARTICLES, STATE;
    }
    
    public static OpusMessage getMessage(MessageType type){
        OpusMessage msg = null;
        if(type != null){
        switch(type){
            case NFL:{
                msg = new NFLMessage();                
                break;
            }
            case NBA:{
                msg = new NBAMessage();
                break;
            }
            case MLB:{
                msg = new MLBMessage();
                break;
            }
            case FORECAST:{
                msg = new ForecastMessage();
                break;
            }
            case BREAKING:{
                msg = new BreakingNewsMessage();
                break;
            }
            case ARTICLES:{
                msg = new HeadlineMessage();
                break;
            }
            case STATE:{
                msg = new StateMessage();
                break;
            }
        }
            if(msg != null){
                msg.setMsgType(type.toString());
            }
        }
        return msg;
    }
}
