import React, { useState, useEffect } from 'react'
import icon from '../media/logo_small.svg'

export function Menu () {
  const [expanded, setExpanded] = useState(false)

  console.log({icon})
  return (
  
    <div>

      <style>
        {`

    @media screen and (max-width: 896px) {
      .__db__container {
        right: 40px !important;
      }
    }

    .__db__container {
      right: 380px;
      transition: all 400ms
    }
    
    `}
      </style>
      <div  style={{
        position: 'absolute', top: 0, bottom:0, left:0, right:0, display: expanded ? '':'none', opacity: 0.3, backgroundColor: 'black',
      }}
      onClick={()=>{setExpanded(false)}}
      >

      </div>
      <div className="__db__container" style={{backgroundColor:'aliceblue', position: 'absolute', top:expanded ? 0 : -308,  height:300}}>
        
        <div>
          content
        </div>
        <div style={{position:'relative', top: '100%', height: 50}}
    
          onClick={()=>{
            setExpanded(true)
          }}
        >
          <img src={icon} width={32} />
        </div>
      </div>

    </div>)
}
