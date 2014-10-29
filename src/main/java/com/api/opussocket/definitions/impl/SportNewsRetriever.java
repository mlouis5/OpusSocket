/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.api.opussocket.definitions.impl;

import com.api.opussocket.definitions.DataRetriever;
import com.api.opussocket.definitions.OpusMessage;
import com.api.opussocket.utilities.MessageFactory;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Mac
 */
public class SportNewsRetriever implements DataRetriever {

    private static final byte[] KEY = {0x7a, 0x36, 0x6d, 0x75, 0x6b, 0x79, 0x65, 0x72, 0x62, 0x65, 0x6e, 0x72, 0x79, 0x79, 0x38, 0x6e, 0x62, 0x7a, 0x33, 0x39, 0x73, 0x66, 0x79, 0x78};
    private static final String BASE_URL = "http://api.espn.com/v1/sports/";
    private static final String HEADLINE_URL = "news/headlines?limit=5&apikey=" + new String(KEY);

    private static final String NFL_HEADLINES = BASE_URL + "football/nfl/" + HEADLINE_URL;
    private static final String NBA_HEADLINES = BASE_URL + "basketball/nba/" + HEADLINE_URL;
    private static final String MLB_HEADLINES = BASE_URL + "baseball/mlb/" + HEADLINE_URL;

    private final List<OpusMessage> ingested;
    private static final Map<MessageFactory.MessageType, String> requestMap;

    static {
        requestMap = new HashMap(3);
        requestMap.put(MessageFactory.MessageType.NFL, NFL_HEADLINES);
        requestMap.put(MessageFactory.MessageType.NBA, NBA_HEADLINES);
        requestMap.put(MessageFactory.MessageType.MLB, MLB_HEADLINES);
    }

    public SportNewsRetriever() {
        ingested = new ArrayList(3);
    }
    
    private void ingestSportsNews(MessageFactory.MessageType type) throws IOException { 
        OpusMessage msg = MessageFactory.getMessage(type);
        String val = getRequest(new URL(requestMap.get(type)));
        msg.setJsonMessage(val);
        ingest(msg);
    }

    @Override
    public void retrieve() {
        try {
            for(MessageFactory.MessageType type : requestMap.keySet()){
                ingestSportsNews(type);
            }            
        } catch (IOException ex) {
            digest();
            Logger.getLogger(SportNewsRetriever.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    @Override
    public List<OpusMessage> getIngested() {
        return ingested;
    }

    @Override
    public void ingest(OpusMessage value) {
        ingested.add(value);
    }

    @Override
    public void digest() {
        ingested.clear();
    }
}
