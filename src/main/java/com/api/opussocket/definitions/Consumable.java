/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.api.opussocket.definitions;

import java.util.List;

/**
 * A Consumable is an object which contains information retrieved from the Web,<br>
 * and is consumable by any method where a Consumable is injectable.
 * @author MacDerson Louis
 * @version 
 */
public interface Consumable {
    
    /**
     * Used to store the given value.
     * @param value 
     */
    public void ingest(OpusMessage value);
    
    /**
     * Returns the values, which were ingested
     * @return 
     */
    public List<OpusMessage> getIngested();
    
    /**
     * Utilized for clean up.
     */
    public void digest();
}
