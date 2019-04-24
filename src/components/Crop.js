import React from 'react';

export default class Crop extends React.Component
{
    render()
    {
        return(
            <div>
                <h4>{this.props.id}     {this.props.name}</h4>
            </div>
        );
    }
}