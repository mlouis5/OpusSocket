/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.api.opussocket.definitions;

/**
 * A ConsumptionListener listens to a Consumer for Consumable ingestion.
 * @author Mac
 */
public interface ConsumptionListener {
    
    /**
     * Accepts a Consumable ingested by a Consumer
     * @param consumable 
     */
    public void consumed(Consumable consumable);
}
