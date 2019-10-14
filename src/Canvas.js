import React from 'react';
import Popup from './components/Popup';
import CropApi from './api/CropApi';
import PlantingApi from './api/PlantingApi';
import GardenApi from './api/GardenApi';

class Canvas extends React.Component {
    constructor(props) {
        super(props);

        this.state =
            {
                id: this.props.match.params.gardenId,
                contentId: this.props.match.params.contentId,
                cellSize: null,
                grid: null,
                images: {},
                showPopup: false,
                zoom: null,
                drawn: false
            };
        this.planting = {};
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.calculateGridSize = this.calculateGridSize.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    togglePopup() {
        this.setState(prevState => {
            return {
                showPopup: !prevState.showPopup
            }
        });
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

        let w = (window.innerWidth - cS) - window.innerWidth % cS;
        let h = (window.innerHeight - cS) - window.innerHeight % cS;
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
                gardenX: gardenX, //how wide the garden is
                gardenY: gardenY, //how long the garden is
                topLeft: { x: 0, y: 0 }, //the garden coordinates of the cell in the top left corner
                bottomRight: { x: gardenX, y: gardenY }, //the garden coordinates of the cell in the bottom right corner
                zoom: zoom, // git history tells a story :)
                maxZoom: zoom
            }, () => this.applyZoom(zoom)
        );
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
            console.log("wau");
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
            console.log("wau");
        }
        else
        {
            cellsY = Math.floor(cellsY);
        }
        console.log(cellsX, cellsY);
        //let bry = Math.floor(this.state.topLeft.y + cellsY * newZoom);
        //cellsY = Math.floor(cellsY);
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

    async componentDidMount() {
        //getting the images
        CropApi.getAllCrops()
        .then(data => {
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

        if (this.refs.canvas) {
            this.refs.canvas.addEventListener("wheel", (e) => this.updateZoom(e.deltaY));
            document.addEventListener("keydown", (e) => this.handleKeyDown(e));
        }
    }

    componentWillUnmount() {
        this.refs.canvas.removeEventListener("wheel", (e) => this.updateZoom(e.deltaY));
    }

    drawGrid(ctx) {
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
        //HACK :(
        if (!canvas)
            return;
        const ctx = canvas.getContext("2d");
        ctx.save();
        this.drawGrid(ctx);
        /*for (let i = 0; i < data.length; ++i) {
            for (let x = data[i].startX; x < data[i].endX; ++x) {
                for (let y = data[i].startY; y < data[i].endY; ++y) {
                    this.state.grid[y][x] = data[i];
                }
            }
        }*/
        for (let i = 0; i < data.length; ++i) {
            if (data[i]) {
                let xsize = data[i].endX - data[i].startX;
                let ysize = data[i].endY - data[i].startY;
                let imageObj = new Image();
                imageObj.i = data[i].startX * this.state.cellSize + this.state.cellSize * 0.05 * xsize;
                imageObj.j = data[i].startY * this.state.cellSize + this.state.cellSize * 0.05 * ysize;
                let cS = this.state.cellSize;
                imageObj.onload = function () {
                    ctx.drawImage(this, this.i, this.j, xsize * cS * 0.9, ysize * cS * 0.9);
                }
                imageObj.src = this.state.images[data[i].cropTypeId];
            }
        }
        ctx.restore();
        this.setState({drawn: true});
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

    //event handlers

    handleKeyDown(e) {
        switch(e.code)
        {
            case "ArrowUp":
                this.moveGrid(0, -1);
                break;
            case "ArrowDown":
                this.moveGrid(0, 1);
                break;
            case "ArrowLeft":
                this.moveGrid(-1, 0);
                break;
            case "ArrowRight":
                this.moveGrid(1, 0);
                break;
            default: return;
        }
    }

    handleMouseDown(e) {
        this.planting.x1 = this.convertToGardenCoordinate(e.clientX);
        this.planting.y1 = this.convertToGardenCoordinate(e.clientY);
    }

    handleMouseUp(e) {
        this.planting.x2 = this.convertToGardenCoordinate(e.clientX);
        this.planting.y2 = this.convertToGardenCoordinate(e.clientY);
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
        this.togglePopup();
    }

    convertToGardenCoordinate(value) {
        return Math.floor(value / this.state.cellSize);
    }

    cropSelected(crop) {
        this.togglePopup();
        this.planting.crop = crop;
        this.planting.method = "ADDED";
        PlantingApi.modifyCrops(this.planting, this.state.contentId, this.state.zoom, this.state.topLeft.x, this.state.topLeft.y, this.state.bottomRight.x, this.state.bottomRight.y).then(data => { this.drawGarden(data) });
    }

    deleteSelected() {
        this.togglePopup();
        this.planting.method = "DELETED";
        PlantingApi.modifyCrops(this.planting, this.state.contentId, this.state.zoom, this.state.topLeft.x, this.state.topLeft.y, this.state.bottomRight.x, this.state.bottomRight.y).then(data => { this.drawGarden(data) });
    }

    render() {
        if(!this.state.cellsX || !this.state.cellsY)
            return(<h1>Loading...</h1>);
        const styles =
        {
            border: "10px solid",
            backgroundColor: "#10d035", //light green
        }
        return (
            <div>
                <canvas ref="canvas" width={this.state.cellsX * this.state.cellSize} height={this.state.cellsY * this.state.cellSize} style={styles} onMouseDown={e => this.handleMouseDown(e)} onMouseUp={e => this.handleMouseUp(e)} />
                {this.state.showPopup ?
                    <Popup text='Close Me' closePopup={this.togglePopup.bind(this)} cropSelected={this.cropSelected.bind(this)} deleteSelected={this.deleteSelected.bind(this)} cropData={CropApi.getAllCrops()} />
                    : null
                }
            </div>
        )
    }
}

export default Canvas;