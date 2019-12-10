import React from 'react';
import CropApi from './api/CropApi';
import PlantingApi from './api/PlantingApi';
import GardenApi from './api/GardenApi';
import { Button, Box, Grid } from 'grommet';
import {Clear, ZoomIn, ZoomOut, CaretDown, CaretNext, CaretPrevious, CaretUp} from 'grommet-icons';
import Crop from './components/Crop';

class Canvas extends React.Component {
    
    constructor(props) {
        super(props);
        this.state =
            {
                id: this.props.match.params.gardenId,
                contentId: this.props.match.params.contentId,
                grid: null,
                images: {},
                drawn: false,
                crops: null
            };
        this.planting = {};
    }

    async componentDidMount() {
        //getting the images
        CropApi.getAllCrops()
        .then(data => {
            this.setState({crops: data});
            for (let i = 0; i < data.length; ++i) {
                this.setState((prevState) => {
                    if (data[i].id in prevState.images) {
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
        await this.calculateGridSize();
    }

    async calculateGridSize() {
        let cS = 40;
        let gardenX, gardenY;
        if (this.props.location.state && this.props.location.state.width && this.props.location.state.length) {
            gardenX = this.props.location.state.width;
            gardenY = this.props.location.state.length;
        }
        else {
            let garden = await GardenApi.getGarden(this.state.id);
            gardenX = garden.width;
            gardenY = garden.length;
        }
        let w = window.innerWidth * 0.80;
        let h = window.innerHeight * 0.75;
        w = (w - cS) - w % cS;
        h = (h - cS) - h % cS;
        let cellsX = w / cS;
        let cellsY = h / cS;
        // set default zoom 
        let zoom = 1.0;

        // if the window size divided by the cell size is bigger than the number of gardens cells then we are fine otherwise we have to set the zoom to the fraction
        if (cellsX > gardenX)
            cellsX = gardenX;
        else {
            zoom = gardenX / cellsX;
        }

        if (cellsY > gardenY)
        {
            cellsY = gardenY;
        }
        else {
            //bigger zoom wins so that everything  fits on the screen
            zoom = zoom <= (gardenY / cellsY) ? gardenY / cellsY : zoom;
        }
        zoom = Math.ceil(zoom);
        await this.setState(
            {
                cellSize: cS, //how many pixels is a cell
                displayableX: w / cS, //how many cells can fit on the screen
                displayableY: h / cS, //how many cells can fit on the screen
                gardenX: gardenX, // how wide the garden is
                gardenY: gardenY, // how long the garden is
                topLeft: { x: 0, y: 0 }, //the garden coordinates of the cell in the top left corner
                bottomRight: { x: gardenX, y: gardenY }, //the garden coordinates of the cell in the bottom right corner
                zoom: zoom, 
                maxZoom: zoom
            }, () => this.applyZoom(zoom)
        );
    } 

    drawGrid(ctx) {
        console.log("drawGrid")
        ctx.clearRect(0, 0, this.state.cellsX * this.state.cellSize, this.state.cellsY * this.state.cellSize);
        ctx.beginPath();
        ctx.setLineDash([2, 5,]);
        
        for(let i = 0; i  < this.state.cellsY; ++i)
        {
            ctx.moveTo(0, i * this.state.cellSize);
            ctx.lineTo(this.state.cellsX * this.state.cellSize, i * this.state.cellSize);
            ctx.stroke();
        }
        for(let i = 0; i < this.state.cellsX ; ++i)
        {
            ctx.moveTo(i * this.state.cellSize, 0);
            ctx.lineTo(i * this.state.cellSize, this.state.cellsY * this.state.cellSize);
            ctx.stroke();
        }
    }

    drawGarden(data) {
        const canvas = this.refs.canvas;
        if (!canvas)
            return;
        const ctx = canvas.getContext("2d");
        ctx.save();
        this.drawGrid(ctx);

        for (let i = 0; i < data.length; ++i) {
            if (data[i]) {
                let xsize = data[i].endX - data[i].startX;
                let ysize = data[i].endY - data[i].startY;
                let imageObj = new Image();
                let x = data[i].startX * this.state.cellSize;
                let y = data[i].startY * this.state.cellSize;
                imageObj.i = x + this.state.cellSize * 0.05 * xsize;
                imageObj.j = y + this.state.cellSize * 0.05 * ysize;
                let cS = this.state.cellSize;
                imageObj.onload = function () {
                    ctx.drawImage(this, this.i, this.j, xsize * cS * 0.9, ysize * cS * 0.9);
                }
                if(data[i].preferenceValue != 0)
                {
                    ctx.fillStyle = `rgba(${data[i].preferenceValue < 0 ? '255' : '0'}, ${data[i].preferenceValue < 0 ? '0' : '255'}, 0, ${Math.abs(data[i].preferenceValue) / 48})`;
                    ctx.fillRect(x, y, cS * xsize, cS * ysize);
                }
                imageObj.src = this.state.images[data[i].cropTypeId];
            }
        }
        ctx.restore();
        this.setState({drawn: true});
        this.drawNavigationRect();
    }

    drawNavigationRect()
    {
        const navCanvas = this.refs.navCanvas;
        if (!navCanvas)
            return;
        const navCtx = navCanvas.getContext("2d");
        navCtx.clearRect(0, 0, navCanvas.width, navCanvas.height);
        navCtx.beginPath();
        let x1 = ( this.state.topLeft.x / this.state.gardenX ) * navCanvas.width;
        let y1 = ( this.state.topLeft.y / this.state.gardenY ) * navCanvas.height;
        let x2 = ( this.state.bottomRight.x / this.state.gardenX ) * navCanvas.width;
        let y2 = ( this.state.bottomRight.y / this.state.gardenY ) * navCanvas.height;
        console.log(x1, y1, x2, y2);
        navCtx.lineWidth = "5";
        navCtx.rect(x1, y1, x2-x1, y2-y1);
        navCtx.stroke();
    }

    handleMouseDown(e) {
        this.planting.x1 = this.convertToGardenCoordinate(e.clientX - this.refs.canvas.offsetLeft);
        this.planting.y1 = this.convertToGardenCoordinate(e.clientY - this.refs.canvas.offsetTop);
    }

    handleMouseUp(e) {
        this.planting.x2 = this.convertToGardenCoordinate(e.clientX - this.refs.canvas.offsetLeft);
        this.planting.y2 = this.convertToGardenCoordinate(e.clientY - this.refs.canvas.offsetTop);
        if(this.planting.x2 >= this.planting.x1)
        {
            this.planting.x2++;
        }
        else
        {
            this.planting.x1++;
        }
        if(this.planting.y2 >= this.planting.y1)
        {
            this.planting.y2++;
        }
        else
        {
            this.planting.y1++;
        }
    }

    convertToGardenCoordinate(value) {
        return Math.floor(value / this.state.cellSize);
    }

    cropSelected(crop) {
        this.planting.cropId = crop.id;
        this.planting.method = "ADDED";
        PlantingApi.modifyCrops(this.planting, this.state.contentId, this.state.zoom, this.state.topLeft.x, this.state.topLeft.y, this.state.bottomRight.x, this.state.bottomRight.y).then(data => { this.drawGarden(data) });
    }

    deleteSelected() {
        this.planting.method = "DELETED";
        PlantingApi.modifyCrops(this.planting, this.state.contentId, this.state.zoom, this.state.topLeft.x, this.state.topLeft.y, this.state.bottomRight.x, this.state.bottomRight.y).then(data => { this.drawGarden(data) });
    }

    render() {
        if(!this.state.cellsX || !this.state.cellsY || !this.state.crops)
            return(<h1>Loading...</h1>);
        var cropComponents = this.state.crops.map(c => 
        <Box key={c.id} onClick = {() => this.cropSelected(c)}>
            <Crop key ={c.id} crop = {c}/>
        </Box>
            );
        return (
            <Grid
            margin = "small"
            rows = {['auto']}
            columns={['15%', '85%']}
            gap="small"
            areas={[
                { name: 'crops', start: [0, 0], end: [0, 0] },
                { name: 'garden', start: [1, 0], end: [1, 0] },
            ]}
            >
                <Box gridArea="garden" margin = "small" align = "center">
                    <canvas 
                        ref="canvas" 
                        width={this.state.cellsX * this.state.cellSize} 
                        height={this.state.cellsY * this.state.cellSize} 
                        style={{backgroundColor:'#A0522D'}} 
                        onMouseDown={e => this.handleMouseDown(e)} 
                        onMouseUp={e => this.handleMouseUp(e)} 
                    />
                    <Box gap = "small" direction = "row" margin = "small" align = "center" justify="evenly">
                        <Clear color = "black" size="large" onClick={() => this.deleteSelected()} />
                        <ZoomIn color = "black" size="large" onClick={() => this.updateZoom(-1)} />
                        <ZoomOut color = "black" size="large" onClick={() => this.updateZoom(1)} />
                        <Grid rows = {['40px','40px','40px']} columns = {['40px','40px','40px']} areas={[
                            { name: 'up', start: [1, 0], end: [1, 0] },
                            { name: 'left', start: [0, 1], end: [0, 1] },
                            { name: 'right', start: [2, 1], end: [2, 1] },
                            { name: 'down', start: [1, 2], end: [1, 2] },
                        ]}>
                            <Box gridArea = 'down'>
                                <CaretDown color = "black" size="large" onClick={() => this.moveGrid(0,1)} />
                            </Box>
                            <Box gridArea = 'right'>
                                <CaretNext color = "black" size="large" onClick={() => this.moveGrid(1,0)} />
                            </Box>
                            <Box gridArea = 'up'>
                                <CaretUp color = "black" size="large" onClick={() => this.moveGrid(0,-1)} />
                            </Box>
                            <Box gridArea = 'left'>
                                <CaretPrevious color = "black" size="large" onClick={() => this.moveGrid(-1,0)} />
                            </Box>
                        </Grid>
                        <Box>
                        <canvas 
                        ref="navCanvas" 
                        width={(this.state.gardenX / (this.state.gardenX + this.state.gardenY)) * 400}
                        height={(this.state.gardenY / (this.state.gardenX + this.state.gardenY)) * 400}
                        style = {{backgroundColor:'#ffffff', opacity:'0.8'}}
                        />
                        </Box>
                    </Box>
                </Box>
                <Box gridArea="crops" gap = "xsmall" pad = "xsmall">
                        {cropComponents}
                </Box>
            </Grid>                            
        )
    }

    applyZoom(newZoom)
    {
        let cellsX, cellsY;
        //setting new width
        if( this.state.gardenX / newZoom <= this.state.displayableX)
        {
            cellsX = this.state.gardenX / newZoom;
        }
        else
        {
            cellsX = this.state.displayableX;
        }
        //setting new length
        if( this.state.gardenY / newZoom <= this.state.displayableY)
        {
            cellsY = this.state.gardenY / newZoom;
        }
        else
        {
            cellsY = this.state.displayableY;
        }
        //setting everything
        console.log(cellsX, cellsY);
        let brx = Math.floor(this.state.topLeft.x + cellsX * newZoom);      
        if(brx > this.state.gardenX)
        {
            cellsX = Math.floor((this.state.gardenX - this.state.topLeft.x) / newZoom);
            brx = this.state.gardenX;
        }
        else
        {
            cellsX = Math.floor(cellsX);
        }
        let bry = Math.floor(this.state.topLeft.y + cellsY * newZoom);      
        if(bry > this.state.gardenY)
        {
            cellsY = Math.floor((this.state.gardenY - this.state.topLeft.y) / newZoom);
            bry = this.state.gardenY;
        }
        else
        {
            cellsY = Math.floor(cellsY);
        }
        this.setState({
                zoom: newZoom,
                cellsX: cellsX,
                cellsY: cellsY,
                bottomRight:{
                    x: brx,
                    y: bry
                }           
            },
                () => PlantingApi.getPlantedCrops(this.state.contentId, this.state.zoom, this.state.topLeft.x, this.state.topLeft.y, this.state.bottomRight.x, this.state.bottomRight.y).then(data => {
                    this.drawGarden(data);
                }) 
        );
    }

    updateZoom(delta) {
        if(!this.state.drawn)
            return;
        this.setState({drawn: false});
        let zoomSpeed = 0.5;
        let newZoom = this.state.zoom + (delta < 0 ? -zoomSpeed : zoomSpeed );
        if(newZoom < 1)
        {
            newZoom = 1;
            if(this.state.zoom === 1)
            {
                this.setState({drawn: true});
                return;
            }
        }
        else if (newZoom >= this.state.maxZoom + zoomSpeed)
        {
            this.setState({drawn: true});
            return;
        }
        this.applyZoom(newZoom);
    }

    moveGrid(x, y)
    {
        let step = Math.floor(this.state.zoom);       
        let xGrowth = 0, yGrowth = 0;
        if(x > 0)
        {
            if(this.state.bottomRight.x + step > this.state.gardenX)
                step = this.state.gardenX - this.state.bottomRight.x;
        }
        if(x < 0)
        {
            if(this.state.topLeft.x - step < 0)
                step = this.state.topLeft.x;
        }
        if(y > 0)
        {
            if(this.state.bottomRight.y + step > this.state.gardenY)
                step = this.state.gardenY - this.state.bottomRight.y;
        }
        if(y < 0)
        {
            if(this.state.topLeft.y - step < 0)
                step = this.state.topLeft.y;
        }
        if(step === 0)
            return;
        //see if the grid can grow...
        if(this.state.cellsX < this.state.displayableX)
            xGrowth = x;
        if(this.state.cellsY < this.state.displayableY)    
            yGrowth = y;
        this.setState(prevState => {
            if(xGrowth === 0 && yGrowth === 0)
                return{
                    drawn: false,
                    topLeft: {
                        x: prevState.topLeft.x + x * step,
                        y: prevState.topLeft.y + y * step
                    },
                    bottomRight: {
                        x: prevState.bottomRight.x + x * step,
                        y: prevState.bottomRight.y + y * step
                    }
                };
            else
                return{
                    drawn: false,
                    topLeft:{
                        x: xGrowth === 1 ? prevState.topLeft.x : prevState.topLeft.x + x * step,
                        y: yGrowth === 1 ? prevState.topLeft.y : prevState.topLeft.y + y * step
                    },
                    bottomRight: {
                        x: xGrowth === -1 ? prevState.bottomRight.x : prevState.bottomRight.x + x * step,
                        y: yGrowth === -1 ? prevState.bottomRight.y : prevState.bottomRight.y + y * step
                    },
                    cellsX: prevState.cellsX + (xGrowth === 0 ? 0 : 1),
                    cellsY: prevState.cellsY + (yGrowth === 0 ? 0 : 1)
                };
        }, () => PlantingApi.getPlantedCrops(this.state.contentId, this.state.zoom, this.state.topLeft.x, this.state.topLeft.y, this.state.bottomRight.x, this.state.bottomRight.y).then(data => {
            this.drawGarden(data);
        }) 
        
        );
    }
}

export default Canvas;