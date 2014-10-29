/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.api.opussocket.definitions;



/**
 *
 * @author Mac
 */
public interface OpusMessage {

    public String getSocketEndpoint();

    public void setSocketEndpoint(String fromSocket);

    public String getMsgType();

    public void setMsgType(String type);

    public String getJsonMessage();

    public void setJsonMessage(String jsonMessage);
}
