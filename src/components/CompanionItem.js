import React from 'react';
import CropApi from '../api/CropApi';
import {Text} from 'grommet';
import minus from '../content/minus.png';

class CompanionItem extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            otherId: this.props.otherId,
            crop: null
        };
    }

    componentDidMount()
    {
        if(!this.props.crop)
        {
            if(this.props.id)
            {
                CropApi.getCrop(this.props.id).then(
                    data => this.setState({crop: data})
                );
            }
        }
    }

    render()
    {
        if (this.state.crop)
        {
            const style =
            {
                display: "inline",
                width: "2%",
                height: "2%",
                margin: "1%"
            }
            return(
                <div>
                    <img style={style} alt = "" src = {this.state.crop.imageUrl}/>
                    <Text>{this.state.crop.name}</Text>
                    <img style = {style} alt = "remove" src = {minus} onClick = {() => this.props.onRemove(this.props.id, this.props.positive)}/>
                    <hr />             
                </div>
            );
        }
        else
        return(<h1>Loading...</h1>)
    }
}

export default CompanionItem;