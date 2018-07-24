import React, { Component } from 'react'
import './index.less'

class VCode extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ...this.initState(),
            refresh: false
        }
    }

    initState() {
        return {
            data: this.getRandomStr(4),
            rotate: this.getRandom(75, -75, 4),
            color: [this.getRandom(100, 255, 3), this.getRandom(100, 255, 4), this.getRandom(100, 255, 3), this.getRandom(100, 255, 3)]
        }
    }

    getRandom(max, min, num) {
        const asciiNum = ~~(Math.random() * (max - min + 1) + min)
        if (!Boolean(num)) {
            return asciiNum
        }
        const arr = []
        for (let i = 0; i < num; i++) {
            arr.push(this.getRandom(max, min))
        }
        return arr
    }
    getRandomStr(num) {
        var str = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            arr = [];
        for (var i = 0; i < num; i++) {
            var rand = Math.floor(Math.random() * str.length);
            arr.push(str.charAt(rand));
        }
        return arr;
    }
    canvas() {
        const { getRandom } = this
        const canvas = document.getElementById('bgi')
        let ctx = canvas.getContext('2d')
        canvas.height = canvas.height
        // ctx.clearRect(0, 0, canvas.width(), canvas.height())
        ctx.strokeStyle = `rgb(${this.getRandom(100, 10, 3).toString()})`
        for (let i = 0; i < 7; i++) {
            ctx.lineTo(getRandom(200, 0), getRandom(200, 10))
            ctx.moveTo(getRandom(200, 0), getRandom(200, 0))
            ctx.stroke();
        }
    }
    componentDidMount() {
        this.canvas()
    }
    componentDidUpdate() {
        this.props.onRef(this)
    }
    render() {
        const { rotate, color, data } = this.state
        return (
            <div className='vcodewrap' >
                <canvas id="bgi" width="200" height="200"></canvas>
                {this.state.data.map((v, i) =>
                    <div
                        key={i}
                        className='itemStr'
                        style={{
                            transform: `rotate(${rotate[i]}deg)`,
                            fontSize: `20px`,
                            color: `rgb(${color[i].toString()})`
                        }}
                        onMouseEnter={() => this.setState({ refresh: true })}
                    >
                        {data[i]}
                    </div>
                )}
                {
                    this.state.refresh
                        ? <div
                            className='mask'
                            onClick={() => {
                                this.setState({ ...this.initState(), refresh: false })
                                this.canvas()
                            }}
                            onMouseLeave={() => { this.setState({ refresh: false }) }}
                        >
                        </div>
                        : null}
            </div>
        )
    }
}

export default VCode;