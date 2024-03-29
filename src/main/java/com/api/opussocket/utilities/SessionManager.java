/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.api.opussocket.utilities;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import javax.ejb.Stateless;
import javax.websocket.Session;

/**
 *
 * @author Mac
 */
@Stateless
public class SessionManager {

    private final Set<Session> peers = Collections.synchronizedSet(new HashSet<Session>());
    private final Set<Session> closedSessions = Collections.checkedSet(new HashSet<Session>(), Session.class);

    public void addSession(Session peer) {
        synchronized (peers) {
            peers.add(peer);
        }
    }

    public void removeSession(Session peer) {
        synchronized (peers) {
            peers.remove(peer);
        }
    }

    public boolean isEmpty() {
        synchronized (peers) {
            return peers.isEmpty();
        }
    }

    public boolean hasLiveSessions() {
        synchronized (peers) {
            for (Session peer : peers) {
                if (Objects.nonNull(peer) && peer.isOpen()) {
                    return true;
                }
            }
        }
        return false;
    }

    public void clearAllSessions() {
        synchronized (peers) {
            peers.clear();
        }
    }

    public void removeClosedSessions() {
        synchronized (peers) {
            for (Session peer : peers) {
                if (!peer.isOpen()) {
                    closedSessions.add(peer);
                }
            }
        }
        for (Session peer : closedSessions) {
            peers.remove(peer);
        }
        emptyClosedSessions();

    }

    public void sendBasicMessageToLiveSessions(String message) throws IOException {
        synchronized (peers) {
            for (Session peer : peers) {
                if (peer.isOpen()) {
                    peer.getBasicRemote().sendText(message);
                } else {
                    closedSessions.add(peer);
                }
            }
        }
        for (Session peer : closedSessions) {
            peers.remove(peer);
        }
        emptyClosedSessions();
    }

    private void emptyClosedSessions() {
        closedSessions.clear();
    }
}
