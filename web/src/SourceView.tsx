import React from 'react';
import axios from 'axios';
import './App.css';

function SourceView(props: { sources: string[], selected: string, refetch: () => void }) {
  return (
    <>
      <h2>🎵 Source</h2>
      {props.sources.map(s => <Source key={s} source={s} isSelected={props.selected === s} refetch={props.refetch} />)}
    </>
  );
}

function Source(props: { source: string, isSelected: boolean, refetch: () => void }) {
  return (
    <>
      <input type="radio" name="source" checked={props.isSelected} value={props.source} onChange={(e) => setSource(e.target.value).then(props.refetch)} />
      <label htmlFor={props.source}>{props.source}</label><br/>
    </>
  );
}

const setSource = (key: string) => axios.put('http://localhost:4000/source', { key });

export default SourceView;
