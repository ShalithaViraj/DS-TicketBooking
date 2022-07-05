import './MainScreen.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

import AlertMsg from '../common/AlertMsg';
import Booking from '../Booking';

const MainScreen = () => {
    const [isMovieDetailsShow, setMovieDetailsShow] = useState(false);
    const [selectMovie, setSelectMovie] = useState({});
    const [isLogged, setLogged] = useState(false);
    const [arrMovies, setMovie] = useState([]);

    useEffect(() => {
        if (localStorage.getItem('objUser')) { setLogged(true); }
        fnFetchMovies();
    }, []);

    const fnFetchMovies = async () => {
        const resMovies = await axios.get('http://localhost:5000/api/movie/getAllMovies');
        if (resMovies.data.booStatus) {
            setMovie(resMovies.data.objResponse);
        } else { AlertMsg(false, resMovies.data.objResponse) }
    };

    const MovieCard = ({ objMovie }) => {
        return <div className="m-2 p-0" style={{ width: '276px' }}>
            <div className="card m-0 p-0">
                <img className="card-img-top card-movie-poster m-0 p-0" src="http://localhost:5000/MoviePosters/MOV2548578-poster.jpg" alt="Movie Poster" />
                <div className="card-body">
                    <h5 className="card-title">{objMovie.strMovieName}</h5>
                    <p className="card-text">{objMovie.strMovieDesc}</p>
                    <div className="d-flex align-items-center">
                        <p className="card-text font-weight-bold"><i className="fa fa-star text-primary mr-2" aria-hidden="true" /> {objMovie.strMovieIMDB} </p>
                    </div>
                    <div className="d-flex align-items-center">
                        <p className="card-text font-weight-bold" onClick={() => window.open(`${objMovie.strMovieTrailer}`, '_blank')}>
                            <i className="fa fa-youtube-play text-danger mr-2" aria-hidden="true" /> Watch Trailer
                        </p>
                    </div>
                    {isLogged && <button className='btn btn-info mt-2 m-0 p-1 font-weight-bold w-100' onClick={() => { setSelectMovie(objMovie); setMovieDetailsShow(true); }}>Booking Ticket</button>}
                </div>
            </div>
        </div>
    };

    return (
        <>
            <Booking
                show={isMovieDetailsShow} 
                onHide={() => setMovieDetailsShow(false)} 
                objMovie={selectMovie}
            />
            <div className="row m-0 p-3">
                <div className="col-md-12 m-0 p-0">
                    <span className="font-weight-bold text-white badge badge-info" style={{ fontSize: '22px' }}>
                        NOW SHOWING AT SKYLIGHT CINEMA
                    </span>
                </div>
                <div className="col-md-12 m-0 mt-2 p-0">
                    <div className="card-group">
                        {arrMovies.map((objMovie) => (<MovieCard objMovie={objMovie} key={objMovie.strMovieCode} />))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default MainScreen;