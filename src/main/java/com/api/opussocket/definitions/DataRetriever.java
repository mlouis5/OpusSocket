/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.api.opussocket.definitions;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * ASCII Converter: http://www.branah.com/ascii-converter
 * A DataRetriever is able to make a GET request to retrieve data from a URL
 * @see com.api.opussocket.definitions.Consumable
 * @author MacDerson Louis
 */
public interface DataRetriever extends Consumable {
    static final String CHROME_USER_AGENT = "Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1667.0 Safari/537.36";
    
    /**
     * Attempts to make a connection to the Internet to determine if there is a valid connection.
     */
    public static class ConnChecker {
        public static boolean hasActiveConnection() {
        try {
            final URL url = new URL("http://www.google.com");
            URLConnection conn = url.openConnection();
            conn.connect();
            return true;
        } catch (IOException ex) {
            Logger.getLogger(DataRetriever.class.getName()).log(Level.SEVERE, null, ex);
        }
        return false;
    }
    }
    /**
     * retrieves data from a URL
     * @param url A URL object containing the address to which a GET request will be made.
     * @return A string representation of the requested data.
     * @throws IOException
     */
    default String getRequest(URL url) throws IOException {
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        // optional default is GET
        con.setRequestMethod("GET");
        //add request header
        con.setRequestProperty("User-Agent", CHROME_USER_AGENT);

        StringBuilder response;
        BufferedReader in;// = new BufferedReader(
                //new InputStreamReader(con.getInputStream()))
        
        if(con.getResponseCode() >= 400){
            in = new BufferedReader(new InputStreamReader(con.getErrorStream()));
        }else{
            in = new BufferedReader(new InputStreamReader(con.getInputStream()));
        }
        
            String inputLine;
            response = new StringBuilder();
            while ((inputLine = in.readLine()) != null) {
                System.out.println(inputLine);
                response.append(inputLine);
            }
        return response.toString().trim();
    }
    
    /**
     * Retrieves and returns a list of the info requested.
     */
    public void retrieve();
}
