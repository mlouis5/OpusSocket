/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.api.opussocket;

import com.api.opussocket.definitions.Consumable;
import com.api.opussocket.definitions.Consumer;
import com.api.opussocket.definitions.ConsumptionListener;
import com.api.opussocket.definitions.DataRetriever;
import com.api.opussocket.definitions.impl.AbstractConsumerImpl;
import com.api.opussocket.definitions.impl.DailyNewsRetriever;
import com.api.opussocket.definitions.impl.SportNewsRetriever;
import com.api.opussocket.definitions.OpusMessage;
import com.api.opussocket.utilities.JsonEncoderDecoder;
import com.api.opussocket.utilities.SessionManager;
import java.io.IOException;
import java.util.Objects;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.ejb.Timer;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

/**
 *
 * @author Mac
 */
@Singleton
@ServerEndpoint("/newssocket")
public class NewsSocketEndpoint implements ConsumptionListener {

    private static final SessionManager sessionManager = new SessionManager();
    private final Consumer consumer = new AbstractConsumerImpl();
    private final DataRetriever sportRetriever;
    private final DataRetriever dailyNewsRetriever;
    private Session peerToUpdate = null;
    private boolean sendToSingle = false;
    private JsonEncoderDecoder<OpusMessage> json;

    public NewsSocketEndpoint() {
        sportRetriever = new SportNewsRetriever();
        dailyNewsRetriever = new DailyNewsRetriever();
        json = new JsonEncoderDecoder();
    }

    @OnOpen
    public void onOpen(Session peer) {
        if (Objects.nonNull(this)) {
            sessionManager.addSession(peer);
            peerToUpdate = peer;
            updateDailyNews(null);
            updateSportsNews(null);
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

    @Schedule(minute = "30/30", hour = "*", dayOfWeek = "*", year = "*", persistent = false)
    private void updateSportsNews(Timer timer) {
        if (Objects.nonNull(this)) {
            update(timer, sportRetriever);
        }
    }

    @Schedule(minute = "10/10", hour = "*", dayOfWeek = "*", year = "*", persistent = false)
    private void updateDailyNews(Timer timer) {
        if (Objects.nonNull(this)) {
            update(timer, dailyNewsRetriever);
        }
    }

    private void update(Timer timer, DataRetriever dataRetriever) {
        if (Objects.nonNull(dataRetriever)) {
            if (Objects.nonNull(sessionManager) && sessionManager.hasLiveSessions()) {
                if (Objects.isNull(timer) && Objects.nonNull(peerToUpdate)) {
                    sendToSingle = true;
                    consumer.consume(this, dataRetriever);
                    peerToUpdate = null;
                    sendToSingle = false;
                } else {
                    sendToSingle = false;
                    consumer.consume(this, dataRetriever);
                }
            }
        }
    }

    @OnError
    public void onError(Throwable t) {
        if (Objects.nonNull(this)) {
            Logger.getLogger(NewsSocketEndpoint.class.getName()).log(Level.SEVERE, null, t.getMessage());
            if (Objects.nonNull(sessionManager)) {
                sessionManager.removeClosedSessions();
            }
        }
    }

    @Override
    public void consumed(Consumable consumable) {
        if (consumable != null) {
            try {
                for (OpusMessage val : consumable.getIngested()) {                    
                    if(val.getJsonMessage().contains("xml version=")){
                        continue;
                    }
                    val.setSocketEndpoint("newssocket");
                    String jsonMsg = json.jsonEncode(val);
                    
                    if (sendToSingle && Objects.nonNull(peerToUpdate)) {
                        peerToUpdate.getBasicRemote().sendText(jsonMsg);
                    } else {
                        sessionManager.sendBasicMessageToLiveSessions(jsonMsg);
                    }
                }
            } catch (IOException ex) {
                Logger.getLogger(NewsSocketEndpoint.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
}
