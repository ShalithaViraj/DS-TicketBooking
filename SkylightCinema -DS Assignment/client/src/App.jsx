
import Header from './components/common/Header/Header';
import MainScreen from './components/MainScreen';

const App = () => {
  return (
    <>
      <div className='container-fluid m-0 p-0'>
        <div className="row">
          <div className="col-md-12">
            <Header />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <MainScreen />
          </div>
        </div>
      </div>
    </>
  )
}

export default App;