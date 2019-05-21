import React from 'react';
import CropApi from '../api/CropApi';
import CompanionApi from '../api/CompanionApi';
import { Tab, Tabs, Select, Button, Text} from 'grommet';
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

    handleSave()
    {

    }

    onCompanionRemove(id, isPositive)
    {
        this.setState(prevState => { return({
                companions: prevState.companions.filter(cmp => cmp.cropId2 !== id)
            }); }
            );
        CompanionApi.deleteCompanions([{cropId1: this.state.cropData.id, cropId2: id, positive: isPositive}]).then(() => this.refillCompanions());        
    }

    onCompanionAdded(name, isPositive)
    {
        let id = this.state.otherCrops.filter(c => c.name === name)[0].id;
        CompanionApi.addCompanions([{cropId1: this.state.cropData.id, cropId2: id, positive: isPositive}]).then(() => this.refillCompanions());            
    }

    render()
    {
        if(this.state.cropData && this.state.companions && this.state.otherCrops)
        {
            const comps = this.state.companions.map(
                cmp => <CompanionItem id = {cmp.cropId2}  key = {cmp.cropId2} positive = {cmp.positive} onRemove = {this.onCompanionRemove.bind(this)}/>
            );
            const options = this.state.otherCrops.filter(crop => crop.id != this.props.match.params.cropId && !this.state.companions.some(e => e.cropId2 === crop.id)).map(c => c.name);
            console.log(comps);
            return( 
                    <div style ={{margin: "5%"}}>
                        <h1 style = {{display: "inline-block"}}>{this.state.cropData.name}</h1>
                        <h3 style ={{fontStyle: "italic"}}>{this.state.cropData.binomialName}</h3>
                        <img src = {this.state.cropData.imageUrl} alt = "" style = {{width: "15%"}}/>
                        <p>Diameter: {this.state.cropData.diameter} cm </p>
                        <p> Description: {this.state.cropData.description ||  "n/a"}</p>
                        <h2>Companions</h2>
                        <Tabs>
                            <Tab title = "Preferable">
                                <Select 
                                    options={options}
                                    value = {"Add.."}
                                    onChange={({ option }) => this.onCompanionAdded(option, true)}
                                />
                                {comps.filter(cmp => cmp.props.positive)}
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
                    </div> 
                
            );
        }
        else
            return(<h2>Loading</h2>);
    }
}

export default CropEditPage;

