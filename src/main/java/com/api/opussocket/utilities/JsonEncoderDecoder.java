/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.api.opussocket.utilities;

import com.google.gson.Gson;
import javax.ejb.Stateless;

/**
 *
 * @author Mac
 * @param <T>
 */
@Stateless
public class JsonEncoderDecoder<T> {
    private final Gson gson = new Gson();
    
    /**
     * Encodes a java POJO into a JSON String
     * @param t the POJO
     * @return JSON String representation
     */
    public String jsonEncode(T t){
        return gson.toJson(t);
    }
    
    /**
     * Decodes a JSON String of type T
     * @param t the class type T
     * @param json The JSON String to decode.
     * @return T
     */
    public T jsonDecode(Class<? extends T> t, String json){
        return gson.fromJson(json, t);
    }
}
