/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.api.opussocket.pojos;

import com.api.opussocket.definitions.impl.AbstractMessageImpl;
import javax.ejb.Stateless;

/**
 *
 * @author Mac
 */
@Stateless
public class ArticlesMessage extends AbstractMessageImpl{
    
    public ArticlesMessage(){
        super();
    }
}
