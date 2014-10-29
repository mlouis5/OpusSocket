/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.api.opussocket.definitions.impl;

import com.api.opussocket.definitions.OpusMessage;

/**
 *
 * @author Mac
 */
public abstract class AbstractMessageImpl implements OpusMessage {

    protected String serverEndpoint;
    protected String msgType;
    protected String jsonMessage;
    
    @Override
    public String getSocketEndpoint() {
        return serverEndpoint;
    }

    @Override
    public void setSocketEndpoint(String endpoint) {
        serverEndpoint = endpoint;
    }

    @Override
    public String getMsgType() {
        return msgType;
    }

    @Override
    public void setMsgType(String type) {
        msgType = type;
    }

    @Override
    public String getJsonMessage() {
        return jsonMessage;
    }

    @Override
    public void setJsonMessage(String jsonMessage) {
        this.jsonMessage = jsonMessage;
    }    
}
