import React from 'react';
import {Link} from 'react-router-dom';


export default class GardenListItem extends React.Component
{
    render()
    {
        return(
            <Link to = {{
                    pathname: `/garden/${this.props.id}/${this.props.contentId}`,
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