import React from 'react';
import axios from 'axios';
import './App.css';

function SinkView(props: { sinks: string[], selected: string[], refetch: () => void }) {
  return (
    <>
      <h2>💡 Sinks</h2>
      {props.sinks.map(s => <Sink key={s} sink={s} isSelected={props.selected.includes(s)} refetch={props.refetch} />)}
    </>
  );
}

function Sink(props: { sink: string, isSelected: boolean, refetch: () => void }) {
  return (
    <>
      <input type="checkbox" checked={props.isSelected} value={props.sink} onChange={(e) => setSink(e.target.value, e.target.checked).then(props.refetch)} />
      <label htmlFor={props.sink}>{props.sink}</label><br/>
    </>
  );
}

const setSink = (key: string, enabled: boolean) => axios.put('http://localhost:4000/sink', { key, enabled });

export default SinkView;
