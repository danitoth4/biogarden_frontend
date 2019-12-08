import React from 'react';
import CropApi from '../api/CropApi';
import { Text } from 'grommet';
import {Trash} from 'grommet-icons';

class CompanionItem extends React.Component {
    render() {
        const style =
        {
            display: "inline",
            width: "4%",
            height: "4%",
            margin: "1%"
        }
        return (
            <div>
                <img style={style} alt="" src={this.props.impactingCrop.imageUrl} />
                <Text>{this.props.impactingCrop.name}</Text>
                <Trash style={style} alt="remove" onClick={() => this.props.onRemove(this.props.id)} />
                <hr />
            </div>
        );
    }
}

export default CompanionItem;