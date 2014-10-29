/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.api.opussocket;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

/**
 *
 * @author Mac
 */
@ServerEndpoint("/opusendpoint")
public class OpusEventNotifier {

    private static Set<Session> peers = Collections.synchronizedSet(new HashSet<Session>());
    
    @OnMessage
    public String onMessage(String message) {
        return null;
    }
    
    @OnOpen
    public void onOpen (Session peer) {
        System.out.println("Adding peer to peers: " + peer);
        peers.add(peer);
    }

    @OnClose
    public void onClose (Session peer) {
        peers.remove(peer);
    }

//    @OnError
//    public void onError(Throwable t) {
//    }
    
}
