/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.api.opussocket.definitions;

import java.util.Objects;

/**
 * A Consumer, retrieves data from the Internet, using a DataRetriever
 * @author Mac
 */
public interface Consumer {
    
    /**
     * Uses a DataRetriever to consume a service (Rest Service)
     * @param cl
     * @param dataRetriever
     */
    public default void consume(ConsumptionListener cl, DataRetriever dataRetriever) {
        if (Objects.nonNull(cl) && Objects.nonNull(dataRetriever)) {
            dataRetriever.digest();
            dataRetriever.retrieve();
            cl.consumed(dataRetriever);
        }
    }
}
