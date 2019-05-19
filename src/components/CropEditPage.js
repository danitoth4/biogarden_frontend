import React from 'react';
import CropApi from '../api/CropApi';
import CompanionApi from '../api/CompanionApi';
import { Tab, Tabs} from 'grommet';
import Crop from './Crop';

class CropEditPage extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            cropData: null,
            posCompanions: null,
            negCompanions: null
        };
        console.log(this.props)
    }

    componentDidMount()
    {
        CropApi.getCrop(this.props.match.params.cropId).then(
            data =>
            {
                this.setState(
                    {
                        cropData: data
                    }
                );
            }
        );
        CompanionApi.getCompanions(this.props.match.params.cropId).then(
            data =>
            {
                let pos = [];
                let neg = [];
                for(let i = 0; i < data.length; ++i)
                {
                    if(data[i].positive)
                    {
                        pos.push(data[i]);
                    }
                    else
                    {
                        neg.push(data[i]);
                    }
                }
                this.setState(
                    {
                        posCompanions: pos,
                        negCompanions: neg
                    }
                );
            }
        );
    }

    handleSave()
    {

    }

    backToGarden()
    {

    }

    render()
    {
        if(this.state.cropData && this.state.posCompanions && this.state.negCompanions)
        {
            const positive = this.state.posCompanions.map(
                cmp => 
                {
                    let id = cmp.cropId1 == this.props.match.params.cropId ? cmp.cropId2 : cmp.cropId1;
                    return(<Crop id = {id}  key = {id} />);
                }
            );
            const negative = this.state.negCompanions.map(
                cmp => 
                {
                    let id = cmp.cropId1 == this.props.match.params.cropId ? cmp.cropId2 : cmp.cropId1;
                    return(<Crop id = {id}  key = {id} />);
                }
            );
            console.log(negative);
            return( 
                    <div>
                        <h1>{this.state.cropData.name}</h1>
                        <h2>Companions</h2>
                        <Tabs >
                            <Tab title = "Preferable">
                                {positive}
                            </Tab>
                            <Tab title = "Avoidable">
                                {negative}
                            </Tab>
                        </Tabs>
                    </div> 
                
            );
        }
        else
            return(<h2>Loading</h2>);
    }
}

export default CropEditPage;

