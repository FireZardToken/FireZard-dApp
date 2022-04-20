import React from 'react'
import ReactTooltip from 'react-tooltip'
import Clipboard from 'react-clipboard.js'
import { config } from "../constances"

export default function Address(props) {
  let id=Math.random().toString(36)
  return (
    <span>
      <a rel="noopener noreferrer" target="_blank" href={`${config.etherscan_baseURL}/${props.token?"token":"address"}/${props.a}`}><code>{props.a.slice(0, 8)+'...'+props.a.slice(props.a.length-8)}</code></a>
      &nbsp;<Clipboard 
        component="span"
        onSuccess={e => {
          setTimeout(() => ReactTooltip.hide(), 2000);
        }} data-event="click" data-for={id} data-tip="Address Copied To Clipboard!" data-clipboard-text={props.a}><span

        title="Copy address to clipboard"
        style={{
        cursor:'pointer'
      }} className="fas fa-paste"></span></Clipboard>
      <ReactTooltip id={id} effect="solid" />
    </span>
  )
}
