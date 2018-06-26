/* 
Developed by Pramod Hanagandi -[pramod109.github.io]
This is the component to display message card
*/

import React from 'react';

class MessageCard extends React.Component{
    constructor(){
        super();
    }

    render(){
        return (
            <div className="card">
                <div className="card-body">
                    <p>{this.props.message}</p>
                </div>
            </div>
        );
    }
}

export default MessageCard;
