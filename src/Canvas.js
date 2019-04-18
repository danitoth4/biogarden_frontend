import React from 'react';

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

        x[2][5] = "http://designingflicks.com/images/strawberry-svg-4.png";
        x[3][10] = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Bananas.svg/1280px-Bananas.svg.png";

        this.state = 
        {
            drawn: false,
            width: w,
            height: h,
            cellSize: cS,
            grid: x,
            images: {}
        };

        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() 
    {
        this.drawGrid();
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
        if(this.state.drawn)
            return;
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext("2d");
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

        for(let i = 0; i < this.state.grid.length; ++i)
        {
            for(let j = 0; j < this.state.grid[i].length; ++j)
            {
                if(this.state.grid[i][j] != null )
                {                   
                    let imageObj = new Image();
                    let size = this.state.cellSize * 0.7;
                    imageObj.i = i * this.state.cellSize + this.state.cellSize * 0.15;
                    imageObj.j = j * this.state.cellSize + this.state.cellSize * 0.15;
                    imageObj.onload = function()
                    {
                        ctx.drawImage(this, this.j, this.i, size, size);
                    }
                    imageObj.src = this.state.grid[i][j];
                
                }
            }
        }
        this.setState(
            {
                drawn: true
            }
        );
    } 

    handleClick(e)
    {
        
        const canvas = this.refs.canvas;
        const ctx = canvas.getContext("2d");
    }

    render() 
    {
        const styles = 
        {
            margin: "10px",
            border: "2px solid", 
            backgroundColor: "#70e335" //light green
        }
        return(
          <div>
            <canvas ref="canvas" width={this.state.width} height={this.state.height} style={styles} onClick = {e => this.handleClick(e)}/>           
          </div>
        )
    }
}

export default Canvas;