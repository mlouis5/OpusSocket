/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.api.opussocket.definitions.impl;

import com.api.opussocket.definitions.DataRetriever;
import com.api.opussocket.definitions.OpusMessage;
import com.api.opussocket.pojos.WeatherLocation;
import com.api.opussocket.utilities.MessageFactory;
import com.api.opussocket.utilities.MessageFactory;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ejb.Stateless;

/**
 *
 * @author Mac
 */
@Stateless
public class WeatherRetriever implements DataRetriever {

    private static final byte[] TEN_DAY_FORECAST_HEX = {0x68, 0x74, 0x74, 0x70, 0x3a, 0x2f, 0x2f, 0x61, 0x70, 0x69,
        0x2e, 0x77, 0x75, 0x6e, 0x64, 0x65, 0x72, 0x67, 0x72, 0x6f, 0x75, 0x6e, 0x64, 0x2e, 0x63, 0x6f, 0x6d, 0x2f,
        0x61, 0x70, 0x69, 0x2f, 0x62, 0x64, 0x63, 0x62, 0x37, 0x62, 0x35, 0x34, 0x30, 0x65, 0x66, 0x34, 0x63, 0x33,
        0x63, 0x33, 0x2f, 0x66, 0x6f, 0x72, 0x65, 0x63, 0x61, 0x73, 0x74, 0x31, 0x30, 0x64, 0x61, 0x79, 0x2f, 0x71, 0x2f};
    private static final String TEN_DAY_FORECAST = new String(TEN_DAY_FORECAST_HEX);
    private static final String FORMAT = ".json";

    private final List<OpusMessage> ingested;
    private final WeatherLocation location;

    public WeatherRetriever() {
        location = new WeatherLocation(null, "NJ", "West Deptford");
        ingested = new ArrayList(1);
    }

    /**
     * Constructs a WeatherRetriever based on the state, and city provided.
     *
     * @param weatherLocation
     */
    public WeatherRetriever(WeatherLocation weatherLocation) {
        this.location = weatherLocation;
        this.ingested = new ArrayList(1);
    }

    public void setLocation(String state, String city) {
        if (state != null && city != null) {
            location.setState(state);
            location.setCity(city);
        }
    }

    public void setLocation(WeatherLocation weatherLocation) {
        setLocation(weatherLocation == null ? null : weatherLocation.getState(),
                weatherLocation == null ? null : weatherLocation.getCity());
    }

    public WeatherLocation getLocation() {
        return location;
    }

    @Override
    public void retrieve() {
        if (Objects.nonNull(location) && Objects.nonNull(location.getState()) && Objects.nonNull(location.getCity())) {
            try {
                URL url = new URL(TEN_DAY_FORECAST + location.getState() + "/" + location.getCity() + FORMAT);
                
                OpusMessage msg = MessageFactory.getMessage(MessageFactory.MessageType.FORECAST);
                String value = getRequest(url);
                msg.setJsonMessage(value);
                ingest(msg);
            } catch (IOException ex) {
                digest();
                Logger.getLogger(WeatherRetriever.class.getName()).log(Level.SEVERE, null, ex);
            }
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
