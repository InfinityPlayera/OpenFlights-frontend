import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Header from './Header'
import styled from 'styled-components'
import ReviewForm from './ReviewForm'
import Review from './Review'

const Wrapper = styled.div`
    margin-left: auto; 
    margin-right: auto;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
`

const Column = styled.div`
    background: #fff;
    height: 100vh;
    overflow: scroll;

    &:last-child {
        background: #000;
    }
`

const Main = styled.div`
    padding-left: 50px;
`

const Airline = () => {
    const { slug } = useParams();
    const [airline, setAirline] = useState({})
    const [review, setReview] = useState({})
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {

        const url = `${process.env.REACT_APP_API_URL}/api/v1/airlines/${slug}`

        axios.get(url)
            .then(res => {
                setAirline(res.data)
                setLoaded(true)
            })
            .catch(res => console.log(res))
    }, [])

    const handleChange = (e) => {
        e.preventDefault()

        setReview(Object.assign({}, review, { [e.target.name]: e.target.value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // const csrfToken = document.querySelector('[name=csrf-token]')
        // console.log(csrfToken)
        // axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken.content
        const airline_id = airline.data.id
        axios.post(`${process.env.REACT_APP_API_URL}/api/v1/reviews`, { review, airline_id })
            .then(res => {
                const included = [...airline.included, res.data.data]
                console.log(included)
                setAirline({ ...airline, included })
                setReview({ title: '', description: '', score: 0})
            })
            .catch(res => { console.log(res) })
    }

    const setRating = (score, e) => {
        e.preventDefault()
        setReview({ ...review, score })
    }

    let reviews
    if(loaded && airline) {
        reviews = airline.included.map((item, index) => {
            return(
                <Review
                    key={index}
                    attributes={item.attributes}
                />
            )
        })
    }

    return (
        <Wrapper>
            {
                loaded &&
                <>
                    <Column>
                        <Main>

                            <Header
                                attributes={airline.data.attributes}
                                reviews={airline.included}
                            />
                            {reviews}
                        </Main>
                    </Column>

                    <Column>
                        <ReviewForm
                            handleChange={handleChange}
                            handleSubmit={handleSubmit}
                            setRating={setRating}
                            attributes={airline.data.attributes}
                            review={review}
                        />
                    </Column>
                </>
            }
        </Wrapper>
    )
}

export default Airline

