import React from 'react';
import {Link} from 'react-router-dom';
import { Box, Heading } from 'grommet';


export default class GardenListItem extends React.Component
{
    render()
    {
        const style = {
            textDecoration: "none",
            margin: "2%"
        }
        let gardenContents = this.props.garden.gardenContents.map(gc => 
            <Link  style = {style} to = {{
                pathname: `/garden/${this.props.garden.id}/${gc.id}`,
                state: {
                    width: this.props.garden.width,
                    length: this.props.garden.length 
                }
            }}>
                <Heading color = "black" level = '2'>{gc.name}</Heading>
            </Link>
        );
        return(
            <Box round pad = "small" gap = "xsmall" margin = "xsmall" align = "center" justify="fkex-start" background = {{color: "light-1", opacity: "0.8"}} direction = "row" >               
                <Heading color = "black" level = '1'>{this.props.garden.name}</Heading>
                {gardenContents}
            </Box>
        );
    }
}