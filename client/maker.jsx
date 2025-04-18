/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
const React = require('react');
const { createRoot } = require('react-dom/client');

const { useState, useEffect } = React;
const helper = require('./helper');

const handleDomo = (e, onDomoAdded) => {
  e.preventDefault();
  helper.hideError();

  const name = document.querySelector('#domoName').value;
  const age = document.querySelector('#domoAge').value;

  if (name === '' || age === '') {
    helper.handleError('All fields are required');
    return false;
  }

  helper.sendPost(e.target.action, { name, age }, onDomoAdded);
  return false;
};

const DomoForm = (props) => (
  <form id="domoForm"
    // eslint-disable-next-line react/prop-types
    onSubmit={(e) => handleDomo(e, props.triggerReload)}
    name="domoForm"
    action="/maker"
    method="POST"
    className="domoForm"
  >
    <label htmlFor="name">Name: </label>
    <input id="domoName" type="text" name="name" placeholder="Domo Name" />
    <label htmlFor="age">Age: </label>
    <input id="domoAge" type="number" name="age" placeholder="age" />
    <input className="makeDomoSubmit" type="submit" value="Make Domo" />
  </form>
);

const DomoList = (props) => {
  // eslint-disable-next-line react/prop-types
  const [domos, setDomos] = useState(props.domos);
  console.log(domos);
  useEffect(() => {
    const loadDomosFromServer = async () => {
      const response = await fetch('/getDomos');
      const data = await response.json();
      setDomos(data.domos);
    };
    loadDomosFromServer();
  // eslint-disable-next-line react/prop-types
  }, [props.reloadDomos]);

  if (domos.length === 0) {
    return (
      <div className="domoList">
        <h3 className="emptyDomo">No Domos yet!</h3>
      </div>
    );
  }

  const domoNodes = domos.map((domo) => (
    <div key={domo.id} className="domo">
      <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
      <h3 className="domoName">Name: {domo.name}</h3>
      <h3 className="domoAge">Age: {domo.age}</h3>
    </div>
  ));

  return (
    <div className="domoList">
      {domoNodes}
    </div>
  );
};

const App = () => {
  const [reloadDomos, setReloadDomos] = useState(false);

  return (
    <div>
      <div id="makeDomo">
        <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
      </div>
      <div id="domoList">
        <DomoList domos={[]} reloadDomos={reloadDomos} />
      </div>
    </div>
  );
};

const init = () => {
  const root = createRoot(document.getElementById('app'));
  root.render(<App />);
};

window.onload = init;
