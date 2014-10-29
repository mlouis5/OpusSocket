/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.api.opussocket;

import com.api.opussocket.definitions.MessagePropagator;
import com.api.opussocket.definitions.OpusMessage;
import com.api.opussocket.utilities.JsonEncoderDecoder;
import com.api.opussocket.utilities.MessageFactory;
import com.api.opussocket.utilities.MessageFactory;
import com.api.opussocket.utilities.SessionManager;
import java.io.IOException;
import java.util.Objects;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ejb.Singleton;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

/**
 *
 * @author Mac
 */
@Singleton
@ServerEndpoint("/statesocket")
public class StateSocketEndpoint implements MessagePropagator {

    private static final SessionManager sessionManager = new SessionManager();
    private JsonEncoderDecoder<OpusMessage> json;

    public StateSocketEndpoint() {
        json = new JsonEncoderDecoder();
    }

    @OnMessage
    public String onMessage(String message) {
        if (Objects.nonNull(this)) {
            propagateMessage(message);            
        }
        return null;
    }

    @OnOpen
    public void onOpen(Session peer) {
        if (Objects.nonNull(this)) {
            sessionManager.addSession(peer);
        }
    }

    @OnClose
    public void onClose(Session peer) {
        if (Objects.nonNull(this)) {
            if (Objects.nonNull(sessionManager)) {
                sessionManager.removeSession(peer);
            }
        }
    }

    @OnError
    public void onError(Throwable t) {
        if (Objects.nonNull(this)) {
            Logger.getLogger(StateSocketEndpoint.class.getName()).log(Level.SEVERE, null, t.getMessage());
            if (Objects.nonNull(sessionManager)) {
                sessionManager.removeClosedSessions();
            }
        }
    }

    @Override
    public void propagateMessage(String message) {
        try {
            OpusMessage aMessage = MessageFactory.getMessage(MessageFactory.MessageType.STATE);
            aMessage.setSocketEndpoint("statesocket");
            aMessage.setJsonMessage(message);
            String jsonMsg = json.jsonEncode(aMessage);
            
            sessionManager.sendBasicMessageToLiveSessions(jsonMsg);
        } catch (IOException ex) {
            Logger.getLogger(StateSocketEndpoint.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}
