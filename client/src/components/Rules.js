import './rules.css'
function Rules({startButton}) {
  return (
    <>
     <div className="rules">
      <div className="card text-center">
        <div className="card-header"> <h5 className="card-title">
            Rules
          </h5></div>
        <div className="card-body">
          {/* <h5 className="card-title">Special title treatment</h5> */}
          <p className="card-text">
            Catch mukhiya at marathon.
          </p>
          <p className="card-text">
            Click pictures of mukhiya offering maaza.
          </p>
          <button onClick={startButton} className='btn btn-primary'>Start game</button>
        </div>
        {/* <div className="card-footer text-body-secondary">2 days ago</div> */}
      </div>
      </div>
    </>
  );
}

export default Rules;
