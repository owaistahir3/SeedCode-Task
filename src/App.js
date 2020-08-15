import React, { useEffect, useState } from "react";
// import logo from './logo.svg';
import "./App.css";
import { ApiPromise, WsProvider } from "@polkadot/api";
// const wsProvider = new WsProvider("wss://rpc.polkadot.io");
// const api = await ApiPromise.create({ provider: wsProvider });

function App() {
  const [validatorsCount, setValidatorsCount] = useState(
    "Validators count loading"
  );
  const [validators, setvalidators] = useState("Loading...");
  const [validatorBalances, setvalidatorBal] = useState("Loading...");
  const [rpcChain, setRPCchain] = useState("Loading...");
  const [data, setData] = useState([]);
  const wsProvider = new WsProvider("wss://rpc.polkadot.io");

  useEffect(() => {
    async function invokeFunction() {
      try {
        console.log("Making Request Please Wait....");
        const wsProvider = new WsProvider("wss://rpc.polkadot.io");
        const api = await ApiPromise.create({ provider: wsProvider });
        // Do something
        // saving data from 1st api in validatedCount
        const valdateCount = await api.query.staking.validatorCount();
        // saving data from 2nd api in validators
        const validators = await api.query.session.validators();
        // saving data from 3rd api in validators
        const rpcChain = await api.rpc.system.chain();
        // saving data from 4th api
        const chainHeader = api.rpc.chain.getHeader();
        // saving data from 5th api
        const currentIdx = api.query.session.currentIndex();

        await api.rpc.chain.subscribeNewHeads((lastHeader) => {
          setData((prevData) => {
            return prevData.concat({
              block: lastHeader.number,
              hash: lastHeader.hash,
            });
          });
        });

        console.log("Request Completed");
        console.log("valdateCount", valdateCount);
        console.log("validators", validators);
        console.log("rpcChain", rpcChain);
        console.log("chainHeader", chainHeader);
        console.log("currentIdx", currentIdx);
        setvalidators(validators);
        setValidatorsCount(valdateCount);
      } catch (err) {
        console.log(err);
      }
    }
    invokeFunction();
  }, []);

  // const validatorBalances = await Promise.all(
  //   validators.map((authorityId) =>
  //     api.query.system.account(authorityId)
  //   )
  // );
  const { words } = validatorsCount;
  return (
    <div className="app">
      <div className="app_header">
        <h1>Staking Data Visualizer</h1>
      </div>
      <div className="app_body">We'll visualize stats here!</div>
      <div>
        <h1> {words ? ` Count ${words}` : validatorsCount}</h1>
      </div>
      <div>
        <h6>Last block</h6>
        {<h1>{data.length ? `${data[data.length - 1]?.block}` : "loading..."}</h1>}
      </div>
      <div>
        {Array.isArray(validators) &&
          validators.map((item) => {
            return (
              <p>
                validator ==={'>'} {item}
              </p>
            );
          })}
      </div>
    </div>
  );
}

export default App;
