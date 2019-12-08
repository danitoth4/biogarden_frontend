import React from 'react';
import CropApi from '../api/CropApi';
import CompanionApi from '../api/CompanionApi';
import { Tab, Tabs, Select, Button, Box, Heading} from 'grommet';
import { Link } from 'react-router-dom';
import CompanionItem from './CompanionItem';

class CropEditPage extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = 
        {
            cropData: null,
            companions: null,
            otherCrops: null
        };
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
        this.refillCompanions();
        CropApi.getAllCrops().then(
            data =>
            {
                this.setState(
                    {
                        otherCrops: data
                    }
                );
            }
        );
    }

    refillCompanions()
    {
        CompanionApi.getCompanions(this.props.match.params.cropId).then(
            data =>
            {
                this.setState(
                    {
                        companions: data
                    }
                );
            }
        );
    }

    onCompanionRemove(id)
    {
        this.setState(prevState => { return({
                companions: prevState.companions.filter(cmp => cmp.id !== id)
            }); }
            );
        CompanionApi.deleteCompanion(id).then(() => this.refillCompanions());        
    }

    onCompanionAdded(name, isPositive)
    {
        let impacting = this.state.otherCrops.filter(c => c.name === name)[0];
        CompanionApi.addCompanion({impacted: this.state.cropData, impacting: impacting, positive: isPositive}).then(() => this.refillCompanions());            
    }

    render()
    {
        if(this.state.cropData && this.state.companions && this.state.otherCrops)
        {
            const comps = this.state.companions.map(
                cmp => <CompanionItem id = {cmp.id}  key = {cmp.id} positive = {cmp.positive} impactingCrop = {cmp.impacting} onRemove = {this.onCompanionRemove.bind(this)}/>
            );
            const options = this.state.otherCrops.filter(crop => crop.id != this.props.match.params.cropId && !this.state.companions.some(c => c.impacting.id === crop.id)).map(c => c.name);
            return(
                    <Box pad = "small" background="light-1" elevation = "xlarge" round alignSelf = "center" align = "center" width = "40%">  
                        <Heading level = '1' style = {{display: "inline-block"}}>{this.state.cropData.name}</Heading>
                        <img src = {this.state.cropData.imageUrl} alt = "" style = {{width: "15%"}}/>
                        <p>Length: {this.state.cropData.length * 5} cm </p>
                        <p>Width: {this.state.cropData.width * 5} cm </p>
                        <p> Description: {this.state.cropData.description ||  "n/a"}</p>
                        <h2>Companions</h2>
                        <Tabs>
                            <Tab title = "Preferable">
                                <Box gap = "xsmall">
                                    <Select 
                                        options={options}
                                        value = {"Add.."}
                                        onChange={({ option }) => this.onCompanionAdded(option, true)}
                                    />
                                    {comps.filter(cmp => cmp.props.positive)}
                                </Box>
                            </Tab>
                            <Tab title = "Avoidable">
                                <Select 
                                    options={options}
                                    value = {"Add.."}
                                    onChange={({ option }) => this.onCompanionAdded(option, false)}
                                />
                                {comps.filter(cmp => !cmp.props.positive)}
                            </Tab>
                        </Tabs>
                        <Link to = {{pathname: '/'}}>
                            <Button primary = {true} alignSelf = "center" color = "neutral-1" label = "Back to Garden"/>
                        </Link>
                    </Box>
                
            );
        }
        else
            return(<h2>Loading</h2>);
    }
}

export default CropEditPage;

