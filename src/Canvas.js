import React from 'react';
import Popup from './components/Popup';
import CropApi from './api/CropApi';
import GardenApi from './api/GardenApi';

class Canvas extends React.Component
{
    constructor(props)
    {
        super(props);
        let w = this.props.width - this.props.width % 35;
        let cS = w / 35;
        let h = this.props.height - this.props.height % cS;

        let x = new Array(h / cS);
        for(let i = 0; i < x.length; ++i)
        {
            x[i] = new Array(w / cS);
        }
        console.log(w / cS);
        console.log(h / cS);

        this.state = 
        {
            drawn: false,
            width: w,
            height: h,
            cellSize: cS,
            grid: x,
            images: {},
            showPopup: false
        };
        this.planting = {};
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    togglePopup()
    {
        this.setState(prevState => 
            {
                return{
                    showPopup: !prevState.showPopup
                }
            });
    }

    componentDidMount() 
    {  
        GardenApi.getPlantedCrops().then(data => 
            {
                this.drawGarden(data);
            }
        );
        fetch("http://localhost:8080/crop")
            .then(response => response.json())
            .then(data => 
                    {
                        for(let i = 0; i < data.length; ++i)
                        {
                            this.setState( (prevState) => 
                                {
                                    if(data[i].id in prevState.images)
                                    {
                                        return prevState;
                                    }

                                    var imgs = prevState.images;
                                    imgs[data[i].id] = data[i].imageUrl;
                                    return {
                                        images: imgs
                                    }
                                }
                            );
                        }
                    }
                );
    }

    drawGrid()
    {
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.setLineDash([2, 5,]);

        for(let i = 0; i < this.state.height; i += this.state.cellSize)
        {
            ctx.moveTo(0, i);
            ctx.lineTo(this.state.width, i);
            ctx.stroke();           
        }

        for(let i = 0; i < this.state.width; i += this.state.cellSize)
        {
            ctx.moveTo(i, 0);
            ctx.lineTo(i, this.state.height);
            ctx.stroke();           
        }

    }

    drawGarden(data)
    {
        this.drawGrid();
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext("2d");
        for(let i = 0; i < data.length; ++i)
        {
            if(data[i])
            {
                let xsize = data[i].endPoint.x - data[i].startPoint.x;
                let ysize = data[i].endPoint.y - data[i].startPoint.y;
                let imageObj = new Image();
                imageObj.i = data[i].startPoint.x * this.state.cellSize + this.state.cellSize * 0.05 * xsize;
                imageObj.j = data[i].startPoint.y * this.state.cellSize + this.state.cellSize * 0.05 * ysize;
                let cS = this.state.cellSize;
                imageObj.onload = function()
                {
                    ctx.drawImage(this, this.i, this.j, xsize * cS * 0.9, ysize * cS * 0.9);
                }
                imageObj.src = data[i].cropType.imageUrl;
            }
        }
        this.setState(
            {
                drawn: true
            }
        );
    }

    //event handlers

    handleMouseDown(e)
    {
        this.planting.x1 = this.convertToGardenCoordinate(e.clientX);
        this.planting.y1 = this.convertToGardenCoordinate(e.clientY);
    }

    handleMouseUp(e)
    {
        this.planting.x2 = this.convertToGardenCoordinate(e.clientX) + 1;
        this.planting.y2 = this.convertToGardenCoordinate(e.clientY) + 1;
        this.togglePopup();
    }

    convertToGardenCoordinate(value)
    {
        return Math.floor(value / this.state.cellSize);
    }

    cropSelected(crop)
    {
        this.togglePopup();
        this.planting.crop = crop;
        this.planting.method = "ADDED";
        GardenApi.modifyCrops(this.planting).then(data => {this.drawGarden(data)});
    }

    deleteSelected()
    {
        this.togglePopup();
        this.planting.method = "DELETED";
        GardenApi.modifyCrops(this.planting).then(data => {this.drawGarden(data)});
    }

    render() 
    {
        const styles = 
        {
            border: "2px solid", 
            backgroundColor: "#70e335" //light green
        }
        return(
          <div>
            <canvas ref="canvas" width={this.state.width} height={this.state.height} style={styles} onMouseDown = {e => this.handleMouseDown(e)} onMouseUp = {e => this.handleMouseUp(e)}/>
            {this.state.showPopup ? 
                <Popup text='Close Me' closePopup={this.togglePopup.bind(this)} cropSelected = {this.cropSelected.bind(this)} deleteSelected = {this.deleteSelected.bind(this)} cropData ={CropApi.getAllCrops()}/>
                : null 
                }     
          </div>
        )
    }
}

export default Canvas;