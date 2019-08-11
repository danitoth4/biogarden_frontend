import React from 'react';
import GardenApi from '../api/GardenApi';
import GardenListItem from './GardenListitem';

class GardenList extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            gardens: null
        }
    }

    componentDidMount()
    {
        GardenApi.getGardens().then(data => this.setState({gardens: data}));
    }

    render()
    {
        if(this.state.gardens)
        {
            console.log(this.state.gardens)
            var gardenComponents = this.state.gardens.map(g => <GardenListItem id={g.id} name={g.name} />)
            return(<div> {gardenComponents} </div>)
        }
        else
        {
            return( <h1>Loading...</h1>);
        }
    }
}

export default GardenList;