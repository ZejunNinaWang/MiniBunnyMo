import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Like(props){

    useEffect(() => {

    }, [])
    return(
        <div className="like">
            <span>
              <i
                className={
                  props.like === true 
                  ? 'fa fa-heart'
                  : 'fa fa-heart-o'
                }
              ></i>
            </span>
          
        </div>
        
    )
}