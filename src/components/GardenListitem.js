import React from 'react';
import {Link} from 'react-router-dom';


export default class GardenListItem extends React.Component
{
    constructor(props)
    {
        super(props)
    }

    render()
    {
        return(
            <Link to = {{
                    pathname: `/garden/${this.props.id}`,
                    state: {
                        width: this.props.width,
                        length: this.props.length 
                    }
                }}>
                <h2>{this.props.name}</h2>
            </Link>
        );
    }
}