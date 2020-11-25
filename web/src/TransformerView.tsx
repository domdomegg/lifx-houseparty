import React from 'react';
import axios from 'axios';
import './App.css';

function TransformerView(props: { transformers: string[], selected: string, refetch: () => void }) {
  return (
    <>
      <h2>✨ Transformer</h2>
      {props.transformers.map(t => <Transformer key={t} transformer={t} isSelected={props.selected === t} refetch={props.refetch} />)}
    </>
  );
}

function Transformer(props: { transformer: string, isSelected: boolean, refetch: () => void }) {
  return (
    <>
      <input type="radio" name="transformer" checked={props.isSelected} value={props.transformer} onChange={(e) => setTransformer(e.target.value).then(props.refetch)} />
      <label htmlFor={props.transformer}>{props.transformer}</label><br/>
    </>
  );
}

const setTransformer = (key: string) => axios.put('http://localhost:4000/transformer', { key });

export default TransformerView;
