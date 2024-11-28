import React from 'react'
import './index.css'
import '../Airline/Stars/Hover'

const Rating = (props) => {
    const score = (props.score/5) * 100
    return (
        <span className='star-wrapper'>
            <span className='stars' style={{width: score + "%"}}></span>
        </span>
    )
}

export default Rating