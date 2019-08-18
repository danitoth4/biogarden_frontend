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
                cellSize: null,
                grid: null,
                images: {},
                showPopup: false,
                zoom: null
            };
        this.planting = {};
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.calculateGridSize = this.calculateGridSize.bind(this);
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
        let maxCellsX = w / cS;
        let maxCellsY = h / cS;
        console.log(maxCellsX, maxCellsY);
        // set default zoom 
        let zoom = 1.0;

        // if the window size divided by the cell size is bigger than the number of gardens cells then we are fine otherwise we have to set the zoom to the fraction
        if (maxCellsX > gardenX)
            maxCellsX = gardenX;
        else {
            zoom = gardenX / (maxCellsX);
        }

        if (maxCellsY > gardenY)
        {
            maxCellsY = gardenY;
            maxCellsY = Math.floor(maxCellsY / zoom);
        }
        else {
            //bigger zoom wins so that everything  fits on the screen
            zoom = zoom <= (gardenY / maxCellsY) ? gardenY / maxCellsY : zoom;
            maxCellsX = Math.floor(maxCellsX / zoom);
        }


        let x = new Array(maxCellsY);
        for (let i = 0; i < x.length; ++i) {
            x[i] = new Array(maxCellsX);
        }

        await this.setState(
            {
                maxCellsX: maxCellsX, //how many cells are displayed
                maxCellsY: maxCellsY, // how many cells are displayed
                cellSize: cS, //how many pixels is a cell
                grid: x,
                displayableX: w / cS, //how many cells can fit on the screen
                displayableY: h / cS, //how many cells can fit on the screen
                gardenX: gardenX, //how wide the garden is
                gardenY: gardenY, //how long the garden is
                topLeft: { x: 0, y: 0 }, //the garden coordinates of the cell in the top left corner
                bottomRight: { x: gardenX, y: gardenY }, //the garden coordinates of the cell in the bottom right corner
                zoom: zoom, // git history tells a story :)
                maxZoom: zoom
            }
        );
    } 

    updateZoom(delta) {
        let zoomSpeed = 0.05;
        let newZoom = this.state.zoom + (delta < 0 ? -zoomSpeed : zoomSpeed );
        if(newZoom < 1)
        {
            newZoom = 1;
            if(this.state.zoom === 1)
                return;
        }
        else if (newZoom >= this.state.maxZoom + zoomSpeed)
        {
            return;
        }
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
        this.setState(prevState => {
            return{
                zoom: newZoom,
                maxCellsX: Math.floor(cellsX),
                maxCellsY: Math.floor(cellsY),
                bottomRight:{
                    x: Math.floor(prevState.topLeft.x + (cellsX  * newZoom)),
                    y: Math.floor(prevState.topLeft.y + (cellsY * newZoom))
                }
            }
        },
            () => PlantingApi.getPlantedCrops(this.state.id, this.state.zoom, this.state.topLeft.x, this.state.topLeft.y, this.state.bottomRight.x, this.state.bottomRight.y).then(data => {
                this.drawGarden(data);
            }) 
        );
    }

    async componentDidMount() {
        await this.calculateGridSize();

        window.addEventListener("resize", this.calculateGridSize);
        if (this.refs.canvas) {
            this.refs.canvas.addEventListener("wheel", (e) => this.updateZoom(e.deltaY));
        }

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

        PlantingApi.getPlantedCrops(this.state.id, this.state.zoom, this.state.topLeft.x, this.state.topLeft.y, this.state.bottomRight.x, this.state.bottomRight.y).then(data => {
            this.drawGarden(data);
        }
        );
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.calculateGridSize());
    }

    drawGrid() {
        const canvas = this.refs.canvas;
        //HACK :(
        if (!canvas)
            return;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.setLineDash([2, 5,]);
        
        for(let i = 0; i  < this.state.maxCellsY; ++i)
        {
            ctx.moveTo(0, i * this.state.cellSize);
            ctx.lineTo(this.state.maxCellsX * this.state.cellSize, i * this.state.cellSize);
            ctx.stroke();
        }
        for(let i = 0; i < this.state.maxCellsX ; ++i)
        {
            ctx.moveTo(i * this.state.cellSize, 0);
            ctx.lineTo(i * this.state.cellSize, this.state.maxCellsY * this.state.cellSize);
            ctx.stroke();
        }
    }

    drawGarden(data) {
        this.drawGrid();
        const canvas = this.refs.canvas;
        //HACK :(
        if (!canvas)
            return;
        const ctx = canvas.getContext("2d");
        for (let i = 0; i < data.length; ++i) {
            for (let x = data[i].startX; x < data[i].endX; ++x) {
                for (let y = data[i].startY; y < data[i].endY; ++y) {
                    this.state.grid[y][x] = data[i];
                }
            }
        }
        for (let i = 0; i < data.length; ++i) {
            if (data[i]) {
                //i hope one day i will write code that doesn't make me cry the next time i look at it...
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
    }

    //event handlers

    handleMouseDown(e) {
        this.planting.x1 = this.convertToGardenCoordinate(e.clientX);
        this.planting.y1 = this.convertToGardenCoordinate(e.clientY);
    }

    handleMouseUp(e) {
        this.planting.x2 = this.convertToGardenCoordinate(e.clientX) + 1;
        this.planting.y2 = this.convertToGardenCoordinate(e.clientY) + 1;
        this.togglePopup();
    }

    convertToGardenCoordinate(value) {
        return Math.floor(value / this.state.cellSize);
    }

    cropSelected(crop) {
        this.togglePopup();
        this.planting.crop = crop;
        this.planting.method = "ADDED";
        PlantingApi.modifyCrops(this.planting, this.state.id, this.state.zoom, this.state.topLeft.x, this.state.topLeft.y, this.state.bottomRight.x, this.state.bottomRight.y).then(data => { this.drawGarden(data) });
    }

    deleteSelected() {
        this.togglePopup();
        this.planting.method = "DELETED";
        PlantingApi.modifyCrops(this.planting, this.state.id, this.state.zoom, this.state.topLeft.x, this.state.topLeft.y, this.state.bottomRight.x, this.state.bottomRight.y).then(data => { this.drawGarden(data) });
    }

    render() {
        if(!this.state.topLeft || !this.state.bottomRight)
            return(<h1>Loading...</h1>);
        const styles =
        {
            border: "10px solid",
            backgroundColor: "#10d035", //light green

        }

        //console.log(this.state);

        return (
            <div>
                <canvas ref="canvas" width={this.state.maxCellsX * this.state.cellSize} height={this.state.maxCellsY * this.state.cellSize} style={styles} onMouseDown={e => this.handleMouseDown(e)} onMouseUp={e => this.handleMouseUp(e)} />
                {this.state.showPopup ?
                    <Popup text='Close Me' closePopup={this.togglePopup.bind(this)} cropSelected={this.cropSelected.bind(this)} deleteSelected={this.deleteSelected.bind(this)} cropData={CropApi.getAllCrops()} />
                    : null
                }
            </div>
        )
    }
}

export default Canvas;