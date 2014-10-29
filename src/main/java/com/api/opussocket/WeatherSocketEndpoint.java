/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.api.opussocket;

import com.api.opussocket.definitions.Consumable;
import com.api.opussocket.definitions.Consumer;
import com.api.opussocket.definitions.ConsumptionListener;
import com.api.opussocket.definitions.impl.AbstractConsumerImpl;
import com.api.opussocket.definitions.impl.WeatherRetriever;
import com.api.opussocket.definitions.OpusMessage;
import com.api.opussocket.pojos.WeatherLocation;
import com.api.opussocket.utilities.JsonEncoderDecoder;
import java.io.IOException;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.ejb.Timer;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

/**
 *
 * @author Mac
 */
@Singleton
@ServerEndpoint("/weathersocket/{state}/{city}")
public class WeatherSocketEndpoint implements ConsumptionListener {

    private static final Set<WeatherLocation> weatherLocations = new HashSet();
    private final Consumer consumer = new AbstractConsumerImpl();
    private WeatherRetriever weatherRetriever;
    private Session peerToUpdate = null;
    private JsonEncoderDecoder<OpusMessage> json;

    public WeatherSocketEndpoint() {
        json = new JsonEncoderDecoder();
    }

    @OnOpen
    public void onOpen(Session peer, @PathParam("state") String state, @PathParam("city") String city) {
        if (Objects.nonNull(peer)) {
            WeatherLocation weatherLocation = new WeatherLocation(peer, state, city);
            peerToUpdate = peer;
            weatherLocations.add(weatherLocation);
            update(null);
        }
    }

    @OnClose
    public void onClose(Session peer) {
        WeatherLocation locToRemove = null;
        for (WeatherLocation loc : weatherLocations) {
            Session sess = loc.getSession();
            if (peer == sess) {
                locToRemove = loc;
                break;
            }
        }
        if (Objects.nonNull(locToRemove)) {
            weatherLocations.remove(locToRemove);
        }
    }

    @Schedule(hour = "*", dayOfWeek = "*", year = "*", persistent = false)
    private void update(Timer timer) {
        if (Objects.isNull(timer) && Objects.nonNull(peerToUpdate)) {
            for (WeatherLocation loc : weatherLocations) {
                Session sess = loc.getSession();
                if (Objects.nonNull(loc)) {
                    if (Objects.nonNull(sess)) {
                        if (Objects.equals(sess, peerToUpdate)) {
                            weatherRetriever = new WeatherRetriever(loc);
                            consumer.consume(this, weatherRetriever);
                            break;
                        }
                    }
                }
            }
            peerToUpdate = null;
        } else {
            for (WeatherLocation loc : weatherLocations) {
                if (Objects.nonNull(loc)) {
                    weatherRetriever = new WeatherRetriever(loc);
                    consumer.consume(this, weatherRetriever);
                }
            }
        }
    }

    @OnError
    public void onError(Throwable t) {
        if (Objects.nonNull(this)) {
            Logger.getLogger(WeatherSocketEndpoint.class.getName()).log(Level.SEVERE, null, t.getMessage());
            WeatherLocation locToRemove = null;
            for (WeatherLocation loc : weatherLocations) {
                Session sess = loc.getSession();
                if (!sess.isOpen()) {
                    locToRemove = loc;
                    break;
                }
            }
            if (Objects.nonNull(locToRemove)) {
                weatherLocations.remove(locToRemove);
            }
        }
    }

    @Override
    public void consumed(Consumable consumable) {
        if (Objects.nonNull(consumable)) {
            if (consumable instanceof WeatherRetriever) {
                WeatherRetriever wr = (WeatherRetriever) consumable;
                if (Objects.nonNull(wr)) {
                    WeatherLocation wl = wr.getLocation();
                    if (Objects.nonNull(wl)) {
                        Session peer = wl.getSession();
                        if (Objects.nonNull(peer)) {
                            try {
                                for (OpusMessage val : wr.getIngested()) {
                                    val.setSocketEndpoint("weathersocket");
                                    String jsonMsg = json.jsonEncode(val);

                                    peer.getBasicRemote().sendText(jsonMsg);
                                }
                            } catch (IOException ex) {
                                Logger.getLogger(WeatherSocketEndpoint.class.getName()).log(Level.SEVERE, null, ex);
                            }
                        }
                    }
                }
            }
        }
    }
}
