import React from 'react';
import CropApi from '../api/CropApi';
import { Text } from 'grommet';
import minus from '../content/minus.png';

class CompanionItem extends React.Component {
    render() {
        const style =
        {
            display: "inline",
            width: "2%",
            height: "2%",
            margin: "1%"
        }
        return (
            <div>
                <img style={style} alt="" src={this.props.impactingCrop.imageUrl} />
                <Text>{this.props.impactingCrop.name}</Text>
                <img style={style} alt="remove" src={minus} onClick={() => this.props.onRemove(this.props.id)} />
                <hr />
            </div>
        );
    }
}

export default CompanionItem;