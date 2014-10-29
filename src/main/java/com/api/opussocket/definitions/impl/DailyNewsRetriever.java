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
public class DailyNewsRetriever implements DataRetriever {

    private static final byte[] ARTICLE_KEY = {0x37, 0x34, 0x62, 0x72, 0x66, 0x73, 0x71, 0x62, 0x67, 0x34, 0x79, 0x66, 0x68, 0x37, 0x68, 0x6b, 0x66, 0x78, 0x65, 0x67, 0x6a, 0x33, 0x32, 0x63};
    private static final byte[] BREAKING_KEY = {0x74, 0x66, 0x64, 0x6b, 0x68, 0x66, 0x77, 0x32, 0x32, 0x34, 0x6d, 0x6b, 0x39, 0x76, 0x39, 0x37, 0x6a, 0x76, 0x6d, 0x38, 0x63, 0x71, 0x72, 0x6d};
    private static final byte[] BASE_URL = {0x68, 0x74, 0x74, 0x70, 0x3a, 0x2f, 0x2f, 0x61, 0x70, 0x69, 0x2e, 0x75, 0x73, 0x61, 0x74, 0x6f, 0x64, 0x61, 0x79, 0x2e, 0x63, 0x6f, 0x6d, 0x2f, 0x6f, 0x70, 0x65, 0x6e, 0x2f};
    private static final byte[] ARTICLE_URL = {0x61, 0x72, 0x74, 0x69, 0x63, 0x6c, 0x65, 0x73, 0x2f, 0x74, 0x6f, 0x70, 0x6e, 0x65, 0x77, 0x73, 0x3f, 0x65, 0x6e, 0x63, 0x6f, 0x64, 0x69, 0x6e, 0x67, 0x3d, 0x6a, 0x73, 0x6f, 0x6e, 0x26, 0x61, 0x70, 0x69, 0x5f, 0x6b, 0x65, 0x79, 0x3d};
    private static final byte[] BREAKING_URL = {0x62, 0x72, 0x65, 0x61, 0x6b, 0x69, 0x6e, 0x67, 0x3f, 0x65, 0x6e, 0x63, 0x6f, 0x64, 0x69, 0x6e, 0x67, 0x3d, 0x6a, 0x73, 0x6f, 0x6e, 0x26, 0x61, 0x70, 0x69, 0x5f, 0x6b, 0x65, 0x79, 0x3d};

    private static final String ARTICLES = new String(BASE_URL) + new String(ARTICLE_URL) + new String(ARTICLE_KEY);
    private static final String BREAKING = new String(BASE_URL) + new String(BREAKING_URL) + new String(BREAKING_KEY);

    private final List<OpusMessage> ingested;
    private static final Map<MessageFactory.MessageType, String> requestMap;

    static {
        requestMap = new HashMap(3);
        requestMap.put(MessageFactory.MessageType.BREAKING, BREAKING);
        requestMap.put(MessageFactory.MessageType.ARTICLES, ARTICLES);
    }

    public DailyNewsRetriever() {
        ingested = new ArrayList(1);
    }

    private void ingestNews(MessageFactory.MessageType type) throws IOException {        
        String value = getRequest(new URL(requestMap.get(type)));
        OpusMessage msg = MessageFactory.getMessage(type);
        msg.setJsonMessage(value);
        ingest(msg);
    }

    @Override
    public void retrieve() {
        try {
            for (MessageFactory.MessageType type : requestMap.keySet()) {
                ingestNews(type);
            }
        } catch (IOException ex) {
            digest();
            Logger.getLogger(DailyNewsRetriever.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    @Override
    public void ingest(OpusMessage value) {
        ingested.add(value);
    }

    @Override
    public List<OpusMessage> getIngested() {
        return ingested;
    }

    @Override
    public void digest() {
        ingested.clear();
    }
}
