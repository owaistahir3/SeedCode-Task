import React, { useEffect, useState } from "react";
// import logo from './logo.svg';
import "./App.css";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { Card, Table, icon } from "antd";
// const wsProvider = new WsProvider("wss://rpc.polkadot.io");
// const api = await ApiPromise.create({ provider: wsProvider });

function App() {
  const [validateCount, setValidatorsCount] = useState("Count loading...");
  const [validators, setvalidators] = useState("Loading...");

  const [validatorBalances, setvalidatorBal] = useState("Loading...");

  const [rpcChain, setRPCchain] = useState("Loading...");

  const [chainHeader, setchainHeader] = useState("Loading...");

  const [SubscriptionData, setData] = useState([]);
  const [data, setValidatorData] = useState([]);

  const wsProvider = new WsProvider("wss://rpc.polkadot.io");

  useEffect(() => {
    async function invokeFunction() {
      try {
        console.log("Making Request Please Wait....");
        const wsProvider = new WsProvider("wss://rpc.polkadot.io");
        const api = await ApiPromise.create({ provider: wsProvider });
        // Do something
        // saving data from 1st api in validatedCount
        const validateCount = await api.query.staking.validatorCount();
        // saving data from 2nd api in validators
        const validators = await api.query.session.validators();
        // saving data from 3rd api in validators
        const rpcChain = await api.rpc.system.chain();
        // saving data from 4th api
        const chainHeader = api.rpc.chain.getHeader();
        // saving data from 5th api
        const currentIdx = api.query.session.currentIndex();
        const myvalData = [];

        await api.rpc.chain.subscribeNewHeads((lastHeader) => {
          setData((prevData) => {
            return prevData.concat(
              `Last block number: ${lastHeader.number} | has hash: ${lastHeader.hash}`
            );
          });
        });

        setValidatorData(validators.map((item, key)=> ({
          key: `${key}`,
          id: `${key}`,
          validators: `${item}`
        })));
        console.log("Request Completed");
        console.log(validateCount.words[0]);
        setValidatorsCount(validateCount.words[0]);
        console.log(validators);
        setvalidators(validators);
        console.log(rpcChain);
        console.log(chainHeader);
        console.log(currentIdx);
      } catch (err) {
        console.log(err);
      }
    }
    invokeFunction();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Validators",
      dataIndex: "validators",
      key: "validators",
    },
  ];
  // let mydata = [];
  // for (let i = 0; i <= 197; i++) {
  //   data.push({
  //     key: i,
  //     id: i,
  //     validators: validators[i],
  //   });
  // }
  // setValidatorData(mydata);
  // validatorsList = () => {};

  Array.isArray(validators) &&
    validators.map((item, key) => {
      console.log("===========>", key);
      // console.log("================>", validatorBalances[item]);
      data.push({
        key: key,
        id: key,
        validators: item,
      });
    });

  // setValidatorData(mydata);
  console.log('====>', data);
  return (
    <div className="app">
      <div className="app_header">
        <h1>Staking Data Visualizer</h1>
      </div>
      <div className="app_body">
        {/*  We'll visualize stats here! */}
        <div style={{ fontSize: 12, padding: "10px" }}>
          <p>
            <b>Validators Count: </b>
            {validateCount}
          </p>
          <Table
            size="small"
            columns={columns}
            dataSource={data}
            bordered={true}
            style={{ fontSize: 12 }}
          />
        </div>

        <div style={{ background: "#ECECEC", padding: "30px", fontSize: 12 }}>
          <Card
            title="Head Subscribtions"
            bordered={false}
            style={{ width: "auto" }}
          >
            <div style={{ overflowY: "scroll", height: "120px" }}>
              {" "}
              <ol>
                {SubscriptionData.map((item) => {
                  console.log('======>', item);
                  return <li style={{ fontSize: 12 }}>{item}</li>;
                })}
              </ol>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;