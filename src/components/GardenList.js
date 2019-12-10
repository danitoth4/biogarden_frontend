import React from 'react';
import GardenApi from '../api/GardenApi';
import GardenListItem from './GardenListitem';
import { Button, Box, Grid, Heading, Image } from 'grommet';
import {Trash} from 'grommet-icons';
import { Link } from 'react-router-dom';
import CropApi from '../api/CropApi';
import Crop from './Crop'
import backgroundPath from '../backgroundPath.js'

class GardenList extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            gardens: null,
            crops: null
        }
    }

    componentDidMount()
    {
        GardenApi.getGardens().then(data => this.setState({gardens: data}));
        CropApi.getAllCrops().then(data => this.setState({crops: data}));
    }

    deleteCrop(id)
    {
        CropApi.deleteCrop(id).then( () => CropApi.getAllCrops().then(data => this.setState({crops: data})))
    }

    render()
    {
        if(this.state.gardens && this.state.crops)
        {
            var gardenComponents = this.state.gardens.map(g => <GardenListItem key={g.id} garden={g} />)
            const style = 
            {
                display: "inline",
                alignSelf: "center",
                width: "30px",
                height: "30px",
                margin: "1%"
            }
            console.log(backgroundPath);
            var cropComponents = this.state.crops.map(c => 
                    <Box key={c.id} round pad = "xsmall" margin = "xsmall" align = "center" justify="between" background = {{color: "light-1", opacity: "0.8"}} direction = "row" >            
                        <Image style = {style} src = {c.imageUrl}/>
                        <Link style={{textDecoration: "none"}} to = {{pathname: `/crop/${c.id}`}}>
                            <Heading color = "black" level={3} style = {style}>{c.name}</Heading>                     
                        </Link>
                        <Trash color = "black" style = {style} size = "medium" onClick = {() => this.deleteCrop(c.id)}/>
                    </Box>                
                );
            return(
                <Grid
                margin = "small"
                rows = {['auto']}
                columns={['1/4', '3/4']}
                gap="small"
                areas={[
                    { name: 'crops', start: [0, 0], end: [0, 0] },
                    { name: 'gardens', start: [1, 0], end: [1, 0] },
                ]}
                >
                    <Box gridArea="gardens" gap="medium">
                        <Link to = '/creategarden'>
                            <Button margin = "small" primary = {true} color = "neutral-1" label = "New Garden"/>
                        </Link>
                        <Box pad = "medium"> 
                            {gardenComponents}
                        </Box>
                    </Box>
                    <Box gridArea="crops" gap = "medium">
                        <Link to = '/createcrop'>
                            <Button margin = "small" primary = {true} color = "neutral-1" label = "New Crop"/>
                        </Link>
                        <Box pad = "medium"> 
                            {cropComponents}
                        </Box>
                    </Box>
                </Grid>                
            );
        }
        else
        {
            return( <h1>Loading...</h1>);
        }
    }
}

export default GardenList;